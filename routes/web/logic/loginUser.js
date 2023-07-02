const bcrypt = require('bcrypt');
const { User } = require('../../../models/user');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const privateKey = fs.readFileSync(process.env.PRIV_KEY_PATH, 'utf8');

const loginUser = async (email, password, ip) => {
    const user = await User.findOne({ email: email });

    if (!user) {
        return res.status(401).json({ error: 'Invalid Email' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        return res.status(401).json({ error: 'Invalid Pass' });
    }

    if (user.banned) {
        return res.status(401).json({ unauthorized: 'Banned' });
    }

    if (user.expiry && new Date(user.expiry) < Date.now()) {
        user = await User.findOneAndUpdate({ _id: user._id }, { $set: { expiry: null, subscription: null } }, { new: true }, {useFindAndModify: false});
    }

    const payload = {
        userId: user._id,
        email: user.email,
        role: user.role,
        subscription: user.subscription,
        expiry: user.expiry,
        hwid: user.hwid,
    };

    await User.findOneAndUpdate({ _id: user._id }, { $set: { lastLogin: Date.now(), lastIP: ip } }, {useFindAndModify: false});

    const token = jwt.sign(payload, { key: privateKey, passphrase: process.env.PASSPHRASE }, { algorithm: 'RS256', expiresIn: '1h' });

    res.cookie('authToken', token, { httpOnly: true });
}

module.exports = loginUser;
