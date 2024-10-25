require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatmessageRoutes');
const healthRoutes = require('./routes/healthmetricsRoutes');
const dietRoutes = require('./routes/diettipRoutes');
const excersiceRoutes = require('./routes/excersicetipRoutes');
const therapyprofileRoutes = require('./routes/therapyprofileRoutes');
const avaiableslotRoutes = require('./routes/availableslotRoutes');
const therapyappointmentRoutes = require('./routes/therapyappointmentRoutes');

// Add CORS to allow all origins
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

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

// Create HTTP server
const server = http.createServer(app);

// Attach socket.io to the HTTP server
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// WebSocket logic for chat rooms
const MAX_USERS = 5;
const roomQueue = []; // Queue to keep track of room names
const roomCounts = {}; // Object to store the user count for each room

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Assign user to a room with available space or create a new room
    socket.on('joinRoom', () => {
        const room = findAvailableRoom();
        console.log(`User ${socket.id} is joining room: ${room}`);
        socket.join(room);

        // Update room count
        roomCounts[room] = (roomCounts[room] || 0) + 1;

        io.to(room).emit('message', `User ${socket.id} joined room ${room}`);
    });

    // Handle message sending
    socket.on('sendMessage', (message) => {
        const room = Array.from(socket.rooms)[1]; // Get the user's room
        console.log(`Message from ${socket.id} in room ${room}: ${message}`);
        io.to(room).emit('message', message);
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`);
        const room = Array.from(socket.rooms)[1];
        if (room) {
            roomCounts[room] -= 1;
            if (roomCounts[room] === 0) {
                // Remove empty rooms from the queue
                const roomIndex = roomQueue.indexOf(room);
                if (roomIndex > -1) roomQueue.splice(roomIndex, 1);
                delete roomCounts[room];
            }
        }
    });
});

// Function to find or create a room with space available
function findAvailableRoom() {
    for (const room of roomQueue) {
        if (roomCounts[room] < MAX_USERS) {
            return room;
        }
    }

    // All existing rooms are full, create a new one
    const newRoom = `room-${Math.random().toString(36).substring(7)}`;
    roomQueue.push(newRoom); // Add new room to the queue
    roomCounts[newRoom] = 0; // Initialize user count for the new room
    return newRoom;
}

// Start the server and WebSocket
server.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});
