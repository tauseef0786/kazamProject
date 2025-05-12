import mqtt from 'mqtt';
import redisClient from './redis.js';
import Task from '../taskModel.js';

const mqttClient = mqtt.connect(process.env.MQTT_URL);

mqttClient.on('connect', () => {
  console.log('MQTT connected');
  mqttClient.subscribe('/add', (err) => {
    if (err) console.error('MQTT subscribe error:', err.message);
  });
});

mqttClient.on('message', async (topic, message) => {
  try {
    if (topic === '/add') {
      const newTask = message.toString().trim();
      const key = `FULLSTACK_TASK_Tauseef`;

      if (!newTask) {
        console.warn(' Empty task ignored');
        return;
      }

      const cacheData = await redisClient.get(key);
      let tasks = cacheData ? JSON.parse(cacheData) : [];

      tasks.push(newTask);

      if (tasks.length > 50) {
        const taskDocs = tasks.map((t) => ({ title: t }));
        await Task.insertMany(taskDocs);
        await redisClient.del(key); 
        console.log('Moved 50+ tasks from Redis to MongoDB');
      } else {
        await redisClient.set(key, JSON.stringify(tasks));
        console.log(`Task added to Redis (${tasks.length}/50): ${newTask}`);
      }
    }
  } catch (err) {
    console.error('MQTT message error:', err.message);
  }
});

export default mqttClient;
