const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../../models/user');
const { SubKey } = require('../../models/subKey');
const registerUser = require('logic/registerUser');

const durationUnits = {
    'H': 60 * 60 * 1000,
    'D': 24 * 60 * 60 * 1000,
    'W': 7 * 24 * 60 * 60 * 1000,
    'M': 30 * 24 * 60 * 60 * 1000,
    'Y': 365.25 * 24 * 60 * 60 * 1000
};

router.get('/', (req, res) => {
    res.render('register');
});

router.post('/', async (req, res, next) => {
    const { username, email, password, key } = req.body;

    if (!username || !email || !password || !key) {
        return res.status(400).json({ error: 'Missing Data' });
    }

    try {
        const registered = await registerUser(username, email, password, key, req.ip);

        if (registered.error) {
            res.status(registered.status).json({ error: registered.message });
        } else {
            res.redirect('/login');
        }
    } catch (err) {
        next(err);
    }
});


module.exports = router;