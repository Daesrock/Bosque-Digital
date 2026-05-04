/**
 * api/routes/auth.js - Rutas de autenticación
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../../config/database');
const { generarToken, verificarToken } = require('../../middleware/auth');
const { body, validationResult } = require('express-validator');

// =====================================================
// REGISTRO
// =====================================================
router.post('/registro', 
  body('email').isEmail().normalizeEmail(),
  body('nombre').isLength({ min: 3 }).trim().escape(),
  body('contraseña').isLength({ min: 6 }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { nombre, email, contraseña, universidad, carrera } = req.body;

      // Verificar si el email ya existe
      const resultadoExistente = await db.query(
        'SELECT * FROM Usuarios WHERE Email = @email',
        { email }
      );

      if (resultadoExistente.recordset.length > 0) {
        return res.status(409).json({
          error: 'Este email ya está registrado',
          code: 'EMAIL_EXISTS'
        });
      }

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(contraseña, 10);

      // Insertar usuario
      const resultado = await db.query(
        `INSERT INTO Usuarios (Nombre, Email, Contraseña, Universidad, Carrera)
         VALUES (@nombre, @email, @contraseña, @universidad, @carrera);
         SELECT SCOPE_IDENTITY() as UsuarioID;`,
        {
          nombre,
          email,
          contraseña: hashedPassword,
          universidad: universidad || null,
          carrera: carrera || null
        }
      );

      const usuarioID = resultado.recordset[0].UsuarioID;
      const token = generarToken(usuarioID);

      res.status(201).json({
        mensaje: 'Usuario registrado exitosamente',
        usuarioID,
        token
      });

    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({
        error: 'Error al registrar usuario',
        detalles: error.message
      });
    }
  }
);

// =====================================================
// LOGIN
// =====================================================
router.post('/login',
  body('email').isEmail().normalizeEmail(),
  body('contraseña').notEmpty(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, contraseña } = req.body;

      // Buscar usuario
      const resultado = await db.query(
        'SELECT * FROM Usuarios WHERE Email = @email AND Estado = 1',
        { email }
      );

      if (resultado.recordset.length === 0) {
        return res.status(401).json({
          error: 'Email o contraseña incorrectos',
          code: 'INVALID_CREDENTIALS'
        });
      }

      const usuario = resultado.recordset[0];

      // Verificar contraseña
      const contraseñaValida = await bcrypt.compare(contraseña, usuario.Contraseña);

      if (!contraseñaValida) {
        return res.status(401).json({
          error: 'Email o contraseña incorrectos',
          code: 'INVALID_CREDENTIALS'
        });
      }

      // Actualizar último acceso
      await db.query(
        'UPDATE Usuarios SET UltimoAcceso = GETDATE() WHERE UsuarioID = @usuarioID',
        { usuarioID: usuario.UsuarioID }
      );

      const token = generarToken(usuario.UsuarioID);

      res.json({
        mensaje: 'Login exitoso',
        usuarioID: usuario.UsuarioID,
        nombre: usuario.Nombre,
        email: usuario.Email,
        fotoPerfil: usuario.FotoPerfil,
        token
      });

    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        error: 'Error al iniciar sesión',
        detalles: error.message
      });
    }
  }
);

// =====================================================
// VERIFICAR TOKEN
// =====================================================
router.get('/verificar', verificarToken, (req, res) => {
  res.json({
    valido: true,
    usuarioID: req.usuario.usuarioID
  });
});

module.exports = router;
