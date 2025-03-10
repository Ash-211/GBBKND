const express = require('express');
const router = express.Router();

// Import individual module routes
const userRoutes = require('./users');

// Mount module routes
router.use('/users', userRoutes);

// Future modules (e.g., events) can be added here
// router.use('/events', require('./events'));

module.exports = router;
