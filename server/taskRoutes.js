import express from 'express';
import { fetchAllTasks, addTaskManually } from './taskController.js';

const router = express.Router();

router.get('/fetchAllTasks', fetchAllTasks);
router.post('/addTask', addTaskManually);

export default router;
