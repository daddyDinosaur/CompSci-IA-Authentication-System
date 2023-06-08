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
    const userRoutes = require('./routes/user');
    const loginRoutes = require('./routes/login');
    const registerRoutes = require('./routes/register');
    const genKeyRoutes = require('./routes/gen-key');
    const mainRoutes = require('./routes/main');
  
    app.use('/api/users', userRoutes);
    app.use('/api/login', loginRoutes);
    app.use('/api/register', registerRoutes);
    app.use('/api/gen-key', genKeyRoutes);
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
