const Notice = require('../models/Notice');

const getNotice = async (req, res) => {
    try {
        let notice = await Notice.findOne();
        if (!notice) {
            notice = await Notice.create({ content: 'Welcome to our parish! Check back here for regular announcements and updates.' });
        }
        res.status(200).json(notice);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notice.' });
    }
};

const updateNotice = async (req, res) => {
    try {
        let notice = await Notice.findOne();
        if (!notice) {
            notice = new Notice({ content: req.body.content });
        } else {
            notice.content = req.body.content;
        }
        await notice.save();
        res.status(200).json({ message: 'Notice updated successfully', notice });
    } catch (error) {
        res.status(500).json({ message: 'Error updating notice.' });
    }
};

module.exports = { getNotice, updateNotice };