const express = require('express');
const { ExpressPeerServer } = require('peer');
const http = require('http');

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 9050;
const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/peerjs'
});

app.use('/peerjs', peerServer);

// Health check endpoint for monitoring uptime
app.get('/health', (req, res) => {
  res.json({ status: 'OK', uptime: process.uptime() });
});

server.listen(port, () => {
  console.log(`Signaling server listening on port ${port}`);
});
