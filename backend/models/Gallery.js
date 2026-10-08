const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    mediaUrl: { 
        type: String, 
        required: true 
    }, // Cloudinary URL
    mediaType: { 
        type: String, 
        enum: ['image', 'video'], 
        required: true 
    },
    category: { 
        type: String, 
        default: 'General' 
    } // e.g., 'Feast', 'Youth Day'
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);