// middlewares/rateLimiter.js
const rateLimit = require('express-rate-limit');

const externalApiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 นาที
    max: 100, // จำกัดที่ 100 คำขอในช่วงเวลา
    message: 'Too many requests from this IP, please try again later.'
});

module.exports = {
    externalApiLimiter
};
