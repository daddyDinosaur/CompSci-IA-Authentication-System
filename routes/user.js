const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const app = require('../app');
const security = require('./security');
const fs = require('fs');

const privateKey = fs.readFileSync(process.env.PRIV_KEY_PATH, 'utf8');

router.get('/', security, async (req, res) => {
    try {
        const theUsers = await User.find();
        const encrpyUsers = jwt.sign({ users: theUsers }, { key: privateKey, passphrase: process.env.PASSPHRASE }, { algorithm: 'RS256', expiresIn: '5m' });
        res.json(encrpyUsers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

module.exports = router;