const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../../models/user');
const fs = require('fs');
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');

const privateKey = fs.readFileSync(process.env.PRIV_KEY_PATH, 'utf8');

router.get('/', (req, res) => {
    res.render('login');
});

router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized Invalid Email' });
        }

        const payload = {
            userId: user._id,
            email: user.email,
        };

        const token = jwt.sign(payload, { key: privateKey, passphrase: process.env.PASSPHRASE }, { algorithm: 'RS256', expiresIn: '1h' });

        res.cookie('authToken', token, { httpOnly: true });

        return res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

module.exports = router;
