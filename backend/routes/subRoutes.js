const express = require('express');
const router = express.Router();
const { createTask, getTaskList, deleteSubItem, addSubTask, checkTaskSubItem, editSubTask} = require('../controllers/subController'); // 假設 TaskController 在 controllers 文件夾下

// 新增任務路由
router.post('/add-task', createTask);

// 獲取使用者任務列表
router.post('/:taskId/list', getTaskList);



// 刪除特定任務
router.delete('/delete-task', deleteSubItem);

// 添加任務子項目
router.post('/:taskId/subtask', addSubTask)

// 完成任務子項目
router.post('/checked-sub', checkTaskSubItem)

// 編輯任務子項目
router.post('/edit-sub', editSubTask)

module.exports = router;
