require('dotenv').config(); // loads JWT_SECRET from .env
const express = require('express');
const passport = require('passport');
const path = require('path');

const indexRouter = require('./app_server/routes/index');
require('./app_api/models/db');
require('./app_api/config/passport');
const apiRouter = require('./app_api/routes/index');

const app = express();

// Configure Handlebars (HBS)
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'hbs');

// Parse JSON request bodies (needed for POST and PUT)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

// Serve the existing Module One static files
app.use(express.static(path.join(__dirname, 'public')));

// Enable CORS so the Angular admin SPA (localhost:4200) can call the API
app.use('/api', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
});

// Register MVC routes
app.use('/', indexRouter);
app.use('/api', apiRouter);

// Keep the original home page working
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;
