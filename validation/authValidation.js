// validation/authValidation.js
const Joi = require('joi');

const registerSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    hospcode: Joi.string().max(5).required(),
    hospname: Joi.string().max(100).required()
});

const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});

module.exports = {
    registerSchema,
    loginSchema
};
