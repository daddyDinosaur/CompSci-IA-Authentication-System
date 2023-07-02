const express = require('express');
const router = express.Router();
const loginUser = require('../web/logic/loginUser');

router.get('/', (req, res) => {
    res.render('login');
});

router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(401).json({ error: 'Missing Data' });
        }

        try {
            const loggedIn = await loginUser(email, password, req.ip);
    
            if (loggedIn.error) {
                res.status(loggedIn.status).json({ error: loggedIn.message });
            } else {
                res.redirect('/');
            }
        } catch (err) {
            next(err);
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

module.exports = router;
