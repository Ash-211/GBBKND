const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Create a new chat group (only among matched users)
// POST /api/chats/create-group
router.post('/create-group', chatController.createGroup);

// Add a member to an existing chat group (only if the new member is matched with the group creator)
// POST /api/chats/add-member
router.post('/add-member', chatController.addMember);

// Retrieve details of a chat group
// GET /api/chats/group/:groupId
router.get('/group/:groupId', chatController.getGroupDetails);

// Send a message in a chat group (only by group members)
// POST /api/chats/send-message
router.post('/send-message', chatController.sendMessage);

module.exports = router;
