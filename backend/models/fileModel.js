const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    contentType: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    userId: {
      type: String,
      required: true // 确保每个文件都与一个用户相关联
    },
    taskId: {
      type: String,
      required: true // 确保每个文件都与一个用户相关联
    }
  },
  {
    timestamps: true, // 自动生成 createdAt 和 updatedAt 字段
  }
);

// 创建文件模型
const File = mongoose.model('File', fileSchema);
module.exports = File;
