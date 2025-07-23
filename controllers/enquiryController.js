import Enquiry from '../models/Enquiry.js';

// Submit an enquiry
export const submitEnquiry = async (req, res) => {
  try {
    const { userName, userEmail, mobile, comments } = req.body;

    if (!userName || !userEmail || !mobile) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const newEnquiry = new Enquiry({ userName, userEmail, mobile, comments });
    await newEnquiry.save();

    res.status(200).json({ message: 'Enquiry submitted successfully.' });
  } catch (error) {
    console.error('Error saving enquiry:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Get all enquiries
export const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ submittedAt: -1 });
    res.status(200).json(enquiries);
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
