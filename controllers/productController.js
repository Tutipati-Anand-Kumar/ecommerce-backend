// controllers/productController.js 

const Product = require('../models/Product');

// Helper for auto-increment externalId
async function getNextExternalId() {
  const last = await Product.findOne().sort({ externalId: -1 });
  return (last ? last.externalId + 1 : 1);
}

exports.addProduct = async (req, res) => { // Admin-only
  try {
    const { name, description, price, category, stock, brand, rating, discountPercentage, image, images } = req.body;
    const extId = await getNextExternalId();

    const product = new Product({ 
      externalId: extId,
      name, 
      description, 
      price: parseFloat(price), 
      discountPercentage: parseFloat(discountPercentage) || 0,
      rating: parseFloat(rating) || 0,
      image: image || 'https://dummyimage.com/300x200/CCCCCC/000000&text=New+Product',
      images: images || [], // Array of URLs
      category, 
      brand, 
      stock: parseInt(stock) || 1
    });
    await product.save();
    res.status(201).json({ success: true, message: 'Product added successfully', product });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.updateProduct = async (req, res) => { // Admin-only
  try {
    const { id } = req.params;
    const updates = req.body; // e.g., { price: 599, discountPercentage: 15, stock: 50, images: [...] }

    const product = await Product.findOneAndUpdate(
      { externalId: parseInt(id) }, 
      { 
        ...updates, 
        updatedAt: new Date(),
        price: parseFloat(updates.price),
        discountPercentage: parseFloat(updates.discountPercentage) || 0,
        rating: parseFloat(updates.rating) || 0,
        stock: parseInt(updates.stock) || 1
      }, 
      { new: true, runValidators: true }
    ).lean();

    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    res.status(200).json({ success: true, message: 'Product updated', product });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.deleteProduct = async (req, res) => { // Admin-only
  try {
    const { id } = req.params;
    const product = await Product.findOneAndDelete({ externalId: parseInt(id) });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, message: 'Product deleted', deletedId: id });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const { search, category, price_lt } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (price_lt) {
      query.price = { $lt: parseFloat(price_lt) };
    }

    const products = await Product.find(query).sort({ createdAt: -1 }).lean();

    // The rest of your function remains the same...
    const host = req.headers.host;
    const protocol = req.get('X-Forwarded-Proto') || 'http';
    const baseUrl = `${protocol}://${host}`;
    const modifiedProducts = products.map(p => ({
      ...p,
      image: p.image.startsWith('http') ? p.image : `${baseUrl}/uploads/${p.image}`
    }));

    res.status(200).json({ success: true, products: modifiedProducts });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ externalId: parseInt(id) }).lean();
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    res.status(200).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};