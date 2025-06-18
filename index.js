require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const turnoRoutes = require('./routes/turnoRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const { ConnectDB } = require('./data/config');

const app = express();
const server = http.createServer(app);

// Configuración de WebSocket
const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware de autenticación para WebSockets
io.use(authMiddleware.socketAuth);

// Eventos de conexión WebSocket
io.on('connection', (socket) => {
  console.log(`Cliente conectado: ${socket.user?.nombre}`);
  
  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.user?.nombre}`);
  });
});

// Middlewares
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));
app.use(express.json());

// Health check para Railway
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'API-4-Turnos' });
});

// Inyectar io en las rutas
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Rutas
app.use('/api-4-turnos', turnoRoutes);

// Conectar a MongoDB
ConnectDB();

// Puerto dinámico para Railway
const PORT = process.env.PORT || 3009;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor de turnos ejecutándose en puerto ${PORT}`);
});
