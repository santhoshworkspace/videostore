import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import videoRoutes from './routes/videoRoutes.js';
import connectDB from './config/db.js';

dotenv.config();
const app = express();

// Connect to DB
connectDB();

app.use(express.json());
app.use('/api/videos', videoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
