const express = require('express');
const router = express.Router();
const { SubKey } = require('../../models/subKey');
const { checkApiKey, isAdmin } = require('./security');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const privateKey = fs.readFileSync(process.env.PRIV_KEY_PATH, 'utf8');

router.post('/', checkApiKey, isAdmin, async (req, res) => {
    try {
        if (!req.body.pattern || !req.body.duration || !req.body.type) {
            return res.status(401).json({ error: 'Missing Data' });
        }

        const pattern = req.body.pattern.toUpperCase();
        let duration = req.body.duration;
        const type = req.body.type;
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let newString = "";

        if (!['lite', 'pro'].includes(type.toLowerCase())) {
            return res.status(400).json({ error: 'Invalid type. Only "lite" or "pro" are allowed.' });
        }

        duration = duration.toLowerCase();

        for (let i = 0; i < pattern.length; i++) {
            if (pattern[i] === "X") {
                newString += characters.charAt(Math.floor(Math.random() * characters.length));
            } else {
                newString += pattern[i];
            }
        }

        const daprog = new SubKey({ key: newString, duration: duration, type: type });
        await daprog.save();

        const encryptedKey = jwt.sign({GeneratedKey: newString}, { key: privateKey, passphrase: process.env.PASSPHRASE }, { algorithm: 'RS256' , expiresIn: duration });

        res.json(encryptedKey);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});


router.post('/delAll', checkApiKey, isAdmin, async (req, res) => {
    try {
        await SubKey.deleteMany();
        res.status(200).json({ success: 'Deleted All Keys' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while deleting all keys.' });
    }
});

router.post('/delKey', checkApiKey, isAdmin, async (req, res) => {
    try {
        const { key } = req.body;
        console.log("del")
        console.log(keyId);
        await SubKey.findOneAndDelete({ key }, {useFindAndModify: false});
        res.status(200).json({ success: 'Deleted Key' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while deleting a key.' });
    }
});

module.exports = router;