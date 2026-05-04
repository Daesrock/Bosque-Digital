/**
 * api/routes/publicaciones.js - Rutas de publicaciones
 */

const express = require('express');
const router = express.Router();
const db = require('../../config/database');
const { verificarToken } = require('../../middleware/auth');

// =====================================================
// CREAR PUBLICACIÓN (Requiere autenticación)
// =====================================================
router.post('/', verificarToken, async (req, res) => {
  try {
    const usuarioID = req.usuario.usuarioID;
    const { titulo, descripcion, imagen } = req.body;

    if (!titulo || !descripcion) {
      return res.status(400).json({
        error: 'Título y descripción son requeridos',
        code: 'MISSING_FIELDS'
      });
    }

    const resultado = await db.query(
      `INSERT INTO Publicaciones (UsuarioID, Titulo, Descripcion, Imagen)
       VALUES (@usuarioID, @titulo, @descripcion, @imagen);
       SELECT SCOPE_IDENTITY() as PublicacionID;`,
      { usuarioID, titulo, descripcion, imagen: imagen || null }
    );

    const publicacionID = resultado.recordset[0].PublicacionID;

    res.status(201).json({
      mensaje: 'Publicación creada exitosamente',
      publicacionID
    });

  } catch (error) {
    console.error('Error al crear publicación:', error);
    res.status(500).json({
      error: 'Error al crear publicación',
      detalles: error.message
    });
  }
});

// =====================================================
// OBTENER TODAS LAS PUBLICACIONES
// =====================================================
router.get('/', async (req, res) => {
  try {
    const { pagina = 1, limite = 10 } = req.query;
    const offset = (pagina - 1) * limite;

    const resultado = await db.query(
      `SELECT *
       FROM vw_PublicacionesConDetalles
       ORDER BY FechaCreacion DESC
       OFFSET @offset ROWS
       FETCH NEXT @limite ROWS ONLY`,
      { limite: parseInt(limite), offset: offset }
    );

    // Contar total de publicaciones
    const totalResultado = await db.query(
      'SELECT COUNT(*) as Total FROM Publicaciones WHERE Estado = 1'
    );

    res.json({
      publicaciones: resultado.recordset,
      total: totalResultado.recordset[0].Total,
      pagina: parseInt(pagina),
      totalPaginas: Math.ceil(totalResultado.recordset[0].Total / limite)
    });

  } catch (error) {
    console.error('Error al obtener publicaciones:', error);
    res.status(500).json({
      error: 'Error al obtener publicaciones',
      detalles: error.message
    });
  }
});

// =====================================================
// OBTENER PUBLICACIÓN POR ID
// =====================================================
router.get('/:publicacionID', async (req, res) => {
  try {
    const { publicacionID } = req.params;

    const resultado = await db.query(
      `SELECT * FROM vw_PublicacionesConDetalles 
       WHERE PublicacionID = @publicacionID`,
      { publicacionID }
    );

    if (resultado.recordset.length === 0) {
      return res.status(404).json({
        error: 'Publicación no encontrada',
        code: 'POST_NOT_FOUND'
      });
    }

    res.json(resultado.recordset[0]);

  } catch (error) {
    console.error('Error al obtener publicación:', error);
    res.status(500).json({
      error: 'Error al obtener publicación',
      detalles: error.message
    });
  }
});

// =====================================================
// OBTENER PUBLICACIONES POR USUARIO
// =====================================================
router.get('/usuario/:usuarioID', async (req, res) => {
  try {
    const { usuarioID } = req.params;

    const resultado = await db.query(
      `SELECT * FROM vw_PublicacionesConDetalles 
       WHERE UsuarioID = @usuarioID
       ORDER BY FechaCreacion DESC`,
      { usuarioID }
    );

    res.json(resultado.recordset);

  } catch (error) {
    console.error('Error al obtener publicaciones del usuario:', error);
    res.status(500).json({
      error: 'Error al obtener publicaciones',
      detalles: error.message
    });
  }
});

// =====================================================
// ACTUALIZAR PUBLICACIÓN (Requiere autenticación)
// =====================================================
router.put('/:publicacionID', verificarToken, async (req, res) => {
  try {
    const usuarioID = req.usuario.usuarioID;
    const { publicacionID } = req.params;
    const { titulo, descripcion, imagen } = req.body;

    // Verificar que el usuario es el propietario
    const verifiResultado = await db.query(
      'SELECT * FROM Publicaciones WHERE PublicacionID = @publicacionID',
      { publicacionID }
    );

    if (verifiResultado.recordset.length === 0) {
      return res.status(404).json({
        error: 'Publicación no encontrada',
        code: 'POST_NOT_FOUND'
      });
    }

    if (verifiResultado.recordset[0].UsuarioID !== usuarioID) {
      return res.status(403).json({
        error: 'No tienes permiso para editar esta publicación',
        code: 'UNAUTHORIZED'
      });
    }

    await db.query(
      `UPDATE Publicaciones 
       SET Titulo = @titulo, 
           Descripcion = @descripcion,
           Imagen = @imagen,
           FechaActualizacion = GETDATE()
       WHERE PublicacionID = @publicacionID`,
      { publicacionID, titulo, descripcion, imagen }
    );

    res.json({
      mensaje: 'Publicación actualizada correctamente'
    });

  } catch (error) {
    console.error('Error al actualizar publicación:', error);
    res.status(500).json({
      error: 'Error al actualizar publicación',
      detalles: error.message
    });
  }
});

// =====================================================
// ELIMINAR PUBLICACIÓN (Requiere autenticación)
// =====================================================
router.delete('/:publicacionID', verificarToken, async (req, res) => {
  try {
    const usuarioID = req.usuario.usuarioID;
    const { publicacionID } = req.params;

    // Verificar que el usuario es el propietario
    const verifiResultado = await db.query(
      'SELECT * FROM Publicaciones WHERE PublicacionID = @publicacionID',
      { publicacionID }
    );

    if (verifiResultado.recordset.length === 0) {
      return res.status(404).json({
        error: 'Publicación no encontrada',
        code: 'POST_NOT_FOUND'
      });
    }

    if (verifiResultado.recordset[0].UsuarioID !== usuarioID) {
      return res.status(403).json({
        error: 'No tienes permiso para eliminar esta publicación',
        code: 'UNAUTHORIZED'
      });
    }

    await db.query(
      'UPDATE Publicaciones SET Estado = 0 WHERE PublicacionID = @publicacionID',
      { publicacionID }
    );

    res.json({
      mensaje: 'Publicación eliminada correctamente'
    });

  } catch (error) {
    console.error('Error al eliminar publicación:', error);
    res.status(500).json({
      error: 'Error al eliminar publicación',
      detalles: error.message
    });
  }
});

module.exports = router;
