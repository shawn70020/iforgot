const cron = require('node-cron');
const Task = require('../models/taskModel'); // 确保路径正确
const mongoose = require('mongoose');

async function cleanUpTasks() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 将当前时间设为当天的00:00:00

    // 计算十天前的日期
    const tenDaysAgo = new Date(today);
    tenDaysAgo.setDate(today.getDate() - 10);

    // 删除所有 position.date 小于十天前的任务
    await Task.deleteMany({ 'position.date': { $lt: tenDaysAgo } });

    // 获取所有任务
    const tasks = await Task.find();

    // 更新任务的 position
    const bulkOps = tasks.map(task => {
      const taskDate = new Date(task.position.date);
      taskDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((taskDate - today) / (1000 * 60 * 60 * 24));
      let newPosition = 0;

      if (diffDays <= 0) {
        newPosition = 0;
      } else {
        newPosition = diffDays;
      }

      return {
        updateOne: {
          filter: { _id: task._id },
          update: { 'position.position': newPosition }
        }
      };
    });

    // 批量更新任务
    if (bulkOps.length > 0) {
      await Task.bulkWrite(bulkOps);
    }

    console.log('任务整理完成');
  } catch (error) {
    console.error('任务整理出错:', error);
  }
}

function scheduleDailyTask() {
  // 设置每天执行一次的定时任务
  cron.schedule('0 0 * * *', () => {
    console.log('Running daily cleanup task');
    cleanUpTasks();
  });
}

module.exports = { scheduleDailyTask };
