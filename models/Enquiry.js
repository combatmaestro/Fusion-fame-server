import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  mobile: { type: String, required: true },
  comments: { type: String },
  submittedAt: { type: Date, default: Date.now },
});

// Prevent model overwrite issue in development
const Enquiry = mongoose.models.Enquiry || mongoose.model('Enquiry', enquirySchema);

export default Enquiry;
