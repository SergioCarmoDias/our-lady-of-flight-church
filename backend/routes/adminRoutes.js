const express = require('express');
const router = express.Router();

// AboutPage
const { getHistoryImage, uploadImage, deleteImage } = require('../controllers/adminController');
const { upload } = require('../config/cloudinary');
const { getHistoryContent, updateHistoryContent } = require('../controllers/adminController');
const { getMassTimings, updateMassTiming } = require('../controllers/adminController');
const { getNotice, updateNotice } = require('../controllers/noticeController');
// const verifyAdmin = require('../middleware/authMiddleware'); // assuming you have a token verification middleware

// GET /api/admin/history-image (Public so normal visitors can see the image too)
router.get('/history-image', getHistoryImage);

// POST /api/admin/upload
router.post('/upload', upload.single('image'), uploadImage);

// DELETE /api/admin/image/:section
router.delete('/image/:section', deleteImage);

router.get('/history-content', getHistoryContent);

router.put('/history-content', /* verifyAdmin, */ updateHistoryContent);

// Services
router.get('/mass-timings', getMassTimings);

router.put('/mass-timings/:id', /* verifyAdmin, */ updateMassTiming);

// Notice
router.get('/notice', getNotice);

router.put('/notice', /* verifyAdmin, */ updateNotice);

module.exports = router;