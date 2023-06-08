const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const fs = require('fs');

const privateKey = fs.readFileSync(process.env.PRIV_KEY_PATH, 'utf8');

router.get('/', async (req, res) => {
    try {

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

module.exports = router;
