const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const socketServer = http.createServer();
const io = new Server(socketServer, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
});

// WebSocket logic for chat rooms
const MAX_USERS = 5;
const roomQueue = [];
const roomCounts = {};

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
        const room = Array.from(socket.rooms)[1];
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
        if (roomCounts[room] < MAX_USERS) return room;
    }
    const newRoom = `room-${Math.random().toString(36).substring(7)}`;
    roomQueue.push(newRoom);
    roomCounts[newRoom] = 0;
    return newRoom;
}

// Start WebSocket server on port 3001
socketServer.listen(3001, () => {
    console.log(`Socket.IO server running on port 3001`);
});
