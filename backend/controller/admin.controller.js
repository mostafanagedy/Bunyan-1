//* Model
const Admin = require('../model/Admin.model');
//* Joi Schemas
const { loginSchema, registerSchema } = require('./validation/admin.validation');
//* JWT
const jwt = require('jsonwebtoken');
const signToken = (id) => jwt.sign({ id }, process.env.SecretKey, { expiresIn: '7d' });

//* Register
const register = async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  const { userName, email, password } = req.body;

  const exists = await Admin.findOne({ email });
  if (exists) return res.status(400).json({ msg: 'Email already exists' });

  const admin = await Admin.create({ userName, email, password });
  res.status(201).json({ token: signToken(admin._id) });
};

//* Login
const login = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  const { email, password } = req.body;

  const admin = await Admin.findOne({ email }).select('+password');
  if (!admin) return res.status(401).json({ msg: 'Invalid credentials' });

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) return res.status(401).json({ msg: 'Invalid credentials' });

  res.status(200).json({ token: signToken(admin._id) });
};

module.exports = { register, login };