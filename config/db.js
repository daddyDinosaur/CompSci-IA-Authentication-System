const mongoose = require('mongoose');
const fs = require('fs');
const crypto = require('crypto');
mongoose.set('strictQuery', false);

const connectDB = async (app) => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

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
          passphrase: 'GamingChairOnTop'
        }
      });
      fs.writeFileSync('private.pem', privateKey);
      fs.writeFileSync('public.pem', publicKey);
      app.set('privSecret', privateKey);
      app.set('pubSecret', publicKey);
    } else {
      const privateKey = fs.readFileSync('./private.pem', 'utf8');
      const publicKey = fs.readFileSync('./public.pem', 'utf8');
      app.set('privSecret', privateKey);
      app.set('pubSecret', publicKey);
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

module.exports = connectDB;
