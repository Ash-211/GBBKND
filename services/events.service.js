const eventDb = require('../db/eventDb');

/**
 * Creates a new event.
 * @param {Object} eventData - Event details such as name, location, date, description.
 * @returns {Object} The newly created event.
 */
exports.createEvent = async (eventData) => {
  // You can add additional validations or business logic here if needed.
  const newEvent = await eventDb.insertEvent(eventData);
  return newEvent;
};

/**
 * Retrieves all events.
 * @returns {Array} List of events.
 */
exports.getEvents = async () => {
  const events = await eventDb.getEvents();
  return events;
};

/**
 * Retrieves an event by its ID.
 * @param {string} eventId - The ID of the event.
 * @returns {Object|null} The event object if found.
 */
exports.getEventById = async (eventId) => {
  const event = await eventDb.findEventById(eventId);
  return event;
};

/**
 * Updates an event by its ID.
 * @param {string} eventId - The ID of the event to update.
 * @param {Object} updateData - Data fields to update.
 * @returns {Object} The updated event object.
 */
exports.updateEvent = async (eventId, updateData) => {
  await eventDb.updateEvent(eventId, updateData);
  // Return the updated event details.
  const updatedEvent = await eventDb.findEventById(eventId);
  return updatedEvent;
};

/**
 * Deletes an event by its ID.
 * @param {string} eventId - The ID of the event to delete.
 */
exports.deleteEvent = async (eventId) => {
  await eventDb.deleteEvent(eventId);
};
