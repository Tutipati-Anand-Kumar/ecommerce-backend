// controllers/authController.js 

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    // 1. Get role and adminCode from the request body
    const { name, email, password, phone, address, role, adminCode } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }
    
    // 2. Securely determine if the user should be an admin
    let isAdmin = false;
    if (role === 'admin') {
      // Check if the provided code matches the one in your .env file
      if (adminCode === process.env.ADMIN_SECRET_CODE) {
        isAdmin = true;
      } else {
        // If the role is admin but the code is wrong, reject the registration
        return res.status(403).json({ success: false, message: 'Invalid Admin Secret Code.' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name, 
      email, 
      password: hashedPassword, 
      phone, 
      address,
      // 3. Use the securely determined isAdmin value
      isAdmin: isAdmin 
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        isAdmin: user.isAdmin
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error during registration', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid password' });

    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        isAdmin: user.isAdmin
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Login failed', error: err.message });
  }
};