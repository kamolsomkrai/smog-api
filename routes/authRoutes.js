// routes/authRoutes.js
const express = require('express');
const { register, login, getToken, logout, getUser } = require('../controllers/authController');
const router = express.Router();

// Route สำหรับ register
router.post('/register', register);

// Route สำหรับ login
router.post('/login', login);

// Route สำหรับ get token (สำหรับ external scripts)
router.post('/gettoken', getToken);

// Route สำหรับ logout
router.post('/logout', logout);

// Route สำหรับ get user info
router.get('/user', getUser);

module.exports = router;
