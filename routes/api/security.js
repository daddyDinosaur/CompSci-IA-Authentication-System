const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../../models/user');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const publicKey = fs.readFileSync(process.env.PUB_KEY_PATH, 'utf8');

const checkApiKey = async (req, res, next) => {
    const token = req.cookies.authToken;
    if (!token) {
        return res.status(401).json({ Unauthorized: 'No Token' });
    }
    try {
        const decoded = jwt.verify(token, publicKey, { algorithms: 'RS256' });
        
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ Unauthorized: 'Invalid User' });
        }

        var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        const bannedIP = await User.findOne({$and: [{ lastIP: ip }, { banned: true }]});

        if (bannedIP) {
            res.send('IP Banned.');
            return;
        }

        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
};

module.exports = checkApiKey;