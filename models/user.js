const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    registered: { type: Number, required: true },
    lastLogin: { type: Number, required: false },
    lastIP: { type: String, required: false },
    keys: { type: [mongoose.Schema.Types.Mixed], required: false, default: [] },
    subscription: { type: String, required: false, default: 'None' },
    expiry: { type: Date, required: false },
    banned: { type: Boolean, required: false, default: false },
    bannedReason: { type: String, required: false, default: '' },
    hwid: { type: String, required: false, default: '' },
    role : { type: String, required: false, default: 'USER' },
}, {versionKey: false});

const User = mongoose.model('userBase', userSchema);

module.exports = { User };