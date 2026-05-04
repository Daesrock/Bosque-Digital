/**
 * api/routes/comentarios.js - Rutas de comentarios
 */

const express = require('express');
const router = express.Router();
const db = require('../../config/database');
const { verificarToken } = require('../../middleware/auth');

// =====================================================
// CREAR COMENTARIO (Requiere autenticación)
// =====================================================
router.post('/', verificarToken, async (req, res) => {
  try {
    const usuarioID = req.usuario.usuarioID;
    const { publicacionID, texto } = req.body;

    if (!publicacionID || !texto) {
      return res.status(400).json({
        error: 'PublicacionID y texto son requeridos',
        code: 'MISSING_FIELDS'
      });
    }

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

    const resultado = await db.query(
      `INSERT INTO Comentarios (PublicacionID, UsuarioID, Texto)
       VALUES (@publicacionID, @usuarioID, @texto);
       SELECT SCOPE_IDENTITY() as ComentarioID;`,
      { publicacionID, usuarioID, texto }
    );

    const comentarioID = resultado.recordset[0].ComentarioID;

    res.status(201).json({
      mensaje: 'Comentario creado exitosamente',
      comentarioID
    });

  } catch (error) {
    console.error('Error al crear comentario:', error);
    res.status(500).json({
      error: 'Error al crear comentario',
      detalles: error.message
    });
  }
});

// =====================================================
// OBTENER COMENTARIOS DE UNA PUBLICACIÓN
// =====================================================
router.get('/publicacion/:publicacionID', async (req, res) => {
  try {
    const { publicacionID } = req.params;

    const resultado = await db.query(
      `SELECT * FROM vw_ComentariosConDetalles
       WHERE PublicacionID = @publicacionID
       ORDER BY FechaCreacion DESC`,
      { publicacionID }
    );

    res.json(resultado.recordset);

  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    res.status(500).json({
      error: 'Error al obtener comentarios',
      detalles: error.message
    });
  }
});

// =====================================================
// OBTENER COMENTARIOS DE UN USUARIO
// =====================================================
router.get('/usuario/:usuarioID', async (req, res) => {
  try {
    const { usuarioID } = req.params;

    const resultado = await db.query(
      `SELECT * FROM vw_ComentariosConDetalles
       WHERE UsuarioID = @usuarioID
       ORDER BY FechaCreacion DESC`,
      { usuarioID }
    );

    res.json(resultado.recordset);

  } catch (error) {
    console.error('Error al obtener comentarios del usuario:', error);
    res.status(500).json({
      error: 'Error al obtener comentarios',
      detalles: error.message
    });
  }
});

// =====================================================
// ACTUALIZAR COMENTARIO (Requiere autenticación)
// =====================================================
router.put('/:comentarioID', verificarToken, async (req, res) => {
  try {
    const usuarioID = req.usuario.usuarioID;
    const { comentarioID } = req.params;
    const { texto } = req.body;

    // Verificar que el usuario es el propietario
    const comResultado = await db.query(
      'SELECT * FROM Comentarios WHERE ComentarioID = @comentarioID',
      { comentarioID }
    );

    if (comResultado.recordset.length === 0) {
      return res.status(404).json({
        error: 'Comentario no encontrado',
        code: 'COMMENT_NOT_FOUND'
      });
    }

    if (comResultado.recordset[0].UsuarioID !== usuarioID) {
      return res.status(403).json({
        error: 'No tienes permiso para editar este comentario',
        code: 'UNAUTHORIZED'
      });
    }

    await db.query(
      `UPDATE Comentarios 
       SET Texto = @texto, FechaActualizacion = GETDATE()
       WHERE ComentarioID = @comentarioID`,
      { comentarioID, texto }
    );

    res.json({
      mensaje: 'Comentario actualizado correctamente'
    });

  } catch (error) {
    console.error('Error al actualizar comentario:', error);
    res.status(500).json({
      error: 'Error al actualizar comentario',
      detalles: error.message
    });
  }
});

// =====================================================
// ELIMINAR COMENTARIO (Requiere autenticación)
// =====================================================
router.delete('/:comentarioID', verificarToken, async (req, res) => {
  try {
    const usuarioID = req.usuario.usuarioID;
    const { comentarioID } = req.params;

    // Verificar que el usuario es el propietario
    const comResultado = await db.query(
      'SELECT * FROM Comentarios WHERE ComentarioID = @comentarioID',
      { comentarioID }
    );

    if (comResultado.recordset.length === 0) {
      return res.status(404).json({
        error: 'Comentario no encontrado',
        code: 'COMMENT_NOT_FOUND'
      });
    }

    if (comResultado.recordset[0].UsuarioID !== usuarioID) {
      return res.status(403).json({
        error: 'No tienes permiso para eliminar este comentario',
        code: 'UNAUTHORIZED'
      });
    }

    await db.query(
      'UPDATE Comentarios SET Estado = 0 WHERE ComentarioID = @comentarioID',
      { comentarioID }
    );

    res.json({
      mensaje: 'Comentario eliminado correctamente'
    });

  } catch (error) {
    console.error('Error al eliminar comentario:', error);
    res.status(500).json({
      error: 'Error al eliminar comentario',
      detalles: error.message
    });
  }
});

module.exports = router;
