const joi = require('joi');

const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

const registerSchema = joi.object({
  userName: joi.string().min(3).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

module.exports = { loginSchema, registerSchema };
