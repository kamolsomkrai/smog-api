// app.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MySQLStore = require('connect-mysql2')(session);
const morgan = require('morgan');
const winston = require('winston');
const { authenticateTokenFromHeader, authenticateTokenFromCookies } = require('./middlewares/authenticateToken');
const { externalApiLimiter } = require('./middlewares/rateLimiter');

const authRoutes = require('./routes/authRoutes');
const suppliesRoutes = require('./routes/suppliesRoutes');
const smogInportRoutes = require('./routes/smogImportRoutes');

dotenv.config();

const app = express();

// Logger setup
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'supplies-service' },
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// CORS Configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
}));

// Session Store
const pool = require('./config/db');
const sessionStore = new MySQLStore({}, pool);

// Session Middleware for Frontend
app.use(session({
    key: 'session_cookie_name',
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 1 วัน
    }
}));

// Routes
app.use('/api', authRoutes);
app.use('/api/supplies', suppliesRoutes);
app.use('/api/smog_inport', externalApiLimiter, smogInportRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'API is running.' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({ message: 'Internal server error.' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Express API running on port ${PORT}`);
});
