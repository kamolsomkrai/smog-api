// models/SmogImportModel.js
const pool = require('../config/db');

const insertSmogImport = async (records) => {
    const sql = `
        INSERT INTO smog_import 
        (hospcode, pid, birth, sex, hn, seq, date_serv, diagtype, diagcode, clinic, provider, d_update, cid, appoint)
        VALUES ?
    `;
    await pool.query(sql, [records]);
};

const insertApiImport = async (hospcode, method, rec) => {
    const sql = `
        INSERT INTO api_imports (hospcode, method, rec)
        VALUES (?, ?, ?)
    `;
    await pool.query(sql, [hospcode, method, rec]);
};

const getSmogImportRecords = async (hospcode) => {
    const [rows] = await pool.query('SELECT * FROM smog_import WHERE hospcode = ?', [hospcode]);
    return rows;
};

module.exports = {
    insertSmogImport,
    insertApiImport,
    getSmogImportRecords
};
