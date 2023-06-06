const express = require('express');
const router = express.Router();
const User = require('../models/user');
const security = require('./security');

router.get('/', security, async (req, res) => {
    const users = await User.find().sort('name');
    console.log(users);
    res.render('index', { users });
});

module.exports = router;