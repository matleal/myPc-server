const express = require('express');
const cors = require('cors');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const productRoutes = require('./product.route');

const router = express.Router();
router.use(cors());

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET v1/docs
 */
router.use('/docs', express.static('docs'));

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/products', productRoutes);

module.exports = router;
