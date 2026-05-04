/**
 * api/routes/usuarios.js - Rutas de gestión de usuarios
 */

const express = require('express');
const router = express.Router();
const db = require('../../config/database');
const { verificarToken } = require('../../middleware/auth');

// =====================================================
// OBTENER PERFIL DEL USUARIO
// =====================================================
router.get('/perfil/:usuarioID', async (req, res) => {
  try {
    const { usuarioID } = req.params;

    const resultado = await db.query(
      `SELECT 
        UsuarioID, 
        Nombre, 
        Email, 
        Universidad, 
        Carrera, 
        FotoPerfil, 
        Biografia,
        FechaRegistro,
        (SELECT COUNT(*) FROM Publicaciones WHERE UsuarioID = @usuarioID) as TotalPublicaciones,
        (SELECT COUNT(*) FROM Comentarios WHERE UsuarioID = @usuarioID) as TotalComentarios
      FROM Usuarios 
      WHERE UsuarioID = @usuarioID AND Estado = 1`,
      { usuarioID }
    );

    if (resultado.recordset.length === 0) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    res.json(resultado.recordset[0]);

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      error: 'Error al obtener perfil',
      detalles: error.message
    });
  }
});

// =====================================================
// ACTUALIZAR PERFIL DEL USUARIO (Requiere autenticación)
// =====================================================
router.put('/perfil', verificarToken, async (req, res) => {
  try {
    const usuarioID = req.usuario.usuarioID;
    const { nombre, biografia, carrera, universidad } = req.body;

    const resultado = await db.query(
      `UPDATE Usuarios 
       SET Nombre = @nombre, 
           Biografia = @biografia,
           Carrera = @carrera,
           Universidad = @universidad
       WHERE UsuarioID = @usuarioID;
       SELECT * FROM Usuarios WHERE UsuarioID = @usuarioID`,
      { usuarioID, nombre, biografia, carrera, universidad }
    );

    res.json({
      mensaje: 'Perfil actualizado correctamente',
      usuario: resultado.recordset[0]
    });

  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({
      error: 'Error al actualizar perfil',
      detalles: error.message
    });
  }
});

// =====================================================
// ACTUALIZAR FOTO DE PERFIL (Requiere autenticación)
// =====================================================
router.put('/foto-perfil', verificarToken, async (req, res) => {
  try {
    const usuarioID = req.usuario.usuarioID;
    const { fotoPerfil } = req.body; // Base64 o URL

    const resultado = await db.query(
      `UPDATE Usuarios 
       SET FotoPerfil = @fotoPerfil
       WHERE UsuarioID = @usuarioID;
       SELECT FotoPerfil FROM Usuarios WHERE UsuarioID = @usuarioID`,
      { usuarioID, fotoPerfil }
    );

    res.json({
      mensaje: 'Foto de perfil actualizada',
      fotoPerfil: resultado.recordset[0].FotoPerfil
    });

  } catch (error) {
    console.error('Error al actualizar foto:', error);
    res.status(500).json({
      error: 'Error al actualizar foto',
      detalles: error.message
    });
  }
});

// =====================================================
// LISTAR TODOS LOS USUARIOS
// =====================================================
router.get('/lista', async (req, res) => {
  try {
    const resultado = await db.query(
      `SELECT 
        UsuarioID, 
        Nombre, 
        FotoPerfil,
        Carrera,
        Universidad,
        FechaRegistro
      FROM Usuarios 
      WHERE Estado = 1
      ORDER BY FechaRegistro DESC`
    );

    res.json(resultado.recordset);

  } catch (error) {
    console.error('Error al listar usuarios:', error);
    res.status(500).json({
      error: 'Error al listar usuarios',
      detalles: error.message
    });
  }
});

module.exports = router;
