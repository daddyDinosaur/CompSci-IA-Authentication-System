const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../../models/user');
const { SubKey } = require('../../models/subKey');
const { checkApiKey, isAdmin } = require('../api/security');

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
        });

        await SubKey.findOneAndRemove({ key });
    
        await user.save();

        res.status(200).json({ success: 'User Created' })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.post('/admin', checkApiKey, isAdmin, async (req, res) => {
    try {
        const { username, email, password, key, role } = req.body;

        if (!username || !email || !password || !key) {
            return res.status(401).json({ error: 'Missing Data' });
        }

        if (!role) {
            role = "USER";
        }

        const userExists = await User.findOne({$or: [{ email: email }, { username: username }]});
        
        if (userExists) {
            return res.status(401).json({ error: 'User already exists' });
        }

        const foundKey = await SubKey.findOne({ key });
        if (!foundKey) {
            return res.status(401).json({ error: 'Invalid Key' });
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
            role: role,
        });

        await SubKey.findOneAndRemove({ key });
    
        await user.save();

        res.status(200).json({ success: 'User Created' })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

module.exports = router;