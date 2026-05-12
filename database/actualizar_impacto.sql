-- =====================================================
-- Script para AGREGAR NUEVAS FUNCIONALIDADES a BD existente
-- Bosque Digital - Impacto Colectivo e Individual
-- =====================================================

USE BosqueDigital;
GO

-- =====================================================
-- TABLA: ImpactoColectivo (Estadísticas globales)
-- =====================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ImpactoColectivo')
BEGIN
    CREATE TABLE ImpactoColectivo (
        ImpactoID INT PRIMARY KEY IDENTITY(1,1),
        UsuariosRegistrados INT DEFAULT 0,
        ArbolesPlantados INT DEFAULT 0,
        VoluntariosActivos INT DEFAULT 0,
        TonCO2Evitadas DECIMAL(10, 2) DEFAULT 0,
        FechaActualizacion DATETIME DEFAULT GETDATE()
    );
    PRINT '✓ Tabla ImpactoColectivo creada';
END
ELSE
BEGIN
    PRINT '⚠ Tabla ImpactoColectivo ya existe';
END

-- =====================================================
-- TABLA: RegistroImpacto (Histórico individual)
-- =====================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'RegistroImpacto')
BEGIN
    CREATE TABLE RegistroImpacto (
        RegistroID INT PRIMARY KEY IDENTITY(1,1),
        UsuarioID INT NOT NULL,
        AreaForestal DECIMAL(10, 2),
        TonCO2Equivalente DECIMAL(10, 2),
        FechaCalculo DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID) ON DELETE CASCADE
    );
    PRINT '✓ Tabla RegistroImpacto creada';
END
ELSE
BEGIN
    PRINT '⚠ Tabla RegistroImpacto ya existe';
END

-- =====================================================
-- CREAR ÍNDICES si no existen
-- =====================================================
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_RegistroImpacto_UsuarioID')
BEGIN
    CREATE INDEX IX_RegistroImpacto_UsuarioID ON RegistroImpacto(UsuarioID);
    PRINT '✓ Índice IX_RegistroImpacto_UsuarioID creado';
END

-- =====================================================
-- INICIALIZAR DATOS DE IMPACTO COLECTIVO
-- =====================================================
IF NOT EXISTS (SELECT * FROM ImpactoColectivo)
BEGIN
    INSERT INTO ImpactoColectivo (UsuariosRegistrados, ArbolesPlantados, VoluntariosActivos, TonCO2Evitadas)
    VALUES (1247, 8934, 342, 56);
    PRINT '✓ Datos iniciales de impacto colectivo insertados';
END
ELSE
BEGIN
    PRINT '⚠ Datos de impacto colectivo ya existen';
END

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================
PRINT '';
PRINT '╔════════════════════════════════════════╗';
PRINT '║ ✓ ACTUALIZACIÓN COMPLETADA            ║';
PRINT '║   Nuevas funcionalidades agregadas:   ║';
PRINT '║   • Impacto Colectivo                 ║';
PRINT '║   • Registro Individual de Impacto    ║';
PRINT '║   • Índices de optimización           ║';
PRINT '╚════════════════════════════════════════╝';

-- Mostrar estado de las tablas
SELECT 'ImpactoColectivo' AS Tabla, COUNT(*) AS Registros FROM ImpactoColectivo
UNION ALL
SELECT 'RegistroImpacto', COUNT(*) FROM RegistroImpacto;

GO
