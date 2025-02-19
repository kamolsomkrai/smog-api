// models/apiImportsModel.js
const pool = require('../config/db');

const createApiImport = async (hospcode, method, rec) => {
    const [result] = await pool.query(
        'INSERT INTO api_imports (hospcode, method, rec) VALUES (?, ?, ?)',
        [hospcode, method, rec]
    );
    return result.insertId;
};

const getApiImports = async () => {
    const [rows] = await pool.query('SELECT * FROM api_imports');
    return rows;
};

module.exports = {
    createApiImport,
    getApiImports
};
