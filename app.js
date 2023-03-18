const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

require('dotenv').config({ path: './config/config.env' });

// Configurations
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('trust proxy', true)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Database
const connectDB = require('./config/db');
connectDB(app);

// Routes
app.use('/api/users', require('./api/users'));
app.use('/api/security', require('./api/security'));
app.use('/api/login', require('./api/login'));
app.use('/api/register', require('./api/register'));
app.use('/api/generate-key', require('./api/generate-key'));

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

module.exports = app;
