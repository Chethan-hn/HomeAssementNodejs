const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const catalog = require('./data/catalog.json');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(cors());

app.get('/catalog', (req, res) => {
    res.json(catalog);
});
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });
    socket.on('cartUpdate', ({ roomId, cart }) => {
        socket.to(roomId).emit('receiveCart', cart);
    });
    socket.on('chatMessage', ({ roomId, message }) => {
        socket.to(roomId).emit('receiveMessage', message);
    });
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = 5001;
server.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
