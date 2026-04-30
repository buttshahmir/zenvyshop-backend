// Run with: npm run seed
// This creates an admin user + 12 sample products so you can test the API right away.

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./db');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const sampleProducts = [
  {
    name: 'Eternal Gold Chain Necklace',
    price: 4999,
    originalPrice: 6500,
    description: 'A timeless 18K gold-plated chain necklace designed for everyday elegance. Features anti-tarnish technology that keeps it shining for years. Length: 18 inches with 2-inch extender.',
    category: 'Necklaces',
    images: ['https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=600&h=600&fit=crop'],
    stock: 25,
    isBestseller: true,
    isFeatured: true,
  },
  {
    name: 'Royal Pearl Drop Earrings',
    price: 3299,
    originalPrice: 4200,
    description: 'Sophisticated freshwater pearl drop earrings with gold-tone settings. Hypoallergenic and perfect for sensitive ears.',
    category: 'Earrings',
    images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop'],
    stock: 18,
    isBestseller: true,
    isFeatured: true,
  },
  {
    name: 'Minimalist Gold Bangle',
    price: 5999,
    originalPrice: 7500,
    description: 'A sleek, minimalist gold bangle. Stackable design allows you to create your unique look. Diameter: 6.5cm.',
    category: 'Bracelets',
    images: ['https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&h=600&fit=crop'],
    stock: 12,
    isFeatured: true,
  },
  {
    name: 'Diamond Halo Ring',
    price: 8499,
    originalPrice: 11000,
    description: 'Stunning halo ring featuring brilliant-cut cubic zirconia. Anti-tarnish finish ensures lasting brilliance. Sizes 6–9.',
    category: 'Rings',
    images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop'],
    stock: 8,
    isBestseller: true,
  },
  {
    name: 'Layered Moon Pendant',
    price: 3799,
    originalPrice: 4800,
    description: 'Celestial beauty meets modern design. Features a crescent moon and star pendant. Layer 1: 16 inches, Layer 2: 18 inches.',
    category: 'Necklaces',
    images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop'],
    stock: 30,
  },
  {
    name: 'Vintage Hoop Earrings',
    price: 2899,
    originalPrice: 3600,
    description: 'Classic vintage-inspired hoop earrings with intricate engraving. 3cm diameter, lightweight for all-day wear.',
    category: 'Earrings',
    images: ['https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&h=600&fit=crop'],
    stock: 22,
  },
  {
    name: 'Crystal Tennis Bracelet',
    price: 6999,
    originalPrice: 8999,
    description: 'Elegant tennis bracelet with sparkling cubic zirconia stones. Secure clasp and anti-tarnish plating. Length: 7 inches.',
    category: 'Bracelets',
    images: ['https://images.unsplash.com/photo-1602751584552-8ba420552259?w=600&h=600&fit=crop'],
    stock: 10,
    isBestseller: true,
  },
  {
    name: 'Emerald Cut Statement Ring',
    price: 5499,
    originalPrice: 7200,
    description: 'Bold emerald-cut green stone in an ornate gold band. Sizes 6–9 available.',
    category: 'Rings',
    images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop'],
    stock: 6,
  },
  {
    name: 'Heart Locket Necklace',
    price: 4299,
    originalPrice: 5500,
    description: 'Heart-shaped locket that opens to hold a photo. Anti-tarnish gold plating. 20-inch chain.',
    category: 'Necklaces',
    images: ['https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=600&h=600&fit=crop'],
    stock: 15,
  },
  {
    name: 'Stud Earring Set (3 Pairs)',
    price: 3599,
    originalPrice: 4800,
    description: 'Set of three studs: classic pearls, sparkling CZ, and minimalist gold balls. Hypoallergenic posts.',
    category: 'Earrings',
    images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop'],
    stock: 20,
  },
  {
    name: 'Charm Bracelet with Pendants',
    price: 4599,
    originalPrice: 5900,
    description: 'Star, moon, heart, and butterfly charms. Anti-tarnish finish. Adjustable 6–8 inches.',
    category: 'Bracelets',
    images: ['https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&h=600&fit=crop'],
    stock: 14,
  },
  {
    name: 'Twisted Band Ring Set',
    price: 3199,
    originalPrice: 4200,
    description: 'Set of two twisted band rings, worn together or separately. Anti-tarnish gold plating. Sizes 6–9.',
    category: 'Rings',
    images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop'],
    stock: 16,
  },
];

const seed = async () => {
  await connectDB();

  // Clear everything
  await User.deleteMany();
  await Product.deleteMany();
  await Order.deleteMany();
  console.log('Cleared existing data.');

  // Create admin
  const hashedPassword = await bcrypt.hash('Admin@123', 10);
  await User.create({
    name: 'Zenvy Admin',
    email: 'admin@zenvyshop.pk',
    password: hashedPassword,
    role: 'admin',
  });

  // Create a test customer
  const customerPassword = await bcrypt.hash('Customer@123', 10);
  await User.create({
    name: 'Ayesha Khan',
    email: 'customer@test.com',
    password: customerPassword,
    role: 'customer',
  });

  // Insert products
  await Product.insertMany(sampleProducts);

  console.log('\nDatabase seeded successfully!');
  console.log('Admin     → admin@zenvyshop.pk  / Admin@123');
  console.log('Customer  → customer@test.com    / Customer@123');
  console.log(`Products  → ${sampleProducts.length} inserted`);

  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
