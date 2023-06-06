const mongoose = require('mongoose');
const fs = require('fs');
const crypto = require('crypto');
mongoose.set('strictQuery', false);

let privateKey = null;
let publicKey = null;

const readOrCreateKeys = (app) => {
  if (!fs.existsSync('./private.pem') || !fs.existsSync('./public.pem')) {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: process.env.PASSPHRASE 
      }
    });
    fs.writeFileSync('private.pem', privateKey);
    fs.writeFileSync('public.pem', publicKey);
    privateKey = genPrivateKey;
    publicKey = genPublicKey;
  } else {
    privateKey = fs.readFileSync('./private.pem', 'utf8');
    publicKey = fs.readFileSync('./public.pem', 'utf8');
  }
}

const connectDB = async (app) => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    readOrCreateKeys(app);

  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
}

module.exports = { connectDB, privateKey, publicKey };
