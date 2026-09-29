const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');

router.get('/', eventsController.getEvents);
router.get('/:id', eventsController.getEventById);
router.post('/:id/register', eventsController.registerForEvent);

module.exports = router;
