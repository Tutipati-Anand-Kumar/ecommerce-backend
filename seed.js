// seed.js 

const mongoose = require('mongoose');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB for seeding...');
    await Product.deleteMany({}); // Fresh start

    try {
      const response = await fetch('https://dummyjson.com/products?limit=200');
      if (!response.ok) throw new Error(`API fetch failed: ${response.status}`);
      
      const data = await response.json();
      const apiProducts = data.products;

      if (apiProducts.length === 0) throw new Error('No products fetched from API');

      // Map API data to your Product schema (full fields)
      const productsToSeed = apiProducts.map(apiProd => ({
        externalId: apiProd.id,
        name: apiProd.title,
        description: apiProd.description,
        price: apiProd.price,
        discountPercentage: apiProd.discountPercentage || 0, // New
        rating: apiProd.rating || 0, // New
        image: apiProd.thumbnail || (apiProd.images && apiProd.images.length > 0 ? apiProd.images[0] : 'https://dummyimage.com/300x200/CCCCCC/000000&text=No+Image'),
        images: apiProd.images || [], // New: Full array
        category: apiProd.category,
        brand: apiProd.brand || '', // New
        stock: apiProd.stock || 10
      }));

      await Product.insertMany(productsToSeed);
      console.log(`Seeded ${productsToSeed.length} products from DummyJSON with full fields!`);
      console.log('Sample:', productsToSeed.slice(0, 3).map(p => `${p.name} (${p.category}, $${p.price}, Discount: ${p.discountPercentage}%, Brand: ${p.brand})`));
      
      process.exit(0);
    } catch (err) {
      console.error('Seeding failed:', err.message);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  });