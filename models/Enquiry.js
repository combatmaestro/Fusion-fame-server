const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema({
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  mobile: { type: String, required: true },
  comments: { type: String },
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Enquiry", enquirySchema);
