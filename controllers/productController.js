const Product = require('../models/Product');

// GET /api/products
// Supports: ?category=Rings&featured=true&bestseller=true&search=gold&sort=price_asc
const getProducts = async (req, res) => {
  const { category, featured, bestseller, search, sort } = req.query;

  // Build filter object
  const filter = {};

  if (category) filter.category = category;
  if (featured === 'true') filter.isFeatured = true;
  if (bestseller === 'true') filter.isBestseller = true;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  // Build sort option
  let sortOption = { createdAt: -1 }; // default: newest first
  if (sort === 'price_asc') sortOption = { price: 1 };
  if (sort === 'price_desc') sortOption = { price: -1 };
  if (sort === 'name_asc') sortOption = { name: 1 };

  const products = await Product.find(filter).sort(sortOption);

  res.json({ count: products.length, products });
};

// GET /api/products/:id
const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  res.json({ product });
};

// POST /api/products  (admin only)
const createProduct = async (req, res) => {
  const { name, price, originalPrice, description, category, images, stock, isFeatured, isBestseller } = req.body;

  if (!name || !price || !description || !category) {
    return res.status(400).json({ message: 'name, price, description, and category are required.' });
  }

  const product = await Product.create({
    name,
    price,
    originalPrice: originalPrice || null,
    description,
    category,
    images: images || [],
    stock: stock || 0,
    isFeatured: isFeatured || false,
    isBestseller: isBestseller || false,
  });

  res.status(201).json({ message: 'Product created.', product });
};

// PUT /api/products/:id  (admin only)
const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  // Only update fields that were sent
  const fields = ['name', 'price', 'originalPrice', 'description', 'category', 'images', 'stock', 'isFeatured', 'isBestseller'];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field];
    }
  });

  await product.save();

  res.json({ message: 'Product updated.', product });
};

// DELETE /api/products/:id  (admin only)
const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  res.json({ message: 'Product deleted.' });
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
