const express = require('express');
const router = express.Router();
const { SubKey } = require('../../models/subKey');
const { checkApiKey, isAdmin } = require('./security');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const privateKey = fs.readFileSync(process.env.PRIV_KEY_PATH, 'utf8');

router.post('/', checkApiKey, isAdmin, async (req, res) => {
    try {
        if (!req.body.pattern) {
            return res.status(401).json({ error: 'Missing Data' });
        }
        const pattern = req.body.pattern;
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let newString = "";
        
        for (let i = 0; i < pattern.length; i++) {
            if (pattern[i] === "X") {
                newString += characters.charAt(Math.floor(Math.random() * characters.length));
            } else {
                newString += pattern[i];
            }
        }
        
        const daprog = new SubKey({ key: newString });
        await daprog.save();
        
        const encrpyUsers = jwt.sign({GeneratedKey: newString}, { key: privateKey, passphrase: process.env.PASSPHRASE }, { algorithm: 'RS256' , expiresIn: '1h' });

        res.json(encrpyUsers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

module.exports = router;