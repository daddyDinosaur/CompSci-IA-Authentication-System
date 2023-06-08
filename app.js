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

// Load private and public keys
const privateKey = { key: fs.readFileSync('./private.pem', 'utf8'), passphrase: process.env.PASSPHRASE };

const publicKey = fs.readFileSync('./public.pem', 'utf8');
process.env.PRIV_SECRET = privateKey; 

// Routes
const userRoutes = require('./routes/user');
const securityRoutes = require('./routes/security');
const loginRoutes = require('./routes/login');
const registerRoutes = require('./routes/register');
const genKeyRoutes = require('./routes/gen-key');
const mainRoutes = require('./routes/main');

app.use('/api/user', userRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/gen-key', genKeyRoutes);
app.use('/', mainRoutes);


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

module.exports = app;
