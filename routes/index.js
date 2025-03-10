const express = require('express');
const router = express.Router();

// Import module-specific routes
const userRoutes = require('./users');
const eventRoutes = require('./events');
const swipeRoutes = require('./swipe');
const chatRoutes = require('./chats');

// Mount the user routes at /api/users
router.use('/users', userRoutes);

// Mount the event routes at /api/events
router.use('/events', eventRoutes);

// Mount the swiping routes at /api/swipe
router.use('/swipe', swipeRoutes);

// Mount the chat routes at /api/chats
router.use('/chats', chatRoutes);

module.exports = router;
