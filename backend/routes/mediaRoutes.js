const Gallery = require('../models/Gallery');

// Get all media (for gallery page)
exports.getMedia = async (req, res, next) => {
    try {
        const media = await Gallery.find().sort({ createdAt: -1 });
        res.json(media);
    } catch (error) {
        next(error);
    }
};

// Upload multiple pictures or videos (for admins)
exports.uploadMultipleMedia = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const { title, category } = req.body;
        const savedMediaItems = [];

        // Loop through each uploaded file
        for (let file of req.files) {
            const mediaType = file.mimetype.startsWith('video') ? 'video' : 'image';

            const newMedia = new Gallery({
                title: title || 'Church Event', // Can share a common title or customize per file
                mediaUrl: file.path,
                mediaType,
                category: category || 'General'
            });

            await newMedia.save();
            savedMediaItems.push(newMedia);
        }

        res.status(201).json({ 
            message: `${savedMediaItems.length} files uploaded successfully`, 
            savedMediaItems 
        });
    } catch (error) {
        next(error);
    }
};