/**
 * middleware/auth.js - Middleware de autenticación con JWT
 */

const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar JWT
 */
function verificarToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      error: 'No autorizado - Token no proporcionado',
      code: 'NO_TOKEN'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      error: 'Token inválido o expirado',
      code: 'INVALID_TOKEN'
    });
  }
}

/**
 * Generar JWT
 */
function generarToken(usuarioID) {
  return jwt.sign(
    { 
      usuarioID: usuarioID,
      timestamp: Date.now()
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

module.exports = {
  verificarToken,
  generarToken
};
