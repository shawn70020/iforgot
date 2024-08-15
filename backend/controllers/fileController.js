const AWS = require('aws-sdk');
const User = require('../models/userModel');
const File = require('../models/fileModel');
// 配置 AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();
const saveFileInfo = async (req, res) => {
  const { filename, url, contentType, size,  taskId} = req.body;
  const userId = req?.user?.id
  const file = new File({
    userId,
    filename,
    url,
    contentType,
    size,
    taskId
  });

  try {
    await file.save();
    res.json({ message: 'File info saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save file info' });
  }
};

const getFileList = async (req, res) => {
  try {
    const userId = req?.user?.id;
    const { taskId } = req.query; // 获取查询参数中的 taskId


    // 检查使用者是否存在
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 检查 taskId 是否存在
    if (!taskId) {
      return res.status(400).json({ message: 'TaskId is required' });
    }

    const files = await File.find({ userId, taskId }); // 通过 userId 和 taskId 过滤文件

    res.json(files);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const deleteFile = async (req, res) => {
  const fileId = req.params.id;
  let userId = req?.user?.id
  try {
    const file = await File.findOne({ _id: fileId, userId });

    if (file) {
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: file.filename,
      };

      // 清除aws資料
      await s3.deleteObject(params).promise();
      // 清除mongodb資料
      await File.deleteOne({ _id: fileId });

      res.json({ message: 'File deleted successfully' });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete file' });
  }
};

module.exports = {
  saveFileInfo,
  getFileList,
  deleteFile
};
