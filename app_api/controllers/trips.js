const Trip = require('../models/travlr'); // Mongoose model

// GET /api/trips - return all trips
const tripsList = async (req, res) => {
    try {
        const q = await Trip.find({}).exec();
        if (!q || q.length === 0) {
            return res.status(404).json({ message: 'No trips found' });
        }
        return res.status(200).json(q);
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// GET /api/trips/:tripCode - return one trip
const tripsFindByCode = async (req, res) => {
    try {
        const q = await Trip.find({ code: req.params.tripCode }).exec();
        if (!q || q.length === 0) {
            return res.status(404).json({ message: `Trip ${req.params.tripCode} not found` });
        }
        return res.status(200).json(q);
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Pull the trip fields from the request body
const tripFromBody = (body) => ({
    code: body.code,
    name: body.name,
    length: body.length,
    start: body.start,
    resort: body.resort,
    perPerson: body.perPerson,
    image: body.image,
    description: body.description
});

// POST /api/trips - add a new trip
const tripsAddTrip = async (req, res) => {
    try {
        const newTrip = new Trip(tripFromBody(req.body));
        const q = await newTrip.save();
        return res.status(201).json(q);
    } catch (err) {
        // Missing required fields or a bad date are client errors
        return res.status(400).json({ message: 'Unable to add trip', error: err.message });
    }
};

// PUT /api/trips/:tripCode - update an existing trip
const tripsUpdateTrip = async (req, res) => {
    try {
        const q = await Trip.findOneAndUpdate(
            { code: req.params.tripCode },
            tripFromBody(req.body),
            { new: true, runValidators: true }
        ).exec();
        if (!q) {
            return res.status(404).json({ message: `Trip ${req.params.tripCode} not found` });
        }
        return res.status(200).json(q);
    } catch (err) {
        return res.status(400).json({ message: 'Unable to update trip', error: err.message });
    }
};

// DELETE /api/trips/:tripCode - remove a trip
const tripsDeleteTrip = async (req, res) => {
    try {
        const q = await Trip.findOneAndDelete({ code: req.params.tripCode }).exec();
        if (!q) {
            return res.status(404).json({ message: `Trip ${req.params.tripCode} not found` });
        }
        return res.status(204).end();
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip,
    tripsDeleteTrip
};
