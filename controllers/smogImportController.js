// controllers/SmogImportController.js
const zlib = require('zlib');
const {
    insertSmogImport,
    insertApiImport,
    getSmogImportRecords
} = require('./models/smogImportModel');
const { SmogImportSchema } = require('../validation/SmogImportValidation');
const Joi = require('joi');

const cleanDiagcode = (code) => {
    if (typeof code !== 'string') {
        return code;
    }
    let cleaned = code.trim();
    cleaned = cleaned.toUpperCase();
    cleaned = cleaned.replace(/[^A-Z0-9]/g, '');
    return cleaned;
};

const handleSmogImport = async (req, res) => {
    const compressedData = req.body.data;
    const method = req.body.method || 0;

    zlib.gunzip(Buffer.from(compressedData, 'base64'), async (err, decompressedData) => {
        if (err) {
            return res.status(400).json({ message: 'Decompression failed.' });
        }

        let data;
        try {
            data = JSON.parse(decompressedData.toString());
        } catch (parseErr) {
            return res.status(400).json({ message: 'Invalid JSON data.' });
        }

        if (!Array.isArray(data)) {
            return res.status(400).json({ message: 'Data should be an array of records.' });
        }

        // Validate and clean each record
        const validRecords = [];
        for (let record of data) {
            // Clean diagcode before validation
            if (record.diagcode) {
                record.diagcode = cleanDiagcode(record.diagcode);
            }

            const { error, value } = SmogImportSchema.validate(record);
            if (error) {
                return res.status(400).json({ message: `Validation error: ${error.details[0].message}` });
            }
            validRecords.push([
                value.hospcode,
                value.pid,
                value.birth,
                value.sex,
                value.hn,
                value.seq,
                value.date_serv,
                value.diagtype,
                value.diagcode,
                value.clinic,
                value.provider,
                value.d_update,
                value.cid,
                value.appoint
            ]);
        }

        const recordCount = validRecords.length;
        const hospcode = req.user.hospcode;

        try {
            // Start transaction
            const connection = await require('../config/db').getConnection();
            try {
                await connection.beginTransaction();

                // Insert smog_import records
                const insertSmogSql = `
                    INSERT INTO smog_import 
                    (hospcode, pid, birth, sex, hn, seq, date_serv, diagtype, diagcode, clinic, provider, d_update, cid, appoint)
                    VALUES ?
                `;
                await connection.query(insertSmogSql, [validRecords]);

                // Insert api_imports record
                const insertApiImportsSql = `
                    INSERT INTO api_imports (hospcode, method, rec)
                    VALUES (?, ?, ?)
                `;
                await connection.query(insertApiImportsSql, [hospcode, method, recordCount]);

                await connection.commit();
                connection.release();

                res.json({ message: 'Data received and stored successfully.', records_imported: recordCount });
            } catch (dbErr) {
                await connection.rollback();
                connection.release();
                console.error(dbErr);
                res.status(500).json({ message: 'Internal server error.' });
            }
        } catch (connErr) {
            console.error(connErr);
            res.status(500).json({ message: 'Internal server error.' });
        }
    });
};

const getSmogImportRecordsHandler = async (req, res) => {
    const { hospcode } = req.user;

    try {
        const records = await getSmogImportRecords(hospcode);
        res.json(records);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    handleSmogImport,
    getSmogImportRecordsHandler
};
