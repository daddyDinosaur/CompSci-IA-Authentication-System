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

//Start app
const startApp = async () => {
  try {
    //Wait for DB
    await connectDB(app);
    
    //Store key
    process.env.PRIV_KEY_PATH = './private.pem';
    process.env.PUB_KEY_PATH = './public.pem';
  
    // Routes
    const userApiRoutes = require('./routes/api/user');
    const loginApiRoutes = require('./routes/api/login');
    const registerApiRoutes = require('./routes/api/register');
    const genKeyApiRoutes = require('./routes/api/gen-key');
  
    app.use('/api/users', userRoutes);
    app.use('/api/login', loginRoutes);
    app.use('/api/register', registerRoutes);
    app.use('/api/gen-key', genKeyRoutes);

    const loginRoutes = require('./routes/web/login');
    const registerRoutes = require('./routes/web/register');
    const mainRoutes = require('./routes/web/main');
  
    app.use('/login', loginRoutes);
    app.use('/register', registerRoutes);
    app.use('/', mainRoutes);
  
    // Start serv
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
  } catch (err) {
    console.error(`Error starting the application: ${err.message}`);
    process.exit(1);
  }
}

startApp();

module.exports = app;
