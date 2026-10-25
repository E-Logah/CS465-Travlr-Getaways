const mongoose = require('mongoose');

const dbURI = 'mongodb://127.0.0.1:27017/travlr';

const connect = async () => {
    try {
        await mongoose.connect(dbURI);
        console.log(`Mongoose connected to ${dbURI}`);
    } catch (err) {
        console.error('Mongoose connection error:', err);
    }
};

mongoose.connection.on('connected', () => {
    console.log('Mongoose connection established.');
});

mongoose.connection.on('error', (err) => {
    console.error(`Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected.');
});

const gracefulShutdown = async (msg) => {
    try {
        await mongoose.connection.close();
        console.log(`Mongoose disconnected through ${msg}`);
    } finally {
        process.exit(0);
    }
};

process.once('SIGINT', () => {
    gracefulShutdown('app termination');
});

connect();

module.exports = mongoose.connection;
