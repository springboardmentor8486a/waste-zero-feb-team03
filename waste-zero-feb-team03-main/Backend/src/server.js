import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';

import connectDB from './config/db.js';
import { initSocket } from './socket/socketServer.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import opportunityRoutes from './routes/opportunityRoutes.js';

import matchRoutes from './routes/matchRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

import { errorHandler } from './middleware/errorHandler.js';


dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
initSocket(server);

app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/opportunities', opportunityRoutes);

app.use('/matches', matchRoutes);
app.use('/messages', messageRoutes);
app.use('/notifications', notificationRoutes);

app.get('/', (req, res) => res.send('Backend is running...'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));