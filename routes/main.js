const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const security = require('../routes/security');

router.get('/', security, async (req, res) => {
    const users = await User.find().sort('name');
    res.render('index', { users });
});

module.exports = router;