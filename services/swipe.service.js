const swipeDb = require('../db/swipeDb');

/**
 * Records a swipe action (like or dislike) between a user and a target user.
 * If the action is "like", it checks for a reciprocal like.
 * @param {string} userId - The ID of the user performing the swipe.
 * @param {string} targetUserId - The ID of the target user.
 * @param {string} action - Either "like" or "dislike".
 * @returns {Object} Result message and match status if applicable.
 */
exports.recordSwipe = async (userId, targetUserId, action) => {
  // Save the swipe action in the database
  await swipeDb.insertSwipe({ userId, targetUserId, action, createdAt: new Date() });

  // If action is "like", check for a reciprocal like
  if (action === 'like') {
    const reciprocal = await swipeDb.findSwipe(targetUserId, userId, 'like');
    if (reciprocal) {
      // A match is found since both users liked each other.
      // Here, you might store a match record or notify the users.
      return { message: 'It\'s a match!', match: true };
    }
  }
  return { message: 'Swipe recorded', match: false };
};

/**
 * Retrieves all matched user IDs for a given user.
 * A match is determined when both users have recorded a "like" for each other.
 * @param {string} userId - The user's ID.
 * @returns {Array} List of user IDs that are matched.
 */
exports.getMatches = async (userId) => {
  // Find all swipe records where this user liked someone
  const userLikes = await swipeDb.findSwipesByUser(userId, 'like');

  // For each liked user, check if they have liked this user back
  const matches = [];
  for (let swipe of userLikes) {
    const reciprocal = await swipeDb.findSwipe(swipe.targetUserId, userId, 'like');
    if (reciprocal) {
      matches.push(swipe.targetUserId);
    }
  }
  return matches;
};
