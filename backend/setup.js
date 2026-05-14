const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = 'mongodb://localhost:27017/devboard';

async function setup() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✓ MongoDB conectado');
    
    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      email: String,
      password: String
    }));
    
    const email = 'dev@devboard.com';
    const password = '123456';
    
    const exists = await User.findOne({ email });
    if (exists) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      await User.updateOne({ email }, { password: hash });
      console.log('✓ Usuario actualizado');
    } else {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      await User.create({ name: 'Dev', email, password: hash });
      console.log('✓ Usuario creado');
    }
    
    console.log('✓ Listo! Usa: dev@devboard.com / 123456');
  } catch(e) {
    console.error('Error:', e.message);
  } finally {
    await mongoose.disconnect();
  }
}

setup();
