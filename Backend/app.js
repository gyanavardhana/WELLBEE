require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const session = require('express-session');

const app = express();
app.use(express.json());

// Set up CORS to allow all origins or configure specific origin
app.use(cors({
    origin: 'http://localhost:5173',  // adjust as needed
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
}));

// Routes
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatmessageRoutes');
const healthmetricRoutes = require('./routes/healthmetricsRoutes');
const dietRoutes = require('./routes/diettipRoutes');
const exerciseRoutes = require('./routes/excersicetipRoutes');
const therapyProfileRoutes = require('./routes/therapyprofileRoutes');
const availableSlotRoutes = require('./routes/availableslotRoutes');
const therapyAppointmentRoutes = require('./routes/therapyappointmentRoutes');
const spotifyRoutes = require('./routes/spotifyRoutes');
const healthRoutes = require('./routes/healthRoutes');
const vultrRoutes = require('./routes/vultrRoutes');
const fitbitRoutes= require('./routes/fitbitRoutes')


// Base route
app.get('/', (req, res) => {
    res.send('Hello World');
});
app.use(session({
    secret: 'your_secret_key', // Change this to a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
  }));
  



// API routes
app.use('/users', userRoutes);
app.use('/chat', chatRoutes);
app.use('/healthmetric', healthmetricRoutes);
app.use('/diet', dietRoutes);
app.use('/exercise', exerciseRoutes);
app.use('/therapy', therapyProfileRoutes);
app.use('/slot', availableSlotRoutes);
app.use('/appointment', therapyAppointmentRoutes);
app.use('/spotify', spotifyRoutes);
app.use('/health', healthRoutes);
app.use('/vultr', vultrRoutes);
app.use('/fitbit',fitbitRoutes)

// Start Express server on port 3000
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
