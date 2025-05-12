// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';

// import connectDB from './config/db.js';
// import { connectRedis } from './config/redis.js';
// import mqttClient from './config/mqtt.js';
// import taskRoutes from './taskRoutes.js';


// dotenv.config();


// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());


// app.use('/', taskRoutes);


// connectDB();       
// connectRedis();     

// // Start server
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import { connectRedis } from './config/redis.js';
import taskRoutes from './taskRoutes.js';

dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());
app.use(cookieParser());  

app.use('/', taskRoutes);
app.get("/", (req, res) => res.send("Welcome to Kazam Backend"));
connectDB();       
connectRedis();     

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
