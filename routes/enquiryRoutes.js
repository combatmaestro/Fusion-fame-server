const express = require("express");
const router = express.Router();
const { submitEnquiry, getAllEnquiries } = require("../controllers/enquiryController");

router.post("/", submitEnquiry);
router.get("/enquiry", getAllEnquiries); // NEW route

module.exports = router;
