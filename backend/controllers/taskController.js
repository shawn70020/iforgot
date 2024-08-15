const mongoose = require('mongoose');
const Task = require('../models/taskModel'); // 假設 task 模型在 models 文件夾下
const User = require('../models/userModel'); // 假設 user 模型在 models 文件夾下

// 新增任務函數
const createTask = async (req, res) => {
    const { name, category, reminderTime, tags, description, subtasks, position } = req.body;

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
            position: position || { position: 0 }
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
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        let userId = req?.user?.id
        // // 檢查使用者是否存在
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const tasksList = await Task.find({ userId, createdAt: { $gte: startOfToday, $lte: endOfToday } })
            .sort({ pinned: -1, checked: 1, createdAt: -1 }) // 先按 pinned 排序，再按 checked 排序，最後按 createdAt 排序
            .exec();
        // 回傳任務列表
        res.status(201).json(tasksList);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 獲取任務列表函數
const getTaskWeekList = async (req, res) => {
    try {
        let userId = req?.user?.id
        // // 檢查使用者是否存在
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const minPosition = 0;
        const maxPosition = 6;

        const tasksGroupedByPosition = await Task.aggregate([
            {
                $match: {
                    userId: userId,
                    'position.position': { $gte: minPosition, $lte: maxPosition }, // 过滤 position 在 0 到 6 之间的任务
                }
            },
            {
                $group: {
                    _id: "$position.position",
                    tasks: { $push: "$$ROOT" }, // 将整个文档推入 tasks 数组
                    categories: { $addToSet: "$category" }, // 将所有出现过的 category 存入 categories 数组
                    tags: { $push: "$tags" } // 将所有出现过的 tags 存入 tags 数组
                }
            },
            {
                $sort: { _id: 1 } // 按 position.position 升序排序
            }
        ]);

        // 初始化一个包含所有位置的空结果集
        const initializedPositions = Array.from({ length: maxPosition - minPosition + 1 }, (_, i) => ({
            position: minPosition + i,
            tasks: [],
        }));

        // 合并聚合结果到初始化的结果集中，并对任务进行排序
        tasksGroupedByPosition.forEach(group => {
            const index = group._id - minPosition;
            initializedPositions[index] = {
                position: group._id,
                tasks: group.tasks.sort((a, b) => {
                    if (a.checked === b.checked) {
                        return new Date(b.createdAt) - new Date(a.createdAt); // createdAt 降序排序
                    }
                    return a.checked ? 1 : -1; // checked 为 true 的放在最后
                }),
            };
        });

        // 提取 categories 和 tags
        const categories = Array.from(new Set(tasksGroupedByPosition.flatMap(group => group.categories)));
        const tags = tasksGroupedByPosition.reduce((acc, group) => {
            group.tags.flat().forEach(tag => {
                if (!acc.some(existingTag => existingTag.name === tag.name && existingTag.color === tag.color)) {
                    acc.push(tag);
                }
            });
            return acc;
        }, []);

        const result = {
            tasksGroupedByPosition: initializedPositions,
            categories,
            tags,
        };

        res.json(result);


    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// 獲取任務列表函數
const getTaskWeekListFilter = async (req, res) => {
    try {
        let userId = req?.user?.id
        // // 檢查使用者是否存在
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { categories, tags, checked } = req.body;
        const minPosition = 0;
        const maxPosition = 6;

        // 構建過濾對象
        const filterObj = {
            userId: userId,
            'position.position': { $gte: minPosition, $lte: maxPosition }
        };

        const matchConditions = [];

        // 添加categories過濾條件
        if (categories && categories.length > 0) {
            matchConditions.push({ category: { $in: categories } });
        }

        // 添加tags過濾條件
        if (tags && tags.length > 0) {
            matchConditions.push({ 'tags.name': { $in: tags } });
        }

        // 添加checked過濾條件
        if (checked && checked.length > 0) {
            matchConditions.push({ checked: { $in: checked } });
        }

        if (matchConditions.length > 0) {
            filterObj.$and = matchConditions;
        }

        const tasksGroupedByPosition = await Task.aggregate([
            {
                $match: filterObj
            },
            {
                $group: {
                    _id: "$position.position",
                    tasks: { $push: "$$ROOT" } // 將整個文檔推入 tasks 數組
                }
            },
            {
                $sort: { _id: 1 } // 按 position.position 升序排序
            }
        ]);

        // 初始化一個包含所有位置的空結果集
        const initializedPositions = Array.from({ length: maxPosition - minPosition + 1 }, (_, i) => ({
            position: minPosition + i,
            tasks: [],
        }));

        // 合併聚合結果到初始化的結果集中
        tasksGroupedByPosition.forEach(group => {
            const index = group._id - minPosition;
            initializedPositions[index] = {
                position: group._id,
                tasks: group.tasks,
            };
        });

        const result = {
            tasksGroupedByPosition: initializedPositions,
        };



        console.log(result);

        res.json(result)
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// 完成特定任務
const checkTaskItem = async (req, res) => {

    try {
        let userId = req?.user?.id
        // // 檢查使用者是否存在
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { taskId } = req.body;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { checked: !task.checked },
            { new: true } // 返回更新後的文檔
        );
        // 回傳任務列表
        res.status(201).json(updatedTask);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 釘選特定任務
const pinTaskItem = async (req, res) => {

    try {
        let userId = req?.user?.id
        // // 檢查使用者是否存在
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { taskId } = req.body;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { pinned: !task.pinned },
            { new: true } // 返回更新後的文檔
        );
        // 回傳任務列表
        res.status(201).json(updatedTask);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 刪除特定任務
const deleteTaskItem = async (req, res) => {

    try {
        let userId = req?.user?.id
        // // 檢查使用者是否存在
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { taskId } = req.body;

        const deletedTask = await Task.findByIdAndDelete(taskId);
        // 回傳任務列表
        res.status(201).json(deletedTask);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 刪除使用者所有已完成任務
const deleteCheckedTask = async (req, res) => {

    try {
        let userId = req?.user?.id
        // // 檢查使用者是否存在
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const deletedTasks = await Task.deleteMany({ userId: userId, checked: true });
        console.log(222222)
        if (deletedTasks.deletedCount === 0) {
            return res.status(404).json({ message: 'No checked tasks found for user' });
        }
        // 回傳任務列表
        res.status(201).json(deletedTasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 添加任務備註
const addTaskNote = async (req, res) => {
    try {
        let userId = req?.user?.id
        // // 檢查使用者是否存在
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const taskId = req.params.taskId;
        const { note } = req.body;
        if (!note) {
            return res.status(400).json({ message: 'note is required' });
        }


        // 更新任务的 description 字段
        const taskNote = await Task.findByIdAndUpdate(
            taskId,
            { $set: { description: note } },
            { new: true, useFindAndModify: false }
        );

        res.json(taskNote);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }

}

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

// 修改任務分類
const editTaskCategory = async (req, res) => {
    try {
        let userId = req?.user?.id
        // // 檢查使用者是否存在
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const taskId = req.params.taskId;
        const { selectedCategory } = req.body;

        if (!selectedCategory) {
            return res.status(400).json({ message: 'category is required' });
        }
        const task = await Task.findByIdAndUpdate(
            taskId,
            { $set: { category: selectedCategory } },
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

// 添加任務標籤
const editTaskTag = async (req, res) => {
    try {
        let userId = req?.user?.id
        // // 檢查使用者是否存在
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const taskId = req.params.taskId;

        const { selectedTag } = req.body;
        if (!selectedTag) {
            return res.status(400).json({ message: 'selectedTag is required' });
        }

        const task = await Task.findByIdAndUpdate(
            taskId,
            { $set: { tags: selectedTag } },
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

// 獲取使用者所有任務
const getAllTask = async (req, res) => {
    try {
        let userId = req?.user?.id
        // // 檢查使用者是否存在
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const tasksGroupedByCustomPosition = await Task.aggregate([
            {
                $match: {
                    userId: userId, // 過濾 userId
                    'position.position': { $exists: true, $ne: null } // 確保 position 存在且不為 null
                }
            },
            {
                $addFields: {
                    customPosition: {
                        $cond: [
                            { $eq: ['$position.position', 0] },
                            'today',
                            { $cond: [{ $eq: ['$position.position', 1] }, 'tomorrow', 'future'] }
                        ]
                    }
                }
            },
            {
                $sort: { createdAt: -1 } // 按创建时间从新到旧排序
            },
            {
                $group: {
                    _id: "$customPosition",
                    tasks: { $push: "$$ROOT" } // 将整个文档推入 tasks 数组
                }
            },
            {
                $project: {
                    _id: 1,
                    tasks: {
                        $filter: {
                            input: {
                                $sortArray: {
                                    input: "$tasks",
                                    sortBy: { checked: 1, createdAt: -1 } // 按 checked 升序（false 在前，true 在后）和 createdAt 降序排序
                                }
                            },
                            as: "task",
                            cond: { $eq: [true, true] } // 保持所有任务
                        }
                    }
                }
            },
            {
                $sort: { _id: 1 } // 按 _id 升序排序
            }
        ]);

        // 初始化包含所有位置的空结果集
        const initializedPositions = {
            today: [],
            tomorrow: [],
            future: [],
        };

        // 合并聚合结果到初始化的结果集中
        tasksGroupedByCustomPosition.forEach(group => {
            initializedPositions[group._id] = group.tasks;
        });

        // 統計所有出現過的 categories 和 tags
        const allCategories = new Set();
        const allTags = new Set();

        tasksGroupedByCustomPosition.forEach(group => {
            group.tasks.forEach(task => {
                if (task.category) {
                    allCategories.add(task.category);
                }
                if (task.tags) {
                    task.tags.forEach(tag => {
                        if (tag.name && tag.color) {
                            allTags.add(JSON.stringify(tag));
                        }
                    });
                }
            });
        });

        // 將 Set 轉換為 Array 並解析 JSON
        const uniqueCategories = Array.from(allCategories);
        const uniqueTags = Array.from(allTags).map(tag => JSON.parse(tag));

        const result = {
            tasksGroupedByPosition: initializedPositions,
            categories: uniqueCategories,
            tags: uniqueTags
        };

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

// 獲取使用者類別任務
const getSpecCategoryTask = async (req, res) => {
    try {
        let userId = req?.user?.id
        // // 檢查使用者是否存在
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const categoryId = req.query.category;

        const tasks = await Task.aggregate([
            { $match: { userId, category: categoryId } },
            {
                $addFields: {
                    sortChecked: { $cond: { if: "$checked", then: 1, else: 0 } }
                }
            },
            { $sort: { sortChecked: 1, createdAt: -1 } }
        ]);



        console.log(tasks);

        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

// 獲取使用者類別任務
const getSpecTagTask = async (req, res) => {
    try {

        let userId = req?.user?.id
        const user = await User.findById(userId).select('category');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const tag = req.query.tag;
        const categories = user.category;

        // 初始化结果对象
        const result = {};
        categories.forEach(category => {
            result[category] = [];
        });

        // 查找符合条件的任务
        const tasks = await Task.find({
            userId,
            tags: { $elemMatch: { name: tag } }
        });

        tasks.forEach(task => {
            if (result[task.category]) {
                result[task.category].push(task);
            }
        });

        for (const category in result) {
            result[category] = result[category].sort((a, b) => a.checked - b.checked);
        }


        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { createTask, getTaskList, checkTaskItem, pinTaskItem, deleteTaskItem, addSubTask, addTaskNote, editTaskCategory, editTaskTag, getTaskWeekList, getTaskWeekListFilter, deleteCheckedTask, getAllTask, getSpecCategoryTask, getSpecTagTask };