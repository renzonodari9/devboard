const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/devboard';

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

async function fix() {
  try {
    console.log('1. Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✓ Connected');
    
    const User = mongoose.model('User', UserSchema);
    
    console.log('2. Finding user dev@devboard.com...');
    const exists = await User.findOne({ email: 'dev@devboard.com' });
    
    if (exists) {
      console.log('3. Updating password...');
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('123456', salt);
      await User.updateOne({ email: 'dev@devboard.com' }, { password: hash });
      console.log('✓ User updated');
    } else {
      console.log('3. Creating user...');
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('123456', salt);
      await User.create({
        name: 'Dev User',
        email: 'dev@devboard.com',
        password: hash
      });
      console.log('✓ User created');
    }
    
    console.log('\n✓ READY! Use:');
    console.log('  Email: dev@devboard.com');
    console.log('  Password: 123456');
    
  } catch(e) {
    console.error('ERROR:', e.message);
  } finally {
    await mongoose.disconnect();
  }
}

fix();
