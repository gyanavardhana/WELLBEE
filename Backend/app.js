require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatmessageRoutes');
const healthRoutes = require('./routes/healthmetricsRoutes');
const dietRoutes = require('./routes/diettipRoutes');
const exerciseRoutes = require('./routes/excersiceTipRoutes');
const therapyProfileRoutes = require('./routes/therapyprofileRoutes');
const availableSlotRoutes = require('./routes/availableslotRoutes');
const therapyAppointmentRoutes = require('./routes/therapyappointmentRoutes');

// Add CORS to allow all origins
app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));

// Base route
app.get('/', (req, res) => {
    res.send('Hello World');
});

// API routes
app.use('/users', userRoutes);
app.use('/chat', chatRoutes);
app.use('/health', healthRoutes);
app.use('/diet', dietRoutes);
app.use('/exercise', exerciseRoutes);
app.use('/therapy', therapyProfileRoutes);
app.use('/slot', availableSlotRoutes);
app.use('/appointment', therapyAppointmentRoutes);

// Start Express server on port 3000
app.listen(3000, () => {
    console.log(`Express server running on port 3000`);
});
