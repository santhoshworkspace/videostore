import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
    filename: String,
    contentType: String,
    uploadDate: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Video', videoSchema);
