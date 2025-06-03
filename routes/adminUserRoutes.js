const express = require('express');
const router = express.Router();
const { loginAdmin, registerAdmin } = require('../controllers/adminUserController');

// POST /api/admin/login
router.post('/login', loginAdmin);

// (Optional) Register admin – remove in production or protect it
router.post('/register', registerAdmin);

module.exports = router;
