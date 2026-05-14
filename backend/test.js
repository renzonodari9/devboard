const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const uris = [
  'mongodb://localhost:27017/devboard',
  'mongodb://127.0.0.1:27017/devboard',
  'mongodb://::1:27017/devboard'
];

async function test() {
  for (const uri of uris) {
    try {
      console.log(`Probando: ${uri}`);
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
      console.log(`✓ Conectado con: ${uri}`);
      return uri;
    } catch (e) {
      console.log(`✗ Falló: ${e.message}`);
    }
  }
  throw new Error('No se pudo conectar a MongoDB');
}

test().then(uri => {
  console.log(`\nUsa esta URI en tu .env: MONGO_URI=${uri}`);
  process.exit(0);
}).catch(e => {
  console.error('ERROR:', e.message);
  process.exit(1);
});
