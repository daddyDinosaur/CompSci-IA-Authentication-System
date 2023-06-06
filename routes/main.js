const express = require('express');
const router = express.Router();
const User = require('../models/user');
const security = require('./security');

router.get('/', security, async (req, res) => {
    return res.status(401).json({ message: 'Testing' });
    // const users = await User.find().sort('name');
    // res.render('index', { users });
});

module.exports = router;