// controllers/adminController.js 

const User = require('../models/User');

exports.getAllCarts = async (req, res) => { // Admin views all users' carts
  try {
    const users = await User.find({ isAdmin: false }) // Exclude admins
      .select('name email cart')
      .populate('cart.productId', 'name price image externalId')
      .lean();

    const carts = users.map(user => ({
      user: { name: user.name, email: user.email },
      cart: user.cart,
      totalItems: user.cart.reduce((sum, item) => sum + item.quantity, 0)
    }));

    res.status(200).json({ success: true, carts });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};