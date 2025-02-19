// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByUsername } = require('../models/userModel');
const { supplySchema } = require('../validation/authValidation');

const register = async (req, res) => {
    const { username, password, hospcode, hospname } = req.body;

    if (!username || !password || !hospcode || !hospname) {
        return res.status(400).json({ message: 'Username, password, hospcode และ hospname จำเป็นต้องมี.' });
    }

    try {
        const existingUser = await findUserByUsername(username);
        if (existingUser) {
            return res.status(409).json({ message: 'Username already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = await createUser(username, hashedPassword, hospcode, hospname);
        res.status(201).json({ message: 'User registered successfully.', userId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username และ password จำเป็นต้องมี.' });
    }

    try {
        const user = await findUserByUsername(username);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // สร้าง JWT Token
        const token = jwt.sign(
            { id: user.id, hospcode: user.hospcode, hospname: user.hospname },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
        );

        // ตั้งค่า token ใน HTTP-Only Cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 1 วัน
        });

        res.json({ message: 'Login successful.', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

const getToken = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username และ password จำเป็นต้องมี.' });
    }

    try {
        const user = await findUserByUsername(username);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign(
            { id: user.id, hospcode: user.hospcode, hospname: user.hospname },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
        );

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

const logout = async (req, res) => {
    try {
        req.session.destroy(err => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Internal server error.' });
            }

            res.clearCookie('session_cookie_name');
            res.clearCookie('token');
            res.json({ message: 'Logout successful.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

const getUser = async (req, res) => {
    const { id, hospcode, hospname } = req.user;
    res.json({ id, hospcode, hospname });
};

module.exports = {
    register,
    login,
    getToken,
    logout,
    getUser
};
