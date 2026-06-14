const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Banner = require('./models/Banner');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Banner.deleteMany({});

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@gorerbazar.com',
      password: 'admin123',
      phone: '01700000000',
      role: 'admin'
    });
    console.log('Admin created: admin@gorerbazar.com / admin123');

    // Create categories
    const categories = await Category.insertMany([
      { name: 'Oil & Ghee', slug: 'oil-ghee', description: 'Pure oils and ghee', order: 1 },
      { name: 'Organic', slug: 'organic', description: 'Certified organic products', order: 2 },
      { name: 'Honey', slug: 'honey', description: 'Natural and pure honey', order: 3 },
      { name: 'Dates', slug: 'dates', description: 'Premium quality dates', order: 4 },
      { name: 'Spices', slug: 'spices', description: 'Authentic spices', order: 5 },
      { name: 'Nuts & Seeds', slug: 'nuts-seeds', description: 'Fresh nuts and seeds', order: 6 },
      { name: 'Beverage', slug: 'beverage', description: 'Healthy beverages', order: 7 },
      { name: 'Rice', slug: 'rice', description: 'Premium rice varieties', order: 8 },
      { name: 'Flours & Lentils', slug: 'flours-lentils', description: 'Fresh flours and lentils', order: 9 },
      { name: 'Mango', slug: 'mango', description: 'Seasonal mangoes', order: 10 }
    ]);
    console.log('Categories created');

    // Create products
    const products = await Product.insertMany([
      {
        name: 'Gawa Ghee 1kg',
        slug: 'gawa-ghee-1kg',
        description: 'Pure cow ghee made from fresh milk. Rich in aroma and taste. Perfect for cooking and traditional recipes.',
        shortDescription: 'Pure cow ghee 1kg pack',
        price: 1800, originalPrice: 1800,
        category: categories[0]._id, brand: 'Gorerbazar',
        stock: 100, unit: 'jar', weight: '1kg',
        tags: ['ghee', 'dairy', 'cooking'],
        isFeatured: true, isBestSelling: true,
        rating: 4.8, reviewCount: 45
      },
      {
        name: 'Deshi Mustard Oil 5 Liter',
        slug: 'deshi-mustard-oil-5l',
        description: 'Cold-pressed mustard oil from finest mustard seeds. Strong aroma and authentic taste.',
        shortDescription: 'Cold-pressed mustard oil 5L',
        price: 1550, originalPrice: 1550,
        category: categories[0]._id, brand: 'Gorerbazar',
        stock: 80, unit: 'bottle', weight: '5L',
        tags: ['mustard oil', 'cooking oil'],
        isFeatured: true, isBestSelling: true,
        rating: 4.7, reviewCount: 38
      },
      {
        name: 'Sundarban Honey 1kg',
        slug: 'sundarban-honey-1kg',
        description: 'Authentic Sundarban forest honey collected from the mangrove forests of Bangladesh. 100% natural and unprocessed.',
        shortDescription: 'Pure Sundarban forest honey',
        price: 2300, originalPrice: 2500,
        category: categories[2]._id, brand: 'Gorerbazar',
        stock: 50, unit: 'jar', weight: '1kg',
        tags: ['honey', 'sundarban', 'natural'],
        isFeatured: true, isBestSelling: true, isNewArrival: false,
        discount: 8, rating: 4.9, reviewCount: 62
      },
      {
        name: 'Black Seed Honey 1kg',
        slug: 'black-seed-honey-1kg',
        description: 'Premium honey infused with black seed (kalizira). Boosts immunity and health.',
        shortDescription: 'Honey with black seed',
        price: 1500, originalPrice: 1600,
        category: categories[2]._id, brand: 'Gorerbazar',
        stock: 60, unit: 'jar', weight: '1kg',
        tags: ['honey', 'black seed', 'health'],
        isFeatured: true, isBestSelling: true,
        discount: 6, rating: 4.6, reviewCount: 28
      },
      {
        name: 'Lychee Flower Honey 1kg',
        slug: 'lychee-flower-honey-1kg',
        description: 'Delicate honey from lychee flower nectar. Light color with floral aroma.',
        shortDescription: 'Pure lychee flower honey',
        price: 1100, originalPrice: 1100,
        category: categories[2]._id, brand: 'Gorerbazar',
        stock: 40, unit: 'jar', weight: '1kg',
        tags: ['honey', 'lychee', 'floral'],
        isFeatured: true, rating: 4.5, reviewCount: 20
      },
      {
        name: 'Egyptian Medjool Dates Large 1kg',
        slug: 'egyptian-medjool-dates-1kg',
        description: 'Premium Egyptian Medjool dates. Large size, soft and caramel-like taste.',
        shortDescription: 'Premium Medjool dates from Egypt',
        price: 1984, originalPrice: 2200,
        category: categories[3]._id, brand: 'Gorerbazar',
        stock: 70, unit: 'box', weight: '1kg',
        tags: ['dates', 'medjool', 'egyptian'],
        isFeatured: true, isBestSelling: true,
        discount: 10, rating: 4.8, reviewCount: 35
      },
      {
        name: 'Ajwa Premium Dates 500g',
        slug: 'ajwa-premium-dates-500g',
        description: 'Premium Ajwa dates from Madina. Known for their health benefits and unique taste.',
        shortDescription: 'Ajwa dates from Madina',
        price: 1100, originalPrice: 1200,
        category: categories[3]._id, brand: 'Gorerbazar',
        stock: 90, unit: 'box', weight: '500g',
        tags: ['dates', 'ajwa', 'madina'],
        isFeatured: true,
        discount: 8, rating: 4.9, reviewCount: 55
      },
      {
        name: 'Kashmiri Sidr Honey 800g',
        slug: 'kashmiri-sidr-honey-800g',
        description: 'Rare Sidr honey from Kashmir. Known for its medicinal properties and rich taste.',
        shortDescription: 'Premium Sidr honey from Kashmir',
        price: 1800, originalPrice: 2000,
        category: categories[2]._id, brand: 'Gorerbazar',
        stock: 30, unit: 'jar', weight: '800g',
        tags: ['honey', 'sidr', 'kashmir'],
        isNewArrival: true,
        discount: 10, rating: 4.7, reviewCount: 12
      },
      {
        name: 'African Organic Wild Honey 500g',
        slug: 'african-organic-wild-honey-500g',
        description: 'Certified organic wild honey from African forests. Raw and unprocessed.',
        shortDescription: 'Organic wild honey from Africa',
        price: 1100, originalPrice: 1250,
        category: categories[1]._id, brand: 'Gorerbazar',
        stock: 45, unit: 'jar', weight: '500g',
        tags: ['honey', 'organic', 'african'],
        isOrganic: true, isFeatured: true,
        discount: 12, rating: 4.6, reviewCount: 18
      },
      {
        name: 'Chili Powder 500g',
        slug: 'chili-powder-500g',
        description: 'Ground dried red chili. Hot and aromatic. Essential for Bangladeshi cooking.',
        shortDescription: 'Pure ground chili powder',
        price: 400, originalPrice: 400,
        category: categories[4]._id, brand: 'Gorerbazar',
        stock: 200, unit: 'pack', weight: '500g',
        tags: ['spice', 'chili', 'masala'],
        isBestSelling: true, rating: 4.5, reviewCount: 40
      },
      {
        name: 'Turmeric Powder 500g',
        slug: 'turmeric-powder-500g',
        description: 'Pure turmeric powder. Bright yellow color with earthy aroma.',
        shortDescription: 'Pure turmeric powder',
        price: 295, originalPrice: 295,
        category: categories[4]._id, brand: 'Gorerbazar',
        stock: 150, unit: 'pack', weight: '500g',
        tags: ['spice', 'turmeric', 'haldi'],
        isBestSelling: true, rating: 4.4, reviewCount: 30
      },
      {
        name: 'Cumin Powder 500g',
        slug: 'cumin-powder-500g',
        description: 'Ground cumin seeds. Warm, earthy flavor essential for curries.',
        shortDescription: 'Pure cumin powder',
        price: 880, originalPrice: 880,
        category: categories[4]._id, brand: 'Gorerbazar',
        stock: 100, unit: 'pack', weight: '500g',
        tags: ['spice', 'cumin', 'jeera'],
        rating: 4.6, reviewCount: 22
      },
      {
        name: 'Kala Bhuna Masala 500g',
        slug: 'kala-bhuna-masala-500g',
        description: 'Special spice blend for Kala Bhuna. Authentic Chittagong style.',
        shortDescription: 'Special Kala Bhuna spice mix',
        price: 1350, originalPrice: 1500,
        category: categories[4]._id, brand: 'Gorerbazar',
        stock: 60, unit: 'pack', weight: '500g',
        tags: ['spice', 'kala bhuna', 'chittagong'],
        discount: 10, rating: 4.7, reviewCount: 15
      },
      {
        name: 'Organic Extra Virgin Coconut Oil 500ml',
        slug: 'organic-coconut-oil-500ml',
        description: 'Cold-pressed organic extra virgin coconut oil. Perfect for cooking and hair care.',
        shortDescription: 'Organic cold-pressed coconut oil',
        price: 1230, originalPrice: 1230,
        category: categories[1]._id, brand: 'Gorerbazar',
        stock: 55, unit: 'bottle', weight: '500ml',
        tags: ['organic', 'coconut oil', 'cooking'],
        isOrganic: true, isFeatured: true, rating: 4.5, reviewCount: 25
      },
      {
        name: 'Amrapali Mango 10kg Box',
        slug: 'amrapali-mango-10kg',
        description: 'Sweet and fiberless Amrapali mangoes. Pre-order for the season.',
        shortDescription: 'Premium Amrapali mangoes',
        price: 1500, originalPrice: 1600,
        category: categories[9]._id, brand: 'Gorerbazar',
        stock: 200, unit: 'box', weight: '10kg',
        tags: ['mango', 'amrapali', 'seasonal'],
        isPreOrder: true, isFeatured: true,
        discount: 6, rating: 4.8, reviewCount: 8
      },
      {
        name: 'Natural Honeycomb 1kg',
        slug: 'natural-honeycomb-1kg',
        description: 'Pure natural honeycomb straight from the hive. Contains raw honey, beeswax, and propolis.',
        shortDescription: 'Pure natural honeycomb',
        price: 2250, originalPrice: 2500,
        category: categories[2]._id, brand: 'Gorerbazar',
        stock: 25, unit: 'box', weight: '1kg',
        tags: ['honey', 'honeycomb', 'natural'],
        discount: 10, rating: 4.9, reviewCount: 10
      },
      {
        name: 'Safawi Dates 1kg',
        slug: 'safawi-dates-1kg',
        description: 'Premium Safawi dates from Saudi Arabia. Soft, dark, and sweet.',
        shortDescription: 'Safawi dates A grade',
        price: 1170, originalPrice: 1300,
        category: categories[3]._id, brand: 'Gorerbazar',
        stock: 80, unit: 'box', weight: '1kg',
        tags: ['dates', 'safawi', 'saudi'],
        discount: 10, rating: 4.7, reviewCount: 20
      },
      {
        name: 'Ceylon Organic Coconut Milk 400ml',
        slug: 'ceylon-coconut-milk-400ml',
        description: 'Organic coconut milk from Ceylon. Creamy and rich.',
        shortDescription: 'Organic Ceylon coconut milk',
        price: 350, originalPrice: 350,
        category: categories[1]._id, brand: 'Gorerbazar',
        stock: 100, unit: 'can', weight: '400ml',
        tags: ['organic', 'coconut milk', 'ceylon'],
        isOrganic: true, isNewArrival: true, rating: 4.4, reviewCount: 8
      },
      {
        name: 'Palermo Extra Virgin Olive Oil 1L',
        slug: 'palermo-olive-oil-1l',
        description: 'Premium extra virgin olive oil from Italy. Cold-pressed and unfiltered.',
        shortDescription: 'Italian extra virgin olive oil',
        price: 2499, originalPrice: 2499,
        category: categories[0]._id, brand: 'Palermo',
        stock: 40, unit: 'bottle', weight: '1L',
        tags: ['olive oil', 'italian', 'extra virgin'],
        isFeatured: true, rating: 4.8, reviewCount: 15
      },
      {
        name: 'Ashwagandha Powder 100g (USDA Certified)',
        slug: 'ashwagandha-powder-100g',
        description: 'USDA certified organic Ashwagandha powder. Boosts energy and reduces stress.',
        shortDescription: 'USDA certified Ashwagandha',
        price: 600, originalPrice: 600,
        category: categories[1]._id, brand: 'Gorerbazar',
        stock: 120, unit: 'jar', weight: '100g',
        tags: ['organic', 'ashwagandha', 'health'],
        isOrganic: true, isNewArrival: true, rating: 4.5, reviewCount: 12
      }
    ]);
    console.log(`${products.length} products created`);

    // Create banners
    await Banner.insertMany([
      {
        title: '100% Natural & Organic Products',
        subtitle: 'Fresh from nature to your doorstep',
        image: '/uploads/banner1.jpg',
        buttonText: 'Shop Now',
        position: 'hero',
        order: 1,
        isActive: true
      },
      {
        title: 'Free Delivery on Orders Over ৳2000',
        subtitle: 'Fast delivery across Bangladesh',
        image: '/uploads/banner2.jpg',
        buttonText: 'Order Now',
        position: 'hero',
        order: 2,
        isActive: true
      },
      {
        title: 'Seasonal Mango Collection',
        subtitle: 'Pre-order your favorite mangoes',
        image: '/uploads/banner3.jpg',
        link: '/category/mango',
        buttonText: 'Pre-Order',
        position: 'middle',
        order: 1,
        isActive: true
      }
    ]);
    console.log('Banners created');

    console.log('\n=== SEED COMPLETE ===');
    console.log('Admin: admin@gorerbazar.com / admin123');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
