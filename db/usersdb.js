const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const url = process.env.MONGO_URL || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'concertApp';

let db;

// Connect to MongoDB and store the connection instance
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    db = client.db(dbName);
    console.log(`Connected to database: ${dbName}`);
  })
  .catch(err => console.error('Failed to connect to MongoDB', err));

/**
 * Inserts a new user into the "users" collection.
 *
 * @param {Object} userData - The user data object.
 * @returns {Object} The inserted user object (with generated _id).
 */
exports.insertUser = async (userData) => {
  try {
    const result = await db.collection('users').insertOne(userData);
    return { _id: result.insertedId, ...userData };
  } catch (error) {
    throw new Error('Error inserting user: ' + error.message);
  }
};

/**
 * Finds a user by email.
 *
 * @param {string} email - The email to search for.
 * @returns {Object|null} The user object if found, or null.
 */
exports.findUserByEmail = async (email) => {
  try {
    const user = await db.collection('users').findOne({ email });
    return user;
  } catch (error) {
    throw new Error('Error finding user: ' + error.message);
  }
};

/**
 * Finds a user by verification token.
 *
 * @param {string} token - The verification token.
 * @returns {Object|null} The user object if found, or null.
 */
exports.findUserByVerificationToken = async (token) => {
  try {
    const user = await db.collection('users').findOne({ verificationToken: token });
    return user;
  } catch (error) {
    throw new Error('Error finding user by token: ' + error.message);
  }
};

/**
 * Updates a user document.
 *
 * @param {string|ObjectId} id - The user's ID.
 * @param {Object} updateData - The fields to update.
 */
exports.updateUser = async (id, updateData) => {
  try {
    await db.collection('users').updateOne({ _id: ObjectId(id) }, { $set: updateData });
  } catch (error) {
    throw new Error('Error updating user: ' + error.message);
  }
};
