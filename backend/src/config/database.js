const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI is not set in environment variables');
      return;
    }
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Error:', error.message);
    // Server continues running, /api/health returns degraded status
  }
};

module.exports = connectDB;
