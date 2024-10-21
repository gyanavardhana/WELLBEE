require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
app.get('/', (req, res) => {
    res.send('Hello World');
});


app.use('/users', userRoutes);

app.listen(3000, () => {
    console.log(`Server is running on port ${port}`);
});