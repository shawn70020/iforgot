const express = require('express');
const { registerUser, userLogin, findEmailExist, checkUserLogin, getTaskStats, addUserCategory, addUserTag } = require('../controllers/userController'); // 引入用戶控制器
const router = express.Router();

// 用戶註冊路由
router.post('/register', registerUser);

// 用戶登錄路由
router.post('/login', userLogin);

// 檢查用戶存在
router.post('/check-email', findEmailExist)

// 用戶重定向
router.get('/check-login', checkUserLogin)

// 獲取用戶任務數量
router.get('/get-user-task-count', getTaskStats)

// 新增用戶類別
router.post('/add-category', addUserCategory)

// 新增用戶標籤
router.post('/add-tag', addUserTag)

module.exports = router;
