const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 定義用戶數據結構的 Schema
// const userSchema = mongoose.Schema(
//   {
//     name: { type: String, required: true }, // 用戶名
//     email: { type: String, required: true, unique: true }, // 用戶郵箱，唯一
//     password: { type: String, required: true }, // 用戶密碼
//     category: { type: [String], default: ['Personal', 'Work', 'Home'], required: true }, // 用戶分類，字符串陣列，默認包含 'personal'
//     tag: { type: [Object], default: [{ name: 'Priority', color: 'yellow' }, { name: '重要', color: 'red' }], required: true }, // 用戶分類，字符串陣列，默認包含 'personal'
//   },
//   {
//     timestamps: true, // 自動生成 createdAt 和 updatedAt 字段
//   }
// );

const userSchema = mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true // 允许为空，并确保唯一性
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String, // 传统用户名密码登录时使用
    required: function () {
      return !this.googleId; // 当没有 Google ID 时，密码是必需的
    }
  },
  avatar: {
    type: String
  },
  category: { type: [String], default: ['Personal', 'Work', 'Home'], required: true }, // 用戶分類，字符串陣列，默認包含 'personal'
  tag: { type: [Object], default: [{ name: 'Priority', color: 'yellow' }, { name: '重要', color: 'red' }], required: true }, // 用戶分類，字符串陣列，默認包含 'personal'
},
  {
    timestamps: true, // 自動生成 createdAt 和 updatedAt 字段
  });

// 在保存用戶之前對密碼進行加密
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
// 創建用戶模型
const User = mongoose.model('User', userSchema);

// 導出用戶模型
module.exports = User;
