import dotenv from 'dotenv';
dotenv.config();

import { createClient } from 'redis';

const redisClient = createClient({ url: process.env.REDIS_URL });

redisClient.on('connect', () => {
  console.log('Redis connected');
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error('Redis connection failed:', err.message);
  }
};

export default redisClient;
