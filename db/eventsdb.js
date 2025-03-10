const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const url = process.env.MONGO_URL || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'concertApp';

let db;

// Connect to MongoDB (if not already connected)
// This connection code can be shared or refactored into a separate module if desired.
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    db = client.db(dbName);
    console.log(`Connected to database: ${dbName}`);
  })
  .catch(err => console.error('Failed to connect to MongoDB', err));

/**
 * Inserts a new event into the "events" collection.
 * @param {Object} eventData - The event details.
 * @returns {Object} The inserted event object (with generated _id).
 */
exports.insertEvent = async (eventData) => {
  try {
    const result = await db.collection('events').insertOne(eventData);
    return { _id: result.insertedId, ...eventData };
  } catch (error) {
    throw new Error('Error inserting event: ' + error.message);
  }
};

/**
 * Retrieves all events from the "events" collection.
 * @returns {Array} List of event objects.
 */
exports.getEvents = async () => {
  try {
    const events = await db.collection('events').find({}).toArray();
    return events;
  } catch (error) {
    throw new Error('Error fetching events: ' + error.message);
  }
};

/**
 * Finds an event by its ID.
 * @param {string} eventId - The event's ID.
 * @returns {Object|null} The event object if found, or null.
 */
exports.findEventById = async (eventId) => {
  try {
    const event = await db.collection('events').findOne({ _id: ObjectId(eventId) });
    return event;
  } catch (error) {
    throw new Error('Error finding event: ' + error.message);
  }
};

/**
 * Updates an event document in the "events" collection.
 * @param {string} eventId - The event's ID.
 * @param {Object} updateData - Fields to update.
 */
exports.updateEvent = async (eventId, updateData) => {
  try {
    await db.collection('events').updateOne({ _id: ObjectId(eventId) }, { $set: updateData });
  } catch (error) {
    throw new Error('Error updating event: ' + error.message);
  }
};

/**
 * Deletes an event document from the "events" collection.
 * @param {string} eventId - The event's ID.
 */
exports.deleteEvent = async (eventId) => {
  try {
    await db.collection('events').deleteOne({ _id: ObjectId(eventId) });
  } catch (error) {
    throw new Error('Error deleting event: ' + error.message);
  }
};
