// validation/supplies.js
const Joi = require('joi');

/**
 * Schema สำหรับสร้างหรือแก้ไข Supply
 */
const supplySchema = Joi.object({
    hospcode: Joi.string().max(5).required(),
    name: Joi.string().max(100).required(),
    description: Joi.string().allow('', null),
    quantity: Joi.number().integer().min(0).required(),
    unit: Joi.string().max(20).allow('', null)
});

module.exports = {
    supplySchema
};
