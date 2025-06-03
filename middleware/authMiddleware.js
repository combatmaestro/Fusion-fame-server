const jwt = require('jsonwebtoken');
const AdminUser = require('../models/adminUser');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

exports.verifyAdminToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await AdminUser.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    req.admin = admin; // Attach to request
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
