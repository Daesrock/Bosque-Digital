/**
 * api/routes/impacto.js - Rutas de impacto colectivo e individual
 */

const express = require('express');
const router = express.Router();
const db = require('../../config/database');
const { verificarToken } = require('../../middleware/auth');

// =====================================================
// OBTENER IMPACTO COLECTIVO (Datos en tiempo real desde BD)
// =====================================================
router.get('/colectivo', async (req, res) => {
  try {
    // Calcular datos reales desde las tablas
    const usuariosResult = await db.query(
      `SELECT COUNT(*) as total FROM Usuarios WHERE Estado = 1`
    );
    const usuariosRegistrados = usuariosResult.recordset[0]?.total || 0;

    // Contar registros de impacto único (voluntarios que han participado)
    const voluntariosResult = await db.query(
      `SELECT COUNT(DISTINCT UsuarioID) as total FROM RegistroImpacto`
    );
    const voluntariosActivos = voluntariosResult.recordset[0]?.total || 0;

    // Suma total de árboles plantados (usando conversión: 1 m² = 0.005 tonCO2)
    // Árboles estimados: aproximadamente 1 árbol por 0.5 tonCO2
    const impactoResult = await db.query(
      `SELECT 
        SUM(CAST(AreaForestal as INT) / 20) as arbolesEstimados,
        SUM(TonCO2Equivalente) as tonCO2Total
       FROM RegistroImpacto
       WHERE TonCO2Equivalente > 0`
    );
    
    const arbolesPlantados = impactoResult.recordset[0]?.arbolesEstimados || 0;
    const tonCO2Evitadas = parseFloat(impactoResult.recordset[0]?.tonCO2Total) || 0;

    // Responder con datos reales actualizados
    res.json({
      usuariosRegistrados: parseInt(usuariosRegistrados),
      arbolesPlantados: parseInt(arbolesPlantados),
      voluntariosActivos: parseInt(voluntariosActivos),
      tonCO2Evitadas: parseFloat(tonCO2Evitadas.toFixed(2)),
      fechaActualizacion: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error al obtener impacto colectivo:', error);
    res.status(500).json({
      error: 'Error al obtener impacto colectivo',
      detalles: error.message
    });
  }
});

// =====================================================
// ACTUALIZAR IMPACTO COLECTIVO (Incrementar)
// =====================================================
router.put('/colectivo', verificarToken, async (req, res) => {
  try {
    const { arboles = 0, voluntarios = 0, tonCO2 = 0 } = req.body;

    // Obtener impacto actual
    const actual = await db.query(
      `SELECT TOP 1 * FROM ImpactoColectivo ORDER BY FechaActualizacion DESC`
    );

    if (actual.recordset.length === 0) {
      // Crear si no existe
      await db.query(
        `INSERT INTO ImpactoColectivo (ArbolesPlantados, VoluntariosActivos, TonCO2Evitadas)
         VALUES (@arboles, @voluntarios, @tonCO2)`,
        { arboles, voluntarios, tonCO2 }
      );
    } else {
      // Incrementar
      await db.query(
        `UPDATE ImpactoColectivo 
         SET ArbolesPlantados = ArbolesPlantados + @arboles,
             VoluntariosActivos = VoluntariosActivos + @voluntarios,
             TonCO2Evitadas = TonCO2Evitadas + @tonCO2,
             FechaActualizacion = GETDATE()
         WHERE ImpactoID = (SELECT TOP 1 ImpactoID FROM ImpactoColectivo ORDER BY FechaActualizacion DESC)`,
        { arboles, voluntarios, tonCO2 }
      );
    }

    res.json({
      mensaje: 'Impacto colectivo actualizado',
      arbolesAgregados: arboles,
      voluntariosAgregados: voluntarios,
      tonCO2Agregadas: tonCO2
    });

  } catch (error) {
    console.error('Error al actualizar impacto:', error);
    res.status(500).json({
      error: 'Error al actualizar impacto',
      detalles: error.message
    });
  }
});

// =====================================================
// GUARDAR IMPACTO INDIVIDUAL DEL USUARIO
// =====================================================
router.post('/individual', verificarToken, async (req, res) => {
  try {
    const usuarioID = req.usuario.usuarioID;
    const { areaForestal, tonCO2Equivalente } = req.body;

    if (areaForestal === undefined || tonCO2Equivalente === undefined) {
      return res.status(400).json({
        error: 'areaForestal y tonCO2Equivalente son requeridos',
        code: 'MISSING_FIELDS'
      });
    }

    const resultado = await db.query(
      `INSERT INTO RegistroImpacto (UsuarioID, AreaForestal, TonCO2Equivalente)
       VALUES (@usuarioID, @areaForestal, @tonCO2Equivalente);
       SELECT SCOPE_IDENTITY() as RegistroID;`,
      { usuarioID, areaForestal, tonCO2Equivalente }
    );

    const registroID = resultado.recordset[0].RegistroID;

    res.status(201).json({
      mensaje: 'Impacto individual guardado',
      registroID,
      areaForestal,
      tonCO2Equivalente
    });

  } catch (error) {
    console.error('Error al guardar impacto individual:', error);
    res.status(500).json({
      error: 'Error al guardar impacto individual',
      detalles: error.message
    });
  }
});

// =====================================================
// OBTENER HISTÓRICO DE IMPACTO DEL USUARIO
// =====================================================
router.get('/individual/historial', verificarToken, async (req, res) => {
  try {
    const usuarioID = req.usuario.usuarioID;

    const resultado = await db.query(
      `SELECT 
        RegistroID,
        AreaForestal,
        TonCO2Equivalente,
        FechaCalculo
       FROM RegistroImpacto
       WHERE UsuarioID = @usuarioID
       ORDER BY FechaCalculo DESC
       OFFSET 0 ROWS
       FETCH NEXT 50 ROWS ONLY`,
      { usuarioID }
    );

    res.json({
      registros: resultado.recordset,
      total: resultado.recordset.length
    });

  } catch (error) {
    console.error('Error al obtener histórico:', error);
    res.status(500).json({
      error: 'Error al obtener histórico',
      detalles: error.message
    });
  }
});

// =====================================================
// OBTENER IMPACTO PROMEDIO DEL USUARIO
// =====================================================
router.get('/individual/promedio', verificarToken, async (req, res) => {
  try {
    const usuarioID = req.usuario.usuarioID;

    const resultado = await db.query(
      `SELECT 
        COUNT(*) as TotalCalculos,
        AVG(AreaForestal) as AreaPromedio,
        AVG(TonCO2Equivalente) as CO2Promedio,
        MAX(AreaForestal) as AreaMaxima,
        MAX(TonCO2Equivalente) as CO2Maxima,
        MIN(AreaForestal) as AreaMinima,
        MIN(TonCO2Equivalente) as CO2Minima
       FROM RegistroImpacto
       WHERE UsuarioID = @usuarioID`,
      { usuarioID }
    );

    if (resultado.recordset[0].TotalCalculos === 0) {
      return res.json({
        totalCalculos: 0,
        areaPromedio: 0,
        co2Promedio: 0,
        mensaje: 'No hay registros de impacto para este usuario'
      });
    }

    const stats = resultado.recordset[0];
    res.json({
      totalCalculos: stats.TotalCalculos,
      areaPromedio: Math.round(stats.AreaPromedio * 100) / 100,
      co2Promedio: Math.round(stats.CO2Promedio * 100) / 100,
      areaMaxima: Math.round(stats.AreaMaxima * 100) / 100,
      co2Maxima: Math.round(stats.CO2Maxima * 100) / 100,
      areaMinima: Math.round(stats.AreaMinima * 100) / 100,
      co2Minima: Math.round(stats.CO2Minima * 100) / 100
    });

  } catch (error) {
    console.error('Error al calcular promedio:', error);
    res.status(500).json({
      error: 'Error al calcular promedio',
      detalles: error.message
    });
  }
});

module.exports = router;
