require('dotenv').config();
const express = require('express');
const app = express();
const axios = require('axios');
const cors = require('cors')
const swaggerSpec = require('./swaggerConfig');
const swaggerUi = require('swagger-ui-express');
const logger = require('./logger/logger')
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatmessageRoutes');
const healtmetrichRoutes = require('./routes/healthmetricsRoutes');
const dietRoutes = require('./routes/diettipRoutes');
const excersiceRoutes = require('./routes/excersicetipRoutes');
const therapyprofileRoutes = require('./routes/therapyprofileRoutes');
const avaiableslotRoutes = require('./routes/availableslotRoutes');
const therapyappointmentRoutes = require('./routes/therapyappointmentRoutes');
const spotifyRoutes = require('./routes/spotifyRoutes');
const healthRoutes = require('./routes/healthRoutes');
const vultrRoutes = require('./routes/vultrRoutes');
const fitbitRoutes= require('./routes/fitbitRoutes');
const logger = require('./logger/logger');

app.get('/', (req, res) => {
    res.send('Hello World');
});
axios.get(`${process.env.FASTAPI_URL}hello`, {
}).then((response) => {
    logger.info(response.data);
}).catch((error) => {
    logger.error(error);
});
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);


app.use('/users', userRoutes);
app.use('/chat', chatRoutes);
app.use('/health', healtmetrichRoutes);
app.use('/diet', dietRoutes);
app.use('/excersice', excersiceRoutes);
app.use('/therapy', therapyprofileRoutes);
app.use('/slot', avaiableslotRoutes);
app.use('/appointment', therapyappointmentRoutes);
app.use('/spotify', spotifyRoutes);
app.use('/healthinfo', healthRoutes);
app.use('/vultr', vultrRoutes);
app.use('/fitbit', fitbitRoutes)


app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});