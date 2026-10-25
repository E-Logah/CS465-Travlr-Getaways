const express = require('express');
const router = express.Router();

const travelersController = require('../controllers/travellers');

router.get('/travel', travelersController.travel);

module.exports = router;
