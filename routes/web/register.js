const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../../models/user');
const { SubKey } = require('../../models/subKey');

const durationUnits = {
    'H': 60 * 60 * 1000,
    'D': 24 * 60 * 60 * 1000,
    'W': 7 * 24 * 60 * 60 * 1000,
    'M': 30 * 24 * 60 * 60 * 1000,
    'Y': 365.25 * 24 * 60 * 60 * 1000
};

router.get('/', (req, res) => {
    res.render('register');
});

router.post('/', async (req, res) => {
    try {
        const { username, email, password, key } = req.body;

        if (!username || !email || !password || !key) {
            return res.status(401).json({ error: 'Missing Data' });
        }

        const userExists = await User.findOne({$or: [{ email: email }, { username: username }]});
        
        if (userExists) {
            return res.status(401).json({ error: 'User already exists' });
        }

        const foundKey = await SubKey.findOne({ key });
        if (!foundKey) {
            return res.status(401).json({ error: 'Invalid Key' });
        }

        const duration = foundKey.duration;
        const unit = duration.slice(-1).toUpperCase();
        const value = parseInt(duration);
        let newExpiryDate;
        
        if (durationUnits.hasOwnProperty(unit)) {
            const durationInMs = value * durationUnits[unit];
            newExpiryDate = new Date(Date.now() + durationInMs);
        } else {
            return res.status(401).json({ error: 'Invalid Duration on Key' });
        }

        var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        const bannedIP = await User.findOne({$and: [{ lastIP: ip }, { banned: true }]});

        if (bannedIP) {
            return res.status(401).json({ unauthorized: 'IP Banned' });
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

        return res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

module.exports = router;