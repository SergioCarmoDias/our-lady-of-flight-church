const Content = require('../models/AboutContent');

// Get all dynamic content (for viewers)
exports.getContent = async (req, res, next) => {
    try {
        const content = await Content.find();
        res.json(content);
    } catch (error) {
        next(error);
    }
};

// Update or create content (for admins)
exports.updateContent = async (req, res, next) => {
    try {
        const { sectionKey, title, body } = req.body;
        const updatedContent = await Content.findOneAndUpdate(
            { sectionKey },
            { title, body },
            { new: true, upsert: true } // Creates it if it doesn't exist yet
        );
        res.json({ message: 'Content updated successfully', updatedContent });
    } catch (error) {
        next(error);
    }
};