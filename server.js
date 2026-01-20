const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const port = process.env.PORT || 4000;

// Store rooms and their participants
const rooms = new Map();

wss.on('connection', (ws, req) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    // Expecting path like /api/signal/[roomId]
    const match = pathname.match(/\/api\/signal\/(.+)/);

    if (!match) {
        ws.close();
        return;
    }

    const roomId = match[1];

    if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
    }

    const room = rooms.get(roomId);
    room.add(ws);

    console.log(`Client connected to room ${roomId}. Total clients: ${room.size}`);

    ws.on('message', (message) => {
        // Broadcast to other clients in the room
        room.forEach(client => {
            if (client !== ws && client.readyState === 1) { // 1 = OPEN
                client.send(message.toString());
            }
        });
    });

    ws.on('close', () => {
        room.delete(ws);
        if (room.size === 0) {
            rooms.delete(roomId);
        }
        console.log(`Client disconnected from room ${roomId}. Total clients: ${room.size}`);
    });
});

app.get('/', (req, res) => {
    res.send('Signaling server is running');
});

server.listen(port, () => {
    console.log(`Signaling server running on port ${port}`);
});
