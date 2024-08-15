const express = require('express');
const router = express.Router();
const { createTask, getTaskList, checkTaskItem , pinTaskItem, deleteTaskItem, addSubTask, addTaskNote, editTaskCategory, editTaskTag, getTaskWeekList, getTaskWeekListFilter,deleteCheckedTask, getAllTask, getSpecCategoryTask, getSpecTagTask} = require('../controllers/taskController'); // 假設 TaskController 在 controllers 文件夾下

// 新增任務路由
router.post('/add-task', createTask);

// 獲取使用者任務列表
router.get('/get-task', getTaskList);

// 更改已完成任務
router.post('/check-task', checkTaskItem);

// 釘選特定任務
router.post('/pin-task', pinTaskItem);

// 刪除特定任務
router.delete('/delete-task', deleteTaskItem);

// 添加任務子項目
router.post('/:taskId/subtask', addSubTask)

// 添加任務備註
router.post('/:taskId/note', addTaskNote)


// 修改任務分類
router.post('/:taskId/category', editTaskCategory)

// 添加任務標籤
router.post('/:taskId/tag', editTaskTag)

// 獲取使用者當周任務列表
router.get('/get-week-task', getTaskWeekList);

// 獲取使用者當周任務列表
router.post('/get-week-task-filter', getTaskWeekListFilter);


// 刪除使用者所有完成任務
router.delete('/delete-user-checked', deleteCheckedTask);

// 獲取使用者所有任務列表
router.get('/get-all-task', getAllTask);

// 獲取使用者所有任務列表
router.get('/get-category', getSpecCategoryTask);

// 獲取使用者所有任務列表
router.get('/get-tag', getSpecTagTask);

module.exports = router;
