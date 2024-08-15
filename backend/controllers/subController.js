const Task = require('../models/taskModel'); // 假設 task 模型在 models 文件夾下
const User = require('../models/userModel'); // 假設 user 模型在 models 文件夾下
const mongoose = require('mongoose');
// 新增任務函數
const createTask = async (req, res) => {
    const { name, category, reminderTime, tags, description, subtasks, attachments } = req.body;

    try {
        const userId = req?.user?.id
        // 檢查使用者是否存在
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // 創建新任務
        const newTask = new Task({
            userId: userId,
            name: name || null,
            category: category || null,
            reminderTime: reminderTime || null,
            tags: tags || [],
            description: description || '',
            subtasks: subtasks || [],
            attachments: attachments || []
        });


        // // 保存任務
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 獲取任務列表函數
const getTaskList = async (req, res) => {
    try {
        let userId = req?.user?.id
        // // 檢查使用者是否存在
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const taskId = req.params.taskId;
        const subTaskList = await Task.findOne({ _id: taskId, userId: userId }, 'subtasks'); // 只返回 subtasks 字段
        // 回傳任務列表
        res.status(201).json(subTaskList);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 完成特定任務
const checkTaskSubItem = async (req, res) => {
    try {
        let userId = req?.user?.id
        // // 檢查使用者是否存在
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { taskId, subId } = req.body;
        // 查找任务
        const task = await Task.findOne({ _id: taskId });
        if (!task) {
            console.log('Task not found');
            return;
        }

        // 查找子任务
        const subtask = task.subtasks.id(subId);
        if (!subtask) {
            console.log('Subtask not found');
            return;
        }

        // 切换子任务的 completed 状态
        subtask.completed = !subtask.completed;
        // 保存任务
        await task.save();
        // 回傳任務列表
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 更改子任務敘述
const editSubTask = async (req, res) => {
    try {
        let userId = req?.user?.id
        // // 檢查使用者是否存在
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { taskId, subId, name } = req.body;


        // 查找任务
        const task = await Task.findOne({ _id: taskId });
        if (!task) {
            console.log('Task not found');
            return;
        }

        // 查找子任务
        const subtask = task.subtasks.id(subId);
        if (!subtask) {
            console.log('Subtask not found');
            return;
        }

        // 切换子任务的 name 状态
        subtask.name = name;
        // 保存任务
        await task.save()

        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }

}

// 刪除特定任務
const deleteSubItem = async (req, res) => {

    try {
        let userId = req?.user?.id
        // // 檢查使用者是否存在
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { taskId, subId } = req.body;

        if (!taskId || !subId) {
            return res.status(400).json({ message: 'Task ID and Subtask ID are required' });
        }

        // 使用 $pull 操作符从 subtasks 数组中删除匹配的子任务
        const deletedTask = await Task.findByIdAndUpdate(
            taskId,
            { $pull: { subtasks: { _id: subId } } },
            { new: true, useFindAndModify: false }
        );

        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(deletedTask);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 添加任務子項目
const addSubTask = async (req, res) => {
    try {
        let userId = req?.user?.id
        // // 檢查使用者是否存在
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const taskId = req.params.taskId;
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Subtask name is required' });
        }

        const subtask = { name };

        const task = await Task.findByIdAndUpdate(
            taskId,
            { $push: { subtasks: subtask } },
            { new: true, useFindAndModify: false }
        );

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }

}
module.exports = { createTask, getTaskList, checkTaskSubItem, deleteSubItem, addSubTask, checkTaskSubItem, editSubTask };