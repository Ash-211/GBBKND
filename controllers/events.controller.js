const eventService = require('../services/eventService');

/**
 * Creates a new event.
 * Expects request body with event details (name, location, date, description, etc.).
 */
exports.createEvent = async (req, res) => {
  try {
    const newEvent = await eventService.createEvent(req.body);
    res.status(201).json({
      message: 'Event created successfully',
      event: newEvent
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Retrieves a list of all events.
 */
exports.getEvents = async (req, res) => {
  try {
    const events = await eventService.getEvents();
    res.status(200).json({ events });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Retrieves details of a single event by its ID.
 */
exports.getEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await eventService.getEventById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json({ event });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Updates an event by its ID.
 * Expects request body with fields to update.
 */
exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const updatedEvent = await eventService.updateEvent(eventId, req.body);
    res.status(200).json({
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Deletes an event by its ID.
 */
exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    await eventService.deleteEvent(eventId);
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
