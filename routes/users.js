// routes/users.js

const express = require('express');
const router = express.Router();
// ** IMPORT THE NEW FUNCTIONS **
const { 
  updateProfile, 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart 
} = require('../controllers/userController');
const auth = require('../middleware/auth');

router.put('/profile', auth, updateProfile);

// Cart Routes
router.get('/cart', auth, getCart);
router.post('/cart', auth, addToCart);

// ** ADD THESE NEW ROUTES **
router.put('/cart', auth, updateCartItem); // To update quantity
router.delete('/cart/:productId', auth, removeFromCart); // To remove an item

module.exports = router;