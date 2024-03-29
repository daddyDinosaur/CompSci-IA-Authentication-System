const bcrypt = require('bcrypt');
const { User } = require('../../../models/user');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const privateKey = fs.readFileSync(process.env.PRIV_KEY_PATH, 'utf8');

const loginUser = async (res, email, password, ip) => {
    const user = await User.findOne({ email: email });

    if (!user) {
        return { status: 409, message: 'Invalid Email', error: true };
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        return { status: 409, message: 'Invalid Pass', error: true };
    }

    if (user.banned) {
        return { status: 403, message: 'Banned', error: true };
    }

    if (user.expiry && new Date(user.expiry) < Date.now()) {
        user = await User.findOneAndUpdate(
            { _id: user._id },
            { $set: { expiry: null, subscription: null } },
            { new: true, useFindAndModify: false }
        );
    }

    const payload = {
        userId: user._id,
        email: user.email,
        role: user.role,
        subscription: user.subscription,
        expiry: user.expiry,
        hwid: user.hwid,
    };

    await User.findOneAndUpdate(
        { _id: user._id },
        { $set: { lastLogin: Date.now(), lastIP: ip } },
        { useFindAndModify: false }
    );

    const token = jwt.sign(payload, { key: privateKey, passphrase: process.env.PASSPHRASE }, { algorithm: 'RS256', expiresIn: '1h' });

    res.cookie('authToken', token, { httpOnly: true });

    return { status: 200, message: 'User logged in successfully', error: false };
}

module.exports = loginUser;
