const Joi = require('joi');
function cleanDiagcode(code) {
  if (typeof code !== 'string') {
      return code;
  }
  let cleaned = code.trim(); // ตัดช่องว่าง
  cleaned = cleaned.toUpperCase(); // แปลงเป็นตัวพิมพ์ใหญ่
  cleaned = cleaned.replace(/[^A-Z0-9]/g, ''); // ลบอักขระที่ไม่ต้องการ
  return cleaned;
}
// Schema สำหรับ smog_import record
const smogImportSchema = Joi.object({
  hospcode: Joi.string().max(5).required(),
  pid: Joi.string().max(50).required(),
  birth: Joi.date().required(),
  sex: Joi.string().valid('M', 'F').required(),
  hn: Joi.string().max(50).required(),
  seq: Joi.string().max(50).required(),
  date_serv: Joi.date().required(),
  diagtype: Joi.string().max(50).allow(null, ''),
  diagcode: Joi.string().max(50).allow(null, '').custom((value, helpers) => {
      return cleanDiagcode(value);
  }, 'Custom diagcode cleaning'),
  clinic: Joi.string().max(100).allow(null, ''),
  provider: Joi.string().max(100).allow(null, ''),
  d_update: Joi.date().required(),
  cid: Joi.string().max(20).allow(null, ''),
  appoint: Joi.string().valid('Y', 'N').required(),
  addrcode: Joi.string().max(100).allow(null, '')
});

module.exports = {
  smogImportSchema
};