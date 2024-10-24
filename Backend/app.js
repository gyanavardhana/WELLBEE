require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatmessageRoutes');
const healthRoutes = require('./routes/healthmetricsRoutes');
const dietRoutes = require('./routes/diettipRoutes');
const excersiceRoutes = require('./routes/excersicetipRoutes');
const therapyprofileRoutes = require('./routes/therapyprofileRoutes');
const avaiableslotRoutes = require('./routes/availableslotRoutes');
const therapyappointmentRoutes = require('./routes/therapyappointmentRoutes');

app.get('/', (req, res) => {
    res.send('Hello World');
});


app.use('/users', userRoutes);
app.use('/chat', chatRoutes);
app.use('/health', healthRoutes);
app.use('/diet', dietRoutes);
app.use('/excersice', excersiceRoutes);
app.use('/therapy', therapyprofileRoutes);
app.use('/slot', avaiableslotRoutes);
app.use('/appointment', therapyappointmentRoutes);

app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});