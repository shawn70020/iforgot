const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const fileRoutes = require('./routes/fileRoutes');
const subRoutes = require('./routes/subRoutes');
const authRoutes = require('./routes/authRoute');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const auth = require('./middleware/auth');
const { scheduleDailyTask } = require('./tasks/cleanTasks'); 
dotenv.config(); // 加載 .env 文件中的環境變量

connectDB(); // 連接到 MongoDB
const app = express();

app.use(express.json()); // 解析 JSON 請求體
app.use(cookieParser()); // 使用 cookie-parser 中間件
app.use(cors()); // 啟用所有 CORS 請求



// 使用全局身份驗證中間件
app.use(auth);

// 設置用戶路由
app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/sub', subRoutes);

const PORT = process.env.PORT || 8080; // 設置伺服器端口

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  scheduleDailyTask()
});
