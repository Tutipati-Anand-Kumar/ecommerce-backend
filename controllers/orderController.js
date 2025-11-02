// controllers/orderController.js 

const Order = require('../models/Order');
const User = require('../models/User');

exports.createOrder = async (req, res) => {
  try {
    const { userId } = req;
    const { cartItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }
    const orderProducts = cartItems.map(item => ({
        productId: item.product,
        quantity: item.quantity,
        price: item.price
    }));

    const order = new Order({ 
        userId, 
        products: orderProducts, 
        totalPrice,
        address: shippingAddress, 
        paymentMethod
    });
    await order.save();
    await User.findByIdAndUpdate(userId, { $set: { cart: [] } });

    res.status(201).json({ success: true, message: 'Order placed successfully', order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req; 

    const orders = await Order.find({ userId: userId })
      .sort({ createdAt: -1 }) 
      .populate('products.productId', 'name image'); 

    res.status(200).json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('products.productId', 'name price')
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};