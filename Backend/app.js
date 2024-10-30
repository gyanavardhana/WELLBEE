require('dotenv').config();
const express = require('express');
const app = express();
const axios = require('axios');
const cors = require('cors')
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatmessageRoutes');
const healthRoutes = require('./routes/healthmetricsRoutes');
const dietRoutes = require('./routes/diettipRoutes');
const excersiceRoutes = require('./routes/excersicetipRoutes');
const therapyprofileRoutes = require('./routes/therapyprofileRoutes');
const avaiableslotRoutes = require('./routes/availableslotRoutes');
const therapyappointmentRoutes = require('./routes/therapyappointmentRoutes');
const spotifyRoutes = require('./routes/spotifyRoutes');

app.get('/', (req, res) => {
    res.send('Hello World');
});
app.use(
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

app.post('/api/chat', async (req, res) => {
    const userInput = req.body.userInput;

    try {
        const response = await axios.post(
            'https://api.vultrinference.com/v1/chat/completions',
            {
                model: 'llama2-13b-chat-Q5_K_M',
                messages: [{ role: 'user', content: userInput }],
                max_tokens: 512,
                seed: -1,
                temperature: 0.8,
                top_k: 40,
                top_p: 0.9,
                stream: false
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.VULTR_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const botMessageContent = response.data.choices[0].message.content;
        res.json({ botMessage: botMessageContent });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while fetching response from Vultr API.' });
    }
});

app.use('/users', userRoutes);
app.use('/chat', chatRoutes);
app.use('/health', healthRoutes);
app.use('/diet', dietRoutes);
app.use('/excersice', excersiceRoutes);
app.use('/therapy', therapyprofileRoutes);
app.use('/slot', avaiableslotRoutes);
app.use('/appointment', therapyappointmentRoutes);
app.use('/spotify', spotifyRoutes);


app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});