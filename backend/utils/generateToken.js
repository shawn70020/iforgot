const jwt = require('jsonwebtoken');

// 生成 JWT
const generateToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: '7d', // 設置 token 的有效期為 30 天
  });
};

module.exports = generateToken;
