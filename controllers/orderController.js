const Order = require('../models/Order');
const Product = require('../models/Product');

// POST /api/orders  (logged-in users)
// Body: { items: [{productId, quantity}], shippingAddress: {...}, paymentMethod }
const createOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No items in order.' });
  }

  if (!shippingAddress) {
    return res.status(400).json({ message: 'Shipping address is required.' });
  }

  // Build order items with price snapshots from DB (never trust client-sent prices)
  const orderItems = [];
  let subtotal = 0;

  for (const item of items) {
    const product = await Product.findById(item.productId);

    if (!product) {
      return res.status(404).json({ message: `Product ${item.productId} not found.` });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({ message: `Not enough stock for ${product.name}.` });
    }

    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      quantity: item.quantity,
    });

    subtotal += product.price * item.quantity;

    // Reduce stock
    product.stock -= item.quantity;
    await product.save();
  }

  const shippingCost = subtotal > 3000 ? 0 : 250; // free shipping over Rs.3000
  const total = subtotal + shippingCost;

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod: paymentMethod || 'cod',
    subtotal,
    shippingCost,
    total,
  });

  res.status(201).json({ message: 'Order placed successfully.', order });
};

// GET /api/orders/my  (logged-in user sees their own orders)
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate('items.product', 'name images'); // attach product name & image

  res.json({ count: orders.length, orders });
};

// GET /api/orders/:id  (owner or admin)
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('items.product', 'name images');

  if (!order) {
    return res.status(404).json({ message: 'Order not found.' });
  }

  // Only allow the owner or an admin to view
  const isOwner = order.user._id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: 'Not authorized to view this order.' });
  }

  res.json({ order });
};

// GET /api/orders  (admin only — all orders)
const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .populate('user', 'name email');

  res.json({ count: orders.length, orders });
};

// PATCH /api/orders/:id/status  (admin only)
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  const allowed = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ message: `Invalid status. Allowed: ${allowed.join(', ')}` });
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!order) {
    return res.status(404).json({ message: 'Order not found.' });
  }

  res.json({ message: 'Order status updated.', order });
};

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };
