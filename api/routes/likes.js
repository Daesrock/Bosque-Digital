/**
 * api/routes/likes.js - Rutas de likes
 */

const express = require('express');
const router = express.Router();
const db = require('../../config/database');
const { verificarToken } = require('../../middleware/auth');

// =====================================================
// DAR LIKE A UNA PUBLICACIÓN (Requiere autenticación)
// =====================================================
router.post('/:publicacionID', verificarToken, async (req, res) => {
  try {
    const usuarioID = req.usuario.usuarioID;
    const { publicacionID } = req.params;

    // Verificar que la publicación existe
    const pubResultado = await db.query(
      'SELECT * FROM Publicaciones WHERE PublicacionID = @publicacionID AND Estado = 1',
      { publicacionID }
    );

    if (pubResultado.recordset.length === 0) {
      return res.status(404).json({
        error: 'Publicación no encontrada',
        code: 'POST_NOT_FOUND'
      });
    }

    // Verificar si ya existe el like
    const likeResultado = await db.query(
      'SELECT * FROM Likes WHERE PublicacionID = @publicacionID AND UsuarioID = @usuarioID',
      { publicacionID, usuarioID }
    );

    if (likeResultado.recordset.length > 0) {
      return res.status(400).json({
        error: 'Ya has dado like a esta publicación',
        code: 'LIKE_EXISTS'
      });
    }

    // Insertar like
    await db.query(
      `INSERT INTO Likes (PublicacionID, UsuarioID)
       VALUES (@publicacionID, @usuarioID)`,
      { publicacionID, usuarioID }
    );

    // Obtener total de likes
    const totalResultado = await db.query(
      'SELECT COUNT(*) as Total FROM Likes WHERE PublicacionID = @publicacionID',
      { publicacionID }
    );

    res.status(201).json({
      mensaje: 'Like agregado exitosamente',
      totalLikes: totalResultado.recordset[0].Total
    });

  } catch (error) {
    console.error('Error al dar like:', error);
    res.status(500).json({
      error: 'Error al dar like',
      detalles: error.message
    });
  }
});

// =====================================================
// REMOVER LIKE DE UNA PUBLICACIÓN (Requiere autenticación)
// =====================================================
router.delete('/:publicacionID', verificarToken, async (req, res) => {
  try {
    const usuarioID = req.usuario.usuarioID;
    const { publicacionID } = req.params;

    // Buscar y eliminar el like
    const likeResultado = await db.query(
      'SELECT * FROM Likes WHERE PublicacionID = @publicacionID AND UsuarioID = @usuarioID',
      { publicacionID, usuarioID }
    );

    if (likeResultado.recordset.length === 0) {
      return res.status(404).json({
        error: 'No has dado like a esta publicación',
        code: 'LIKE_NOT_FOUND'
      });
    }

    await db.query(
      'DELETE FROM Likes WHERE PublicacionID = @publicacionID AND UsuarioID = @usuarioID',
      { publicacionID, usuarioID }
    );

    // Obtener total de likes
    const totalResultado = await db.query(
      'SELECT COUNT(*) as Total FROM Likes WHERE PublicacionID = @publicacionID',
      { publicacionID }
    );

    res.json({
      mensaje: 'Like removido exitosamente',
      totalLikes: totalResultado.recordset[0].Total
    });

  } catch (error) {
    console.error('Error al remover like:', error);
    res.status(500).json({
      error: 'Error al remover like',
      detalles: error.message
    });
  }
});

// =====================================================
// OBTENER LIKES DE UNA PUBLICACIÓN
// =====================================================
router.get('/:publicacionID', async (req, res) => {
  try {
    const { publicacionID } = req.params;

    const resultado = await db.query(
      `SELECT 
        l.LikeID,
        l.UsuarioID,
        l.FechaCreacion,
        u.Nombre,
        u.FotoPerfil
      FROM Likes l
      INNER JOIN Usuarios u ON l.UsuarioID = u.UsuarioID
      WHERE l.PublicacionID = @publicacionID
      ORDER BY l.FechaCreacion DESC`,
      { publicacionID }
    );

    // Contar total
    const totalResultado = await db.query(
      'SELECT COUNT(*) as Total FROM Likes WHERE PublicacionID = @publicacionID',
      { publicacionID }
    );

    res.json({
      total: totalResultado.recordset[0].Total,
      likes: resultado.recordset
    });

  } catch (error) {
    console.error('Error al obtener likes:', error);
    res.status(500).json({
      error: 'Error al obtener likes',
      detalles: error.message
    });
  }
});

// =====================================================
// VERIFICAR SI EL USUARIO ACTUAL DIO LIKE (Requiere autenticación)
// =====================================================
router.get('/usuario/:publicacionID', verificarToken, async (req, res) => {
  try {
    const usuarioID = req.usuario.usuarioID;
    const { publicacionID } = req.params;

    const resultado = await db.query(
      'SELECT COUNT(*) as Total FROM Likes WHERE PublicacionID = @publicacionID AND UsuarioID = @usuarioID',
      { publicacionID, usuarioID }
    );

    res.json({
      tienelike: resultado.recordset[0].Total > 0
    });

  } catch (error) {
    console.error('Error al verificar like:', error);
    res.status(500).json({
      error: 'Error al verificar like',
      detalles: error.message
    });
  }
});

module.exports = router;
