import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGO_URI = 'mongodb+srv://renzonodari9_admin:48051101@cluster0.rkyn2ls.mongodb.net/?appName=Cluster0';

await mongoose.connect(MONGO_URI);

const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash('TuPasswordNuevo123', salt);

await mongoose.connection.db.collection('users').updateOne(
  { email: 'renzonodari9@gmail.com' },
  { $set: { password: hashedPassword } }
);

console.log('Password updated successfully');
process.exit(0);