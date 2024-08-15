const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler'); // 捕獲異步錯誤的中間件
const User = require('../models/userModel'); // 引入用戶模型
const Task = require('../models/taskModel'); // 假設 task 模型在 models 文件夾下
const generateToken = require('../utils/generateToken'); // 引入生成 JWT 的工具函數

// 檢查email是否存在
const findEmailExist = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400);
    throw new Error('Email not exists');
  }
  const userExists = await User.findOne({ email });

  res.status(201).json({
    user_exists: userExists ? true : false,
    user_email: email
  });

})

// 註冊新用戶
const registerUser = asyncHandler(async (req, res) => {
  const { email, name, password } = req.body;

  // 檢查用戶是否已經存在
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists'); // 用戶已經存在，返回錯誤
  }

  // 創建新用戶
  const user = await User.create({
    email,
    name,
    password,
  });

  if (user) {
    // 成功創建用戶，返回用戶信息和 JWT
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id, user.email),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data'); // 用戶數據無效，返回錯誤
  }
});

// 用戶登錄
const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // 查找用戶
  const user = await User.findOne({ email });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!user || !isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  if (user) {
    const token = generateToken(user._id, user.email);
    res.json({
      token: token,
      message: 'login success',
      info: {
        id: user._id,
        name:user.name,
        email: user.email,
        category: user.category,
        tag: user.tag,
      }
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password'); // 郵箱或密碼無效，返回錯誤
  }
});

// 用戶登錄
const checkUserLogin = asyncHandler(async (req, res) => {
  // 查找用戶
  let userId = req?.user?.id
  // // 檢查使用者是否存在
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  if (user) {
    res.json({
      message: 'login success',
      info: {
        id: user._id,
        name:user.name,
        email: user.email,
        category: user.category,
        tag: user.tag,
      }
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password'); // 郵箱或密碼無效，返回錯誤
  }
});

// 用戶任務數量
const getTaskStats = async (req, res) => {
  let userId = req?.user?.id
  // // 檢查使用者是否存在
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  try {
    const categoryCounts = await countTasksByCategory(userId);
    const tagCounts = await countTasksByTag(userId);
    const totalCount = await countAllTasks(userId);

    res.json({
      categories: categoryCounts,
      tags: tagCounts,
      total: totalCount
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching task stats' });
  }
};

const countTasksByCategory = async (userId) => {
  try {
    const tasks = await Task.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const result = {};
    tasks.forEach(task => {
      result[task._id] = task.count;
    });

    return result;
  } catch (error) {
    console.error('Error counting tasks by category:', error);
    throw error;
  }
};

// 各个 tag 分别的数量并返回其 name 作为 key
const countTasksByTag = async (userId) => {
  try {
    const tasks = await Task.aggregate([
      { $match: { userId: userId } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags.name', count: { $sum: 1 } } }
    ]);

    const result = {};
    tasks.forEach(task => {
      result[task._id] = task.count;
    });

    return result;
  } catch (error) {
    console.error('Error counting tasks by tag:', error);
    throw error;
  }
};

// 所有任务的数量
const countAllTasks = async (userId) => {
  try {
    const count = await Task.countDocuments({ userId: userId });
    return count;
  } catch (error) {
    console.error('Error counting all tasks:', error);
    throw error;
  }
};

// 新增使用者類別分類
const addUserCategory = async (req, res) => {
  try {
    let userId = req?.user?.id
    const { category } = req.body;
    console.log(category)
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { category: category } }, // 使用 $addToSet 确保不重复添加
      { new: true, runValidators: true } // 返回更新后的文档，并运行验证
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error counting all tasks:', error);
    throw error;
  }
};

// 新增使用者類別分類
const addUserTag = async (req, res) => {
  try {
    let userId = req?.user?.id
    const { tag } = req.body;
    console.log(tag)
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { tag: tag } }, // 使用 $addToSet 确保不重复添加
      { new: true, runValidators: true } // 返回更新后的文档，并运行验证
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error counting all tasks:', error);
    throw error;
  }
};



module.exports = { registerUser, userLogin, findEmailExist, checkUserLogin, getTaskStats, addUserCategory, addUserTag };
