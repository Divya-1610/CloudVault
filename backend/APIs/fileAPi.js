import express from 'express';
import multer from 'multer';
import path from 'path';
import cloudinary from '../config/cloudinary.js';
import { FileModel } from '../models/FileModel.js';

export const fileApp = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST Upload
fileApp.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const { userId } = req.body;
        if (!req.file) return res.status(400).json({ message: ["No file attached"] });
        if (!userId) return res.status(400).json({ message: ["User ID context is missing"] });

        const detectedExtension = path.extname(req.file.originalname).substring(1).toLowerCase();
        const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

        const cloudResult = await cloudinary.uploader.upload(fileBase64, {
            folder: 'gdrive_clone_files',
            resource_type: 'auto' 
        });

        const newFile = new FileModel({
            filename: req.file.originalname, 
            filetype: detectedExtension,
            fileUrl: cloudResult.secure_url,
            cloudinaryId: cloudResult.public_id,
            size: cloudResult.bytes,
            user: userId 
        });

        await newFile.save();
        return res.status(201).json({ message: "File uploaded successfully!", payload: newFile });
    } catch (err) {
        return res.status(500).json({ message: [err.message] });
    }
});

// GET List
fileApp.get('/list/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const userFiles = await FileModel.find({ user: userId }).sort({ createdAt: -1 });
        return res.status(200).json({ payload: userFiles });
    } catch (err) {
        return res.status(500).json({ message: [err.message] });
    }
});

// DELETE File
fileApp.delete('/delete/:id', async (req, res) => {
    try {
        const { publicId } = req.body; 
        if (publicId) await cloudinary.uploader.destroy(publicId);
        await FileModel.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "File permanently deleted." });
    } catch (err) {
        return res.status(500).json({ message: [err.message] });
    }
});
