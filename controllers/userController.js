// controllers/userController.js

const User = require('../models/User');
const Product = require('../models/Product');
const mongoose = require('mongoose'); // Import Mongoose

exports.updateProfile = async (req, res) => {
  try {
    const { userId } = req; // From auth middleware
    const { name, phone, address } = req.body;

    const user = await User.findByIdAndUpdate(userId, { name, phone, address }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.status(200).json({ success: true, message: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId).populate('cart.productId', 'name price image discountPercentage'); // Populate all needed fields
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, cart: user.cart });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { userId } = req;
    const { productId, quantity } = req.body; // productId is now the actual _id   
    // console.log(productId);

    const product = await Product.findById(productId);
    // console.log("hi"+ product);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const user = await User.findById(userId);
    const existingItemIndex = user.cart.findIndex(item => item.productId.toString() === product._id.toString());
    
    if (existingItemIndex > -1) {
      user.cart[existingItemIndex].quantity += parseInt(quantity) || 1;
    } else {
      user.cart.push({ 
        productId: product._id,
        quantity: parseInt(quantity) || 1 
      });
    }
    await user.save();
    await user.populate('cart.productId', 'name price image discountPercentage');
    res.status(200).json({ success: true, message: 'Added to cart', cart: user.cart });
  } catch (err) {
  console.log(err);
  
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ** NEW FUNCTION TO UPDATE QUANTITY **
exports.updateCartItem = async (req, res) => {
  try {
    const { userId } = req;
    const { productId, quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId) || !quantity || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Invalid data provided.' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const itemIndex = user.cart.findIndex(item => item.productId.toString() === productId);

    if (itemIndex > -1) {
      user.cart[itemIndex].quantity = parseInt(quantity);
      await user.save();
      await user.populate('cart.productId', 'name price image discountPercentage');
      res.status(200).json({ success: true, message: 'Cart updated', cart: user.cart });
    } else {
      res.status(404).json({ success: false, message: 'Item not found in cart' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ** NEW FUNCTION TO REMOVE ITEM **
exports.removeFromCart = async (req, res) => {
  try {
    const { userId } = req;
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ success: false, message: 'Invalid Product ID.' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { cart: { productId: productId } } }, // Use $pull to remove item from array
      { new: true }
    ).populate('cart.productId', 'name price image discountPercentage');

    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    res.status(200).json({ success: true, message: 'Item removed from cart', cart: user.cart });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};