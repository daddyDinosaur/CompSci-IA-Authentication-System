const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const security = require('../routes/security');
const {app} = require('../app');

app.get('/api/users', security, async (req, res) => {
    const theUsers = await User.find();
    
    const encrpyUsers = jwt.sign({users: theUsers}, {key: app.get('privSecret'), passphrase: 'GamingChairOnTop'}, { algorithm: 'RS256' , expiresIn: '5m' });

    res.json(encrpyUsers);
});

module.exports = router;
