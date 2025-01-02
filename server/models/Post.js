const mongoose = require('mongoose');
const CryptoJS = require('crypto-js');
const config = require('../config');
const postStatus = require('../constants/postStatus');

/**
 * status
 * post_platform
 * platform_group
 * job
 * price
 * phrase
 * timing
 * created_at
 * updated_at
 * user
 */

const key = CryptoJS.enc.Hex.parse(config.crypto.key);
const iv = CryptoJS.enc.Hex.parse(config.crypto.iv);

const postSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: Object.values(postStatus),
        default: postStatus.CREATED,
        message: 'Invalid status'
    },
    post_platform: {
        type: String,
        required: true
    },
    platform_group: {
        type: String,
        required: true
    },
    // platform: {
    // 	ref: 'Platform',
    // 	type: mongoose.Schema.Types.ObjectId,
    // },
    jobID: {
        ref: 'Job',
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    price: {
        type: Number,
        validate: {
            validator: function(value) {
                return value >= 0;
            },
            message: 'Price should be a positive number'
        },
        default: 0
    },
    phrase: {
        type: String
    },
    timing: {
        type: Date
    },
	created_at: {
		type: Date,
		default: Date.now
	},
	updated_at: {
		type: Date
	},
	userID: {
		ref: 'User',
		type: mongoose.Schema.Types.ObjectId,
        required: true
	}
});

postSchema.methods.encryptPassword = async function(password) {
    this.password = await CryptoJS.AES.encrypt(password, key, { iv: iv }).toString();
};

postSchema.methods.decryptPassword = async function() {
    const bytes = CryptoJS.AES.decrypt(this.password, key, { iv: iv });
    return bytes.toString(CryptoJS.enc.Utf8);
};

postSchema.pre(/save|update/, async function(next) {
    if (this.isModified('password')) {
        this.encryptPassword(this.password);
    }
    next();
});

postSchema.pre(/update/, async function(next) {
    this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model('Post', postSchema);
