require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatmessageRoutes');
app.get('/', (req, res) => {
    res.send('Hello World');
});


app.use('/users', userRoutes);
app.use('/chat', chatRoutes);

app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});