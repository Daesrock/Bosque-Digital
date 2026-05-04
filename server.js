/**
 * server.js - Backend Bosque Digital
 * Servidor Express con autenticación, publicaciones, comentarios y likes
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Rutas de la API
const authRoutes = require('./api/routes/auth');
const usuariosRoutes = require('./api/routes/usuarios');
const publicacionesRoutes = require('./api/routes/publicaciones');
const comentariosRoutes = require('./api/routes/comentarios');
const likesRoutes = require('./api/routes/likes');

const app = express();

// =====================================================
// MIDDLEWARES
// =====================================================

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Parser JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname)));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Crear directorio de uploads si no existe
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// =====================================================
// RUTAS API
// =====================================================

// Autenticación
app.use('/api/auth', authRoutes);

// Usuarios
app.use('/api/usuarios', usuariosRoutes);

// Publicaciones
app.use('/api/publicaciones', publicacionesRoutes);

// Comentarios
app.use('/api/comentarios', comentariosRoutes);

// Likes
app.use('/api/likes', likesRoutes);

// =====================================================
// RUTAS DE PRUEBA
// =====================================================

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor Bosque Digital funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// =====================================================
// MANEJO DE ERRORES
// =====================================================

// 404 - Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.originalUrl,
    method: req.method
  });
});

// Error general
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    status: err.status || 500,
    timestamp: new Date().toISOString()
  });
});

// =====================================================
// INICIAR SERVIDOR
// =====================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  🌲 Bosque Digital - Backend           ║
║  Servidor corriendo en puerto ${PORT}    ║
║  URL: http://localhost:${PORT}          ║
╚════════════════════════════════════════╝
  `);
});

module.exports = app;
