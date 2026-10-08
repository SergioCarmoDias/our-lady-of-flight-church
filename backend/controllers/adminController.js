const AboutContent = require('../models/AboutContent');

// Get saved image URL from MongoDB
const getHistoryImage = async (req, res) => {
    try {
        const record = await AboutContent.findOne({ section: 'history-image' });
        res.status(200).json({ imageUrl: record ? record.content : '' });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching image.' });
    }
};

// Upload image and save Cloudinary URL to MongoDB
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided.' });
        }

        const imageUrl = req.file.path; // Cloudinary secure URL

        // Save or update in MongoDB
        await AboutContent.findOneAndUpdate(
            { section: 'history-image' },
            { content: imageUrl },
            { new: true, upsert: true }
        );

        res.status(200).json({
            message: 'Image uploaded successfully',
            imageUrl: imageUrl
        });
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        res.status(500).json({ message: 'Server error during image upload.' });
    }
};

// Clear image URL in MongoDB on delete
const deleteImage = async (req, res) => {
    try {
        await AboutContent.findOneAndUpdate(
            { section: 'history-image' },
            { content: '' },
            { upsert: true }
        );
        res.status(200).json({ message: 'Image removed successfully.' });
    } catch (error) {
        console.error('Image Removal Error:', error);
        res.status(500).json({ message: 'Server error during image removal.' });
    }
};

// Get history content
const getHistoryContent = async (req, res) => {
    try {
        let record = await AboutContent.findOne({ section: 'history-main' });
        if (!record) {
            // Default initial text if none exists yet
            record = { content: "The history of Our Lady of Flight Church is deeply intertwined with the spiritual legacy of our community..." };
        }
        res.status(200).json({ content: record.content });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching history content.' });
    }
};

// Save/Update history content
const updateHistoryContent = async (req, res) => {
    try {
        const { content } = req.body;
        const updatedRecord = await AboutContent.findOneAndUpdate(
            { section: 'history-main' },
            { content },
            { new: true, upsert: true } // Creates it if it doesn't exist
        );
        res.status(200).json({ message: 'Content updated successfully', content: updatedRecord.content });
    } catch (error) {
        res.status(500).json({ message: 'Error updating history content.' });
    }
};

// Services Edit
const MassTiming = require('../models/MassTimings');

// Get all mass timings
const getMassTimings = async (req, res) => {
    try {
        let timings = await MassTiming.find().sort({ _id: 1 });
        
        // Auto-seed default static rows if the collection is empty
        if (timings.length === 0) {
            const defaultRows = [
                { day: 'Sunday', date: 'Sep 06, 2026', time: '7:30 AM', title: '1st Mass', organizer: 'Sector 1', tag: 'Thanksgiving' },
                { day: 'Sunday', date: 'Sep 06, 2026', time: '9:30 AM', title: '2nd Mass', organizer: 'Sector 2', tag: '' },
                { day: 'Monday', date: 'Sep 07, 2026', time: '7:00 AM', title: 'Daily Mass', organizer: 'Catechist', tag: 'For the souls' },
                { day: 'Tuesday', date: 'Sep 08, 2026', time: '7:00 AM', title: 'Daily Mass', organizer: 'Sector 4', tag: '' },
                { day: 'Wednesday', date: 'Sep 09, 2026', time: '7:00 AM', title: 'Daily Mass', organizer: 'Sector 5', tag: '' },
                { day: 'Thursday', date: 'Sep 10, 2026', time: '7:00 AM', title: 'Daily Mass', organizer: 'Sector 6', tag: '' },
                { day: 'Friday', date: 'Sep 11, 2026', time: '7:00 AM', title: 'Daily Mass', organizer: 'Sector 7', tag: '' },
                { day: 'Saturday', date: 'Sep 12, 2026', time: '7:00 AM', title: 'No Mass', organizer: 'None', tag: '' }
            ];
            timings = await MassTiming.insertMany(defaultRows);
        }
        
        res.status(200).json(timings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching mass timings.' });
    }
};

// Update a specific mass timing entry
const updateMassTiming = async (req, res) => {
    try {
        const { id } = req.params;
        const { day, time, title, organizer, tag } = req.body;
        
        const updated = await MassTiming.findByIdAndUpdate(
            id,
            { day, time, title, organizer, tag },
            { new: true }
        );
        res.status(200).json({ message: 'Mass timing updated successfully', updated });
    } catch (error) {
        res.status(500).json({ message: 'Error updating mass timing.' });
    }
};

module.exports = { getHistoryImage, uploadImage, deleteImage, getHistoryContent, updateHistoryContent, getMassTimings, updateMassTiming };