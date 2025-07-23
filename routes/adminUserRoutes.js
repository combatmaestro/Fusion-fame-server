// adminUserRoutes.js
import express from 'express';
import { loginAdmin, registerAdmin } from '../controllers/adminUserController.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/register', registerAdmin);

export default router; // ✅ ESM compatible
