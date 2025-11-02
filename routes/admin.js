// routes/admin.js

const express = require('express');
const router = express.Router();
const { getAdminOrders } = require('../controllers/orderController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Reuse product getAll for admin/products overview
const { getAllProducts } = require('../controllers/productController');
const { getAllCarts } = require('../controllers/adminController'); // New

router.get('/products', auth, admin, getAllProducts);
router.get('/orders', auth, admin, getAdminOrders);
router.get('/carts', auth, admin, getAllCarts); // e.g., /api/admin/carts

module.exports = router;