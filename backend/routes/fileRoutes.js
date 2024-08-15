const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const { saveFileInfo, getFileList, deleteFile } = require('../controllers/fileController');


// 配置 AWS SDK
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

// 生成预签名 URL 的路由
router.get('/generate-presigned-url', (req, res) => {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${Date.now()}-${req.query.filename}`, // 生成文件名
        Expires: 60, // URL 有效期（秒）
        ContentType: req.query.contentType,
    };
    s3.getSignedUrl('putObject', params, (err, url) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ url });
    });
});

router.post('/save-info', saveFileInfo);
router.get('/lists', getFileList);
router.delete('/:id', deleteFile);

module.exports = router;
