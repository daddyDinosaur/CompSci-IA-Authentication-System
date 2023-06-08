const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const fs = require('fs');
const mongoose = require("mongoose");

const privateKey = fs.readFileSync(process.env.PRIV_KEY_PATH, 'utf8');

router.get('/', async (req, res) => {
    try {
        console.log(req.query);

        const { email, password } = req.query;

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized Invalid Email' });
        }

        const payload = {
            userId: user._id,
            email: user.email,
        };

        const token = jwt.sign(payload, {key: privateKey, passphrase: process.env.passphrase}, { algorithm: 'RS256' , expiresIn: '1h' });

        res.status(200).json({ token: token })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

module.exports = router;
