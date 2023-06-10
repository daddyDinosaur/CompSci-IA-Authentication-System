const express = require('express');
const router = express.Router();
const { User } = require('../../models/user');
const jwt = require('jsonwebtoken');
const app = require('../../app');
const { checkApiKey, isAdmin } = require('./security');
const fs = require('fs');

const privateKey = fs.readFileSync(process.env.PRIV_KEY_PATH, 'utf8');

router.post('/', checkApiKey, isAdmin, async (req, res) => {
    try {
        const theUsers = await User.find();
        const encrpyUsers = jwt.sign({ users: theUsers }, { key: privateKey, passphrase: process.env.PASSPHRASE }, { algorithm: 'RS256', expiresIn: '1h' });
        res.json(encrpyUsers);
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

    let query = {};

    if(username){
        query.username = username;
    }
    if(id){
        query._id = id;
    }

    try {
        const user = await User.findOneAndDelete(query, {useFindAndModify: false});
        
        if(!user) {
            return res.status(404).json({ error: 'No user found to delete.' });
        }

        res.status(200).json({ success: 'Deleted User' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while deleting a user.' });
    }
});


module.exports = router;