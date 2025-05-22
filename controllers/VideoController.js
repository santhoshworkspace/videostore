import mongoose from 'mongoose';
import { GridFsStorage } from 'multer-gridfs-storage';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Setup GridFS storage
const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    file: (req, file) => {
        return {
            filename: `${Date.now()}-${file.originalname}`,
            bucketName: 'videos'
        };
    }
});

export const upload = multer({ storage });

export const uploadVideo = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    res.status(200).json({
        message: 'Video uploaded successfully',
        file: {
            filename: req.file.filename,
            id: req.file.id,
            contentType: req.file.contentType
        }
    });
};


export const getVideo = async (req, res) => {
  try {
    const conn = mongoose.connection;
    const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
      bucketName: 'videos'
    });

    const { filename } = req.params;

    // Check if file exists
    const files = await conn.db.collection('videos.files').find({ filename }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const file = files[0];

    // Set the headers
    res.set({
      'Content-Type': file.contentType,
      'Content-Disposition': `inline; filename="${file.filename}"`
    });

    // Stream the video
    const downloadStream = bucket.openDownloadStreamByName(filename);
    downloadStream.pipe(res);

    downloadStream.on('error', (err) => {
      console.error('Stream error:', err);
      res.status(500).json({ error: 'Error streaming video' });
    });
  } catch (error) {
    console.error('Error retrieving video:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
