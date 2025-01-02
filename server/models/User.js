const mongoose = require('mongoose');
let jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs');
const config = require('../config');

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: 'Invalid email format'
        }
    },
    password: {
        type: String,
        validate: {
            validator: function(value) {
                return value.length >= 5;
            },
            message: 'Password should be at least 5 characters long'
        }
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
});

userSchema.methods.generateJWT = function() {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            role: this.role
        },
        config.jwt.secret,
        {
            expiresIn: config.jwt.expiresIn
        }
    );
};

userSchema.methods.setPassword = async function(password) {
    this.password = await bcrypt.hash(password, 10);
};

userSchema.methods.toAuthJSON = function() {
    return {
        _id: this._id,
        email: this.email,
        role: this.role,
        name: this.name,
        otpVerified: this.otpVerified,
        token: this.generateJWT()
    };
};

module.exports = mongoose.model('User', userSchema);
