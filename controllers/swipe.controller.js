const swipeService = require('../services/swipeService');

/**
 * Records a "like" swipe action.
 * Expects request body: { userId: String, targetUserId: String }
 * If a reciprocal "like" is found, a match is created.
 */
exports.likeUser = async (req, res) => {
  try {
    const { userId, targetUserId } = req.body;
    const result = await swipeService.recordSwipe(userId, targetUserId, 'like');
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Records a "dislike" swipe action.
 * Expects request body: { userId: String, targetUserId: String }
 */
exports.dislikeUser = async (req, res) => {
  try {
    const { userId, targetUserId } = req.body;
    const result = await swipeService.recordSwipe(userId, targetUserId, 'dislike');
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Retrieves all matches for a given user.
 * Expects query parameter: userId
 */
exports.getMatches = async (req, res) => {
  try {
    const { userId } = req.query;
    const matches = await swipeService.getMatches(userId);
    res.status(200).json({ matches });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
