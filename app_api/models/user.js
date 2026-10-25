const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Administrator account. Passwords are never stored: only a random salt and
// the PBKDF2 hash of password + salt.
const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    hash: String,
    salt: String
});

// Hash and store a new password
userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

// Check a submitted password against the stored hash
userSchema.methods.validPassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
};

// Create a signed JSON Web Token that expires in one hour
userSchema.methods.generateJWT = function () {
    return jwt.sign(
        { _id: this._id, email: this.email, name: this.name },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

const User = mongoose.model('users', userSchema);
module.exports = User;
