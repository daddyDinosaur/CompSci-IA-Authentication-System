const express = require('express');
const router = express.Router();
const { User } = require('../../models/user');
const jwt = require('jsonwebtoken');
const app = require('../../app');
const { checkApiKey, isAdmin } = require('./security');
const fs = require('fs');
const bcrypt = require('bcrypt');

const privateKey = fs.readFileSync(process.env.PRIV_KEY_PATH, 'utf8');

router.post('/', checkApiKey, isAdmin, async (req, res) => {
    try {
        const theUsers = await User.find();
        const encryptedUsers = jwt.sign({ users: theUsers }, { key: privateKey, passphrase: process.env.PASSPHRASE }, { algorithm: 'RS256', expiresIn: '1h' });
        res.json(encryptedUsers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.post('/delAll', checkApiKey, isAdmin, async (req, res) => {
    try {
        await User.deleteMany();
        res.status(200).json({ success: 'Deleted All Users' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while deleting all users.' });
    }
});

router.post('/delUser', checkApiKey, isAdmin, async (req, res) => {
    const { username, id } = req.body;

    if(!username && !id){
        return res.status(400).json({ message: 'Please provide either a username or an id of the user to delete' });
    }

    const query = id ? { _id: id } : { username: username };
    
    try {
        const user = await User.findOneAndDelete(query, {useFindAndModify: false});
        
        if(!user) {
            return res.status(404).json({ error: 'No user found to delete.' });
        }

        res.status(200).json({ success: 'Deleted User', userId: user._id, username: user.username });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while deleting a user.' });
    }
});

router.post('/delExpired', checkApiKey, isAdmin, async (req, res) => {
    try {
        const usersCursor = User.find({}).cursor();

        for (let daUser = await usersCursor.next(); daUser != null; daUser = await usersCursor.next()) {
            if (!daUser.expiry || new Date(daUser.expiry) < Date.now() && !daUser.banned) {
                await User.findByIdAndDelete(daUser._id);
            }
        }

        res.status(200).json({ success: 'Deleted expired accounts' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.post('/ban', checkApiKey, isAdmin, async (req, res) => {
    try {
        const { id, username, banReason } = req.body;

        if (!id && !username) {
            return res.status(400).json({ error: 'Missing id or username' });
        }

        const query = id ? { _id: id } : { username: username };
        const user = await User.findOne(query);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (banReason) {
            user.banReason = banReason;
        } else if (!user.banned) {
            user.banReason = ""; 
        }

        user.banned = !user.banned;

        await user.save();

        res.status(200).json({ success: 'User ban status toggled', userId: user._id, username: user.username, banned: user.banned });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.post('/resetHwid', checkApiKey, isAdmin, async (req, res) => {
    try {
        const { id, username } = req.body;

        if (!id && !username) {
            return res.status(400).json({ error: 'Missing id or username' });
        }

        const query = id ? { _id: id } : { username: username };
        const user = await User.findOne(query);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.hwid = "";
        await user.save();

        res.status(200).json({ success: 'User HWID reset', userId: user._id, username: user.username });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.post('/getUserInfo', checkApiKey, isAdmin, async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'Missing user ID' });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            keys: user.keys,
            subscription: user.subscription,
            expiry: user.expiry,
            banned: user.banned,
            banReason: user.banReason,
            hwid: user.hwid,
            registered: user.registered,
            lastLogin: user.lastLogin,
            lastIP: user.lastIP,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.post('/saveUser', checkApiKey, isAdmin, async (req, res) => {
    try {
        const { id, username, email, password, role } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'Missing user id' });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10); 
        if (role) user.role = role;

        await user.save();

        res.status(200).json({ success: 'User updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

module.exports = router;