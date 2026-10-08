const mongoose = require('mongoose');

const aboutContentSchema = new mongoose.Schema({
    section: { type: String, required: true, unique: true }, // e.g., 'history-main'
    content: { type: String, required: true }
});

module.exports = mongoose.model('AboutContent', aboutContentSchema);