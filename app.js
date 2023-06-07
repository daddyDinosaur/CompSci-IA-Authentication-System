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
app.use(express.static('views'));
app.set('view engine', 'ejs');

// Database
const connectDB = require('./config/db');
connectDB(app);

// Routes
const userRoute = require('./routes/user');
app.use('/api/user', userRoute(app));
app.use('/api/security', require('./routes/security')(app));
app.use('/api/login', require('./routes/login')(app));
app.use('/api/register', require('./routes/register')(app));
app.use('/api/gen-key', require('./routes/gen-key')(app));
app.use('/', require('./routes/main')(app));


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

module.exports = app;
