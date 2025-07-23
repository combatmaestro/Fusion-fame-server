import express from 'express';
import { submitEnquiry, getAllEnquiries } from '../controllers/enquiryController.js';

const router = express.Router();

router.post('/', submitEnquiry);
router.get('/enquiry', getAllEnquiries); // NEW route

export default router;
