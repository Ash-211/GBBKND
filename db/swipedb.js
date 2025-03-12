const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const url = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'concertApp';

let db;

// Connect to MongoDB if not already connected
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    db = client.db(dbName);
    console.log(`Connected to database: ${dbName}`);
  })
  .catch(err => console.error('Failed to connect to MongoDB', err));

/**
 * Inserts a new swipe record.
 * @param {Object} swipeData - Contains userId, targetUserId, action, createdAt.
 */
exports.insertSwipe = async (swipeData) => {
  try {
    await db.collection('swipes').insertOne(swipeData);
  } catch (error) {
    throw new Error('Error inserting swipe: ' + error.message);
  }
};

/**
 * Finds a swipe record for a specific action.
 * @param {string} userId - The user who performed the swipe.
 * @param {string} targetUserId - The target user of the swipe.
 * @param {string} action - The action type ("like" or "dislike").
 * @returns {Object|null} The swipe record if found.
 */
exports.findSwipe = async (userId, targetUserId, action) => {
  try {
    const swipe = await db.collection('swipes').findOne({ userId, targetUserId, action });
    return swipe;
  } catch (error) {
    throw new Error('Error finding swipe: ' + error.message);
  }
};

/**
 * Finds all swipe records for a user with a specific action.
 * @param {string} userId - The user's ID.
 * @param {string} action - The action type ("like" or "dislike").
 * @returns {Array} Array of swipe records.
 */
exports.findSwipesByUser = async (userId, action) => {
  try {
    const swipes = await db.collection('swipes').find({ userId, action }).toArray();
    return swipes;
  } catch (error) {
    throw new Error('Error fetching swipes: ' + error.message);
  }
};
