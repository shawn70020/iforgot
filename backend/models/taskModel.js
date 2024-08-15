const mongoose = require('mongoose');

// 定義子任務的 Schema
const subtaskSchema = mongoose.Schema(
  {
    name: { type: String, required: true }, // 子任務名稱
    completed: { type: Boolean, default: false }, // 子任務是否完成
  },
  { _id: true } // 默认生成 _id 字段
);

// 定義附件的 Schema
const attachmentSchema = mongoose.Schema(
  {
    filename: { type: String, required: true }, // 附件檔名
    url: { type: String, required: true }, // 附件 URL
  },
);

// 定義任務的 Schema
const taskSchema = mongoose.Schema(
  {
    // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 關聯的使用者 ID
    userId: { type: String, required: true },
    name: { type: String, required: true }, // 任務名稱
    category: { type: String, required: true }, // 任務分類
    reminderTime: { type: Date }, // 提醒時間
    tags: { type: [Object], default: [] }, // 標籤（重要程度等）
    description: { type: String }, // 任務敘述
    checked: { type: Boolean, default: false }, // 是否完成
    pinned: { type: Boolean, default: false }, // 是否釘選
    subtasks: { type: [subtaskSchema], default: [] }, // 子任務列表
    position: { type: Object, default: { position: 0 } } // 任務位置
  },
  {
    timestamps: true, // 自動生成 createdAt 和 updatedAt 字段
  }
);

// 創建任務模型
const Task = mongoose.model('Task', taskSchema);

// 導出任務模型
module.exports = Task;
