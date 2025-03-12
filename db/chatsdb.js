const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const url = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'concertApp';

let db;
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    db = client.db(dbName);
    console.log(`Connected to database: ${dbName}`);
  })
  .catch(err => console.error('Failed to connect to MongoDB', err));

/**
 * Creates a new chat group.
 * @param {Object} groupData - Contains groupName, members, createdAt.
 * @returns {Object} The newly created chat group document.
 */
exports.createChatGroup = async (groupData) => {
  try {
    const result = await db.collection('chat_groups').insertOne(groupData);
    return { _id: result.insertedId, ...groupData };
  } catch (error) {
    throw new Error('Error creating chat group: ' + error.message);
  }
};

/**
 * Adds a new member to an existing chat group.
 * @param {string} groupId - The chat group ID.
 * @param {string} newMemberId - The new member's user ID.
 */
exports.addMemberToGroup = async (groupId, newMemberId) => {
  try {
    await db.collection('chat_groups').updateOne(
      { _id: ObjectId(groupId) },
      { $addToSet: { members: newMemberId } }
    );
  } catch (error) {
    throw new Error('Error adding member to chat group: ' + error.message);
  }
};

/**
 * Retrieves a chat group by its ID.
 * @param {string} groupId - The chat group ID.
 * @returns {Object|null} The chat group document if found.
 */
exports.getChatGroupById = async (groupId) => {
  try {
    const group = await db.collection('chat_groups').findOne({ _id: ObjectId(groupId) });
    return group;
  } catch (error) {
    throw new Error('Error retrieving chat group: ' + error.message);
  }
};

/**
 * Inserts a new message into a chat group.
 * @param {string} groupId - The chat group ID.
 * @param {Object} messageData - Contains senderId, message, sentAt.
 */
exports.insertMessage = async (groupId, messageData) => {
  try {
    await db.collection('chat_messages').insertOne({ groupId, ...messageData });
  } catch (error) {
    throw new Error('Error inserting chat message: ' + error.message);
  }
};

/**
 * Retrieves messages for a specific chat group.
 * @param {string} groupId - The chat group ID.
 * @returns {Array} An array of message documents.
 */
exports.getMessagesForGroup = async (groupId) => {
  try {
    const messages = await db.collection('chat_messages').find({ groupId }).toArray();
    return messages;
  } catch (error) {
    throw new Error('Error retrieving messages: ' + error.message);
  }
};
