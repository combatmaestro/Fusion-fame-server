const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const enquiryRoutes = require("./routes/enquiryRoutes");
const adminUserRoutes = require('./routes/adminUserRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/enquiries", enquiryRoutes);
app.use('/api/admin', adminUserRoutes);
app.use('/api/bookings', bookingRoutes);
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
