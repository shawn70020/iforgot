const axios = require('axios');
const qs = require('querystring');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken'); // 引入生成 JWT 的工具函數
require('dotenv').config(); // 加载环境变量

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleCallback = async (req, res) => {
  const { code } = req.query; // 从回调 URL 中提取授权码
  try {
    // 使用授权码交换访问令牌和 ID 令牌
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', qs.stringify({
      code: code, // 从回调 URL 中提取的授权码
      client_id: process.env.GOOGLE_CLIENT_ID, // 从环境变量中获取客户端 ID
      client_secret: process.env.GOOGLE_CLIENT_SECRET, // 从环境变量中获取客户端密钥
      redirect_uri: 'http://localhost:8001/callback', // 确保与前端指定的回调 URL 一致
      grant_type: 'authorization_code'
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });
    const tokenData = tokenResponse.data;
    const { access_token, id_token } = tokenData;

    // 验证 id_token 并获取用户信息
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID, // 验证 id_token 的客户端 ID
    });
    const payload = ticket.getPayload(); // 提取用户信息
    // 检查用户是否已经存在
    let user = await User.findOne({ googleId: payload.sub });
    if (!user) {
      // 创建新用户
      user = new User({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        avatar: payload.picture // 存储用户的头像 URL
      });
      await user.save();
    }

    // 使用 access_token 获取更多的用户信息（如果需要）
    const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    const userInfo = userInfoResponse.data;

    const token = generateToken(user._id, user.email);

    // 返回用户信息
    res.status(201).json({
        token: token,
        message: 'login success',
        info: {
          id: user._id,
          email: user.email,
          category: user.category,
          tag: user.tag,
        },
        userInfo
      });
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    res.status(500).send('Authentication failed');
  }
};
