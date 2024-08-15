const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // 加載 .env 文件中的環境變量

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // 使用環境變量中的 MONGO_URI
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // 連接失敗，退出進程
  }
};

module.exports = connectDB;
