const AdminUser = require('../models/adminUser');
const jwt = require('jsonwebtoken');

// You can replace this with your own secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await AdminUser.findOne({ email });
    if (!admin) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.registerAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existing = await AdminUser.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Admin already exists' });

    const admin = new AdminUser({ email, password });
    await admin.save();

    res.status(201).json({ success: true, message: 'Admin registered successfully' });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
