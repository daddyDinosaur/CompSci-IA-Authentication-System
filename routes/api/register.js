const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../../models/user');
const security = require('./security');
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');

const privateKey = fs.readFileSync(process.env.PRIV_KEY_PATH, 'utf8');

router.get('/', async (req, res) => {
    try {
        const { username, email, password, key } = req.body;

        if (!username || !email || !password || !key) {
            res.send('Missing Data.');
            return;
        }

        const userExists = await User.findOne({$or: [{ email: email }, { username: username }]});
        
        if (userExists) {
            res.send('User Already Exists.');
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username: username,
            email: email,
            password: hashedPassword,
            registered: Date.now(),
            keys: key,
        });
    
        await user.save();

        res.status(200).json({ success: 'User Created' })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

module.exports = router;


module.exports = router;