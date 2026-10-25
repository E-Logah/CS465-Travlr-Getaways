const mongoose = require('mongoose');
require('./db');
require('./travlr');

const Trip = mongoose.model('trips');
const trips = require('../../app_server/data/trips.json');

const seedDB = async () => {
  try {
    await Trip.deleteMany({});
    console.log('Existing trips removed.');

    await Trip.insertMany(trips);
    console.log(`Successfully loaded ${trips.length} trips into MongoDB.`);
  } catch (err) {
    console.error('Error loading trip data:', err);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

mongoose.connection.once('open', () => {
  seedDB();
});
