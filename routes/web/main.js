const express = require('express');
const router = express.Router();
const { User } = require('../../models/user');
const { checkApiKey, isAdmin } = require('../api/security');

router.get('/', checkApiKey, async (req, res) => {
    const users = await User.find().sort('name');
    res.render('index', { users });
});

module.exports = router;