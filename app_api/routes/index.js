const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');

// Middleware that protects admin endpoints: the request must carry
// "Authorization: Bearer <token>" with a valid, unexpired JWT
function authenticateJWT(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Auth header required but not present' });
    }
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Auth header must be: Bearer <token>' });
    }
    jwt.verify(parts[1], process.env.JWT_SECRET, (err, verified) => {
        if (err) {
            return res.status(401).json({ message: 'Token validation error' });
        }
        req.auth = verified; // decoded user info
        next();
    });
}

// User endpoints
router.route('/register').post(authController.register);
router.route('/login').post(authController.login);

// Trips: GET is public, POST requires a token
router
    .route('/trips')
    .get(tripsController.tripsList)
    .post(authenticateJWT, tripsController.tripsAddTrip);

// Single trip: GET is public, PUT and DELETE require a token
router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode)
    .put(authenticateJWT, tripsController.tripsUpdateTrip)
    .delete(authenticateJWT, tripsController.tripsDeleteTrip);

module.exports = router;
