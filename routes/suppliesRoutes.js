// routes/suppliesRoutes.js
const express = require('express');
const {
    getAllSupplies,
    getSupply,
    createNewSupply,
    updateExistingSupply,
    deleteExistingSupply
} = require('../controllers/suppliesController');
const { supplySchema } = require('../validation/suppliesValidation');
const { validateBody } = require('../middlewares/validateBody');

const router = express.Router();

// GET /api/supplies - ดึงรายการ supplies ทั้งหมด
router.get('/', getAllSupplies);

// GET /api/supplies/:id - ดึงรายละเอียดของ supply
router.get('/:id', getSupply);

// POST /api/supplies - สร้าง supply ใหม่
router.post('/', validateBody(supplySchema), createNewSupply);

// PUT /api/supplies/:id - แก้ไข supply ที่ระบุ
router.put('/:id', validateBody(supplySchema), updateExistingSupply);

// DELETE /api/supplies/:id - ลบ supply ที่ระบุ
router.delete('/:id', deleteExistingSupply);

module.exports = router;
