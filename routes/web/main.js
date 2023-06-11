const express = require('express');
const router = express.Router();
const { User } = require('../../models/user');
const { SubKey } = require('../../models/subKey');
const { checkApiKey, isAdmin } = require('../api/security');

router.get('/', checkApiKey, isAdmin, async (req, res) => {
    const users = await User.find().sort('name');
    const keys = await SubKey.find().sort('name');
    res.render('index', { users, keys });
});

module.exports = router;