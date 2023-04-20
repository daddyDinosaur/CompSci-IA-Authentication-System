const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const security = require('../routes/security');

router.get('/', security, async (req, res) => {
    const users = await User.find().sort('name');
    if (req.cookies.alertDisplayed !== 'true') {
        res.cookie('alertDisplayed', true, { httpOnly: true });
        res.render('index', { users, alertMessage: req.query.message });
    } else {
        res.render('index', { users, alertMessage: null });
    }
});

module.exports = router;