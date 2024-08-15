const jwt = require('jsonwebtoken'); // 引入 jsonwebtoken 庫

const auth = (req, res, next) => {

    // 豁免特定路由
    if (req.path === '/api//users/register' || req.path === '/api/users/login' || req.path === '/api/users/check-email' || req.path === '/auth/callback') {
        return next();
    }
    const token = req.header('Authorization').replace('Bearer ', ''); // 從請求頭中提取 token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' }); // 如果沒有 token，返回 401 錯誤
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // 驗證 token 並解碼
        req.user = decoded; // 將解碼後的用戶信息存入 req.user
        next(); // 調用 next() 繼續後續中間件或路由處理
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' }); // 如果 token 無效，返回 401 錯誤
    }
};

module.exports = auth; // 將中間件導出以供其他模塊使用
