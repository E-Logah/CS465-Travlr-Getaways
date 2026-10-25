const passport = require('passport');
const User = require('../models/user');

// POST /api/register - create an administrator and return a JWT
const register = async (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'All fields required' });
    }
    try {
        const user = new User({ name: req.body.name, email: req.body.email });
        user.setPassword(req.body.password);
        await user.save();
        return res.status(200).json({ token: user.generateJWT() });
    } catch (err) {
        // 11000 = duplicate key (email already registered)
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Email already registered' });
        }
        return res.status(400).json({ message: 'Unable to register user', error: err.message });
    }
};

// POST /api/login - check credentials with Passport and return a JWT
const login = (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'All fields required' });
    }
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(404).json(err);
        }
        if (user) {
            return res.status(200).json({ token: user.generateJWT() });
        }
        return res.status(401).json(info);
    })(req, res);
};

module.exports = { register, login };
