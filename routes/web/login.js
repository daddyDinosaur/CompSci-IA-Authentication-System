const express = require('express');
const router = express.Router();
const loginUser = require('../web/logic/loginUser');

router.get('/', (req, res) => {
    res.render('login');
});

router.post('/', async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(401).json({ error: 'Missing Data' });
    }

    try {
        const loggedIn = await loginUser(res, email, password, req.ip);

        if (loggedIn.error) {
            res.status(loggedIn.status).json({ error: loggedIn.message });
        } else {
            res.redirect('/');
        }
    } catch (err) {
        next(err);
    }
});

module.exports = router;
