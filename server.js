const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

let videoState = { url: '', isPlaying: false, time: 0 };

io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.emit('update', videoState);

    socket.on('play', (data) => {
        videoState = { ...videoState, isPlaying: true, time: data.time };
        io.emit('update', videoState);
    });

    socket.on('pause', () => {
        videoState.isPlaying = false;
        io.emit('update', videoState);
    });

    socket.on('seek', (time) => {
        videoState.time = time;
        io.emit('update', videoState);
    });

    socket.on('load', (url) => {
        videoState = { url, isPlaying: false, time: 0 };
        io.emit('update', videoState);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(process.env.PORT || 3000, () => {
    console.log('Server is running');
});
