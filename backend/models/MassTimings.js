const mongoose = require('mongoose');

const massTimingSchema = new mongoose.Schema({
    day: { 
        type: String, 
        required: true,
        enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    date: { type: String, required: true }, // e.g., "Sep 06, 2026"
    time: { 
        type: String, 
        required: true,
        match: [/^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i, 'Please fill a valid time format (HH:MM AM/PM)']
    },
    title: { 
        type: String, 
        required: true,
        enum: ['1st Mass', '2nd Mass', 'Sunday Anticipated English Mass', 'Daily Mass', 'Special Mass', 'No Mass']
    },
    organizer: { 
        type: String, 
        required: true,
        enum: [
            'Sector 1', 'Sector 2', 'Sector 3', 'Sector 4', 'Sector 5', 
            'Sector 6', 'Sector 7', 'Sector 8', 'Sector 9', 
            'Catechist', 'Catechism Children', 'None'
        ]
    },
    tag: { type: String, default: '' }
});

module.exports = mongoose.model('MassTiming', massTimingSchema);