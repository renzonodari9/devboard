const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = 'mongodb://localhost:27017/devboard';

async function createUser() {
  await mongoose.connect(MONGO_URI);
  
  const User = mongoose.model('User', new mongoose.Schema({
    name: String,
    email: String,
    password: String
  }));

  const email = 'dev@devboard.com';
  const password = '123456';
  
  const userExists = await User.findOne({ email });
  
  if (userExists) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.updateOne({ email }, { password: hashedPassword });
    console.log('Usuario actualizado');
  } else {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.create({
      name: 'Dev User',
      email,
      password: hashedPassword
    });
    console.log('Usuario creado');
  }
  
  await mongoose.disconnect();
  console.log('Listo! Usa: dev@devboard.com / 123456');
}

createUser().catch(console.error);
