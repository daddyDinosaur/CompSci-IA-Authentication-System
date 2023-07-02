const bcrypt = require('bcrypt');
const { User } = require('../../../models/user');
const { SubKey } = require('../../../models/subKey');

const durationUnits = {
    'H': 60 * 60 * 1000,
    'D': 24 * 60 * 60 * 1000,
    'W': 7 * 24 * 60 * 60 * 1000,
    'M': 30 * 24 * 60 * 60 * 1000,
    'Y': 365.25 * 24 * 60 * 60 * 1000
};

const registerUser = async (username, email, password, key, ip) => {
    const userExists = await User.findOne({$or: [{ email: email }, { username: username }]});
    
    if (userExists) {
        return { status: 409, message: 'User already exists', error: true };
    }

    const foundKey = await SubKey.findOne({ key });

    if (!foundKey) {
        return { status: 409, message: 'Invalid Key', error: true };
    }

    const duration = foundKey.duration;
    const unit = duration.slice(-1).toUpperCase();
    const value = parseInt(duration);
    let newExpiryDate;
    
    if (durationUnits.hasOwnProperty(unit)) {
        const durationInMs = value * durationUnits[unit];
        newExpiryDate = new Date(Date.now() + durationInMs);
    } else {
        return { status: 409, message: 'Invalid Duration on Key', error: true };
    }

    const bannedIP = await User.findOne({$and: [{ lastIP: ip }, { banned: true }]});

    if (bannedIP) {
        return { status: 403, message: 'IP Banned', error: true };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        username: username,
        email: email,
        password: hashedPassword,
        registered: Date.now(),
        keys: key,
        role: "USER",
        subscription: foundKey.type,
        expiry: newExpiryDate,
    });

    await SubKey.findOneAndRemove({ key });

    await user.save();

    return { status: 200, message: 'User registered successfully', error: false };
}

module.exports = registerUser;
