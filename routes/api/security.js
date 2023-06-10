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
        return res.status(401).json({ unauthorized: 'No Token' });
    }
    try {
        jwt.verify(token, publicKey, { algorithms: 'RS256' }, (err, decoded) => {
            if (err) {
                if (err instanceof jwt.TokenExpiredError) {
                    return res.status(403).json({ error: "Token expired" });
                } else {
                    return res.status(403).json({ error: "Invalid token" });
                }
            }
        
            handleUserAndIp(decoded.userId, req, res, next);
        });
        
        async function handleUserAndIp(userId, req, res, next) {
            const user = await User.findById(userId);
        
            if (!user) {
                return res.status(401).json({ unauthorized: 'Invalid User' });
            }
        
            var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        
            const bannedIP = await User.findOne({$and: [{ lastIP: ip }, { banned: true }]});
        
            if (bannedIP) {
                return res.status(401).json({ unauthorized: 'IP Banned' });
            }
        
            next();
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
};

module.exports = checkApiKey;