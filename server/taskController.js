import Task from './taskModel.js';
import redisClient from './config/redis.js';

export const fetchAllTasks = async (req, res) => {
  try {
    const key = `FULLSTACK_TASK_Tauseef`;

    const cacheData = await redisClient.get(key);
    const redisTasks = cacheData ? JSON.parse(cacheData) : [];

    const mongoTasks = await Task.find({});
    const allTasks = [...redisTasks, ...mongoTasks.map((task) => task.title)];

    res.status(200).json({ success: true, tasks: allTasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const addTaskManually = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Title required' });

    // Get tasks from cookies
    const tasks = req.cookies.tasks ? JSON.parse(req.cookies.tasks) : [];

    tasks.push(title);

    if (tasks.length >= 50) {
      const taskDocs = tasks.map((t) => ({ title: t }));
      await Task.insertMany(taskDocs);

      res.clearCookie('tasks');
      await redisClient.set(`FULLSTACK_TASK_Tauseef`, JSON.stringify([])); 
      console.log('Moved tasks to MongoDB');
    } else {
      // Store tasks back in cookies
      res.cookie('tasks', JSON.stringify(tasks), { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });  // 1 day expiration
    }

    res.status(201).json({ success: true, message: 'Task added' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
