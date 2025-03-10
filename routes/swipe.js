const express = require('express');
const router = express.Router();
const swipeController = require('../controllers/swipeController');

// Record a like action
// POST /api/swipe/like
router.post('/like', swipeController.likeUser);

// Record a dislike action
// POST /api/swipe/dislike
router.post('/dislike', swipeController.dislikeUser);

// Retrieve matches for a given user
// GET /api/swipe/matches?userId=...
router.get('/matches', swipeController.getMatches);

module.exports = router;
