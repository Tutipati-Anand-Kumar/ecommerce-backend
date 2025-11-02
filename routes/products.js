// routes/products.js

const express = require('express');
const router = express.Router();
const { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', getAllProducts); // Public
router.get('/:id', getProductById); // Public
router.post('/', auth, admin, addProduct); // Admin add
router.put('/:id', auth, admin, updateProduct); // Admin update
router.delete('/:id', auth, admin, deleteProduct); // Admin delete

module.exports = router;