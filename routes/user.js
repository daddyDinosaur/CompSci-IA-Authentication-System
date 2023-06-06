const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const app = require('../app');

router.get('/api/user', async (req, res) => {
    try {
        const theUsers = await User.find();
        const encrpyUsers = jwt.sign({users: theUsers}, {key: app.get('privSecret'), passphrase: 'GamingChairOnTop'}, { algorithm: 'RS256' , expiresIn: '5m' });
        res.json(encrpyUsers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});


module.exports = router;