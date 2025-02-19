// routes/smogImportRoutes.js
const express = require('express');
const { handleSmogImport, getSmogImportRecordsHandler } = require('../controllers/smogImportController');

const router = express.Router();

// POST /api/smog_inport - รับข้อมูล smog_inport
router.post('/', handleSmogImport);

// GET /api/smog_inport_records - ดึงข้อมูล smog_inport สำหรับ frontend
router.get('/records', getSmogImportRecordsHandler);

module.exports = router;
