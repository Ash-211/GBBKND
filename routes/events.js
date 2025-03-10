const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Create a new event
// POST /api/events
router.post('/', eventController.createEvent);

// Get a list of all events
// GET /api/events
router.get('/', eventController.getEvents);

// Get details of a single event by its ID
// GET /api/events/:id
router.get('/:id', eventController.getEvent);

// Update an event by its ID
// PUT /api/events/:id
router.put('/:id', eventController.updateEvent);

// Delete an event by its ID
// DELETE /api/events/:id
router.delete('/:id', eventController.deleteEvent);

module.exports = router;
