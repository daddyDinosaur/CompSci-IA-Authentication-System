const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../../models/user');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const privateKey = fs.readFileSync(process.env.PRIV_KEY_PATH, 'utf8');

router.get('/', async (req, res) => {
    try {
        const { email, password } = req.query;

        if (!email || !password) {
            res.send('Missing Data.');
            return;
        }

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

        const payload = {
            userId: user._id,
            email: user.email,
            role: user.role,
        };

        var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
        await User.findOneAndUpdate({ _id: user._id }, { $set: { lastLogin: Date.now(), lastIP: ip } });

        const token = jwt.sign(payload, { key: privateKey, passphrase: process.env.PASSPHRASE }, { algorithm: 'RS256', expiresIn: '1h' });

        res.status(200).json({ token: token })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

module.exports = router;
