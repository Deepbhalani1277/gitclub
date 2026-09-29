const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');
const verifyToken = require('../middleware/auth');

router.get('/', eventsController.getEvents);
router.post('/', verifyToken, eventsController.createEvent);
router.get('/:id', eventsController.getEventById);
router.post('/:id/register', eventsController.registerForEvent);

module.exports = router;
