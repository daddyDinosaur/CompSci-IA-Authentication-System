const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const fs = require('fs');

const publicKey = fs.readFileSync(process.env.PUB_KEY_PATH, 'utf8');

const checkApiKey = async (req, res, next) => {
    const token = req.cookies.authToken;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized No Token' });
    }
    try {
        const decoded = jwt.verify(token, publicKey , { algorithms: 'RS256' });
        
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized Invalid User' });
        }

        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = checkApiKey;