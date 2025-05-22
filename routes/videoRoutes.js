import express from 'express';
import { upload, uploadVideo, getVideo } from '../controllers/videoController.js';

const router = express.Router();

// POST /api/videos/upload
router.post('/upload', upload.single('video'), uploadVideo);

// GET /api/videos/:filename
router.get('/:filename', getVideo);

export default router;
