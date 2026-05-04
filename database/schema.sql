-- =====================================================
-- BOSQUE DIGITAL - Script de Base de Datos SQL Server
-- =====================================================

-- Crear base de datos
CREATE DATABASE BosqueDigital;
GO

USE BosqueDigital;
GO

-- =====================================================
-- TABLA: Usuarios
-- =====================================================
CREATE TABLE Usuarios (
    UsuarioID INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    Email NVARCHAR(150) NOT NULL UNIQUE,
    Contraseña NVARCHAR(255) NOT NULL,
    Universidad NVARCHAR(150) NULL,
    Carrera NVARCHAR(100) NULL,
    FotoPerfil NVARCHAR(MAX) NULL,
    Biografia NVARCHAR(500) NULL,
    Telefono NVARCHAR(20) NULL,
    FechaRegistro DATETIME DEFAULT GETDATE(),
    Estado BIT DEFAULT 1, -- 1: Activo, 0: Inactivo
    UltimoAcceso DATETIME NULL
);

-- =====================================================
-- TABLA: Publicaciones
-- =====================================================
CREATE TABLE Publicaciones (
    PublicacionID INT PRIMARY KEY IDENTITY(1,1),
    UsuarioID INT NOT NULL,
    Titulo NVARCHAR(200) NOT NULL,
    Descripcion NVARCHAR(MAX) NOT NULL,
    Imagen NVARCHAR(MAX) NULL,
    FechaCreacion DATETIME DEFAULT GETDATE(),
    FechaActualizacion DATETIME DEFAULT GETDATE(),
    Estado BIT DEFAULT 1, -- 1: Activa, 0: Eliminada
    FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID) ON DELETE CASCADE
);

-- =====================================================
-- TABLA: Comentarios
-- =====================================================
CREATE TABLE Comentarios (
    ComentarioID INT PRIMARY KEY IDENTITY(1,1),
    PublicacionID INT NOT NULL,
    UsuarioID INT NOT NULL,
    Texto NVARCHAR(MAX) NOT NULL,
    FechaCreacion DATETIME DEFAULT GETDATE(),
    FechaActualizacion DATETIME DEFAULT GETDATE(),
    Estado BIT DEFAULT 1, -- 1: Activo, 0: Eliminado
    FOREIGN KEY (PublicacionID) REFERENCES Publicaciones(PublicacionID) ON DELETE CASCADE,
    FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID) ON DELETE NO ACTION
);

-- =====================================================
-- TABLA: Likes
-- =====================================================
CREATE TABLE Likes (
    LikeID INT PRIMARY KEY IDENTITY(1,1),
    PublicacionID INT NOT NULL,
    UsuarioID INT NOT NULL,
    FechaCreacion DATETIME DEFAULT GETDATE(),
    UNIQUE(PublicacionID, UsuarioID), -- Un usuario solo puede dar un like por publicación
    FOREIGN KEY (PublicacionID) REFERENCES Publicaciones(PublicacionID) ON DELETE CASCADE,
    FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID) ON DELETE NO ACTION
);

-- =====================================================
-- TABLA: Sesiones (para mantener token/sesiones activas)
-- =====================================================
CREATE TABLE Sesiones (
    SesionID INT PRIMARY KEY IDENTITY(1,1),
    UsuarioID INT NOT NULL,
    Token NVARCHAR(MAX) NOT NULL,
    FechaCreacion DATETIME DEFAULT GETDATE(),
    FechaExpiracion DATETIME NOT NULL,
    Estado BIT DEFAULT 1,
    FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID) ON DELETE CASCADE
);

-- =====================================================
-- ÍNDICES para optimización
-- =====================================================
CREATE INDEX IX_Publicaciones_UsuarioID ON Publicaciones(UsuarioID);
CREATE INDEX IX_Comentarios_PublicacionID ON Comentarios(PublicacionID);
CREATE INDEX IX_Comentarios_UsuarioID ON Comentarios(UsuarioID);
CREATE INDEX IX_Likes_PublicacionID ON Likes(PublicacionID);
CREATE INDEX IX_Likes_UsuarioID ON Likes(UsuarioID);
CREATE INDEX IX_Sesiones_UsuarioID ON Sesiones(UsuarioID);

GO

-- =====================================================
-- VISTAS para consultas frecuentes
-- =====================================================

-- Vista: Publicaciones con información del usuario y contadores
CREATE VIEW vw_PublicacionesConDetalles AS
SELECT 
    p.PublicacionID,
    p.UsuarioID,
    u.Nombre,
    u.FotoPerfil,
    p.Titulo,
    p.Descripcion,
    p.Imagen,
    p.FechaCreacion,
    (SELECT COUNT(*) FROM Likes WHERE PublicacionID = p.PublicacionID) AS TotalLikes,
    (SELECT COUNT(*) FROM Comentarios WHERE PublicacionID = p.PublicacionID) AS TotalComentarios
FROM Publicaciones p
INNER JOIN Usuarios u ON p.UsuarioID = u.UsuarioID
WHERE p.Estado = 1;

GO

-- Vista: Comentarios con información del usuario
CREATE VIEW vw_ComentariosConDetalles AS
SELECT 
    c.ComentarioID,
    c.PublicacionID,
    c.UsuarioID,
    u.Nombre,
    u.FotoPerfil,
    c.Texto,
    c.FechaCreacion,
    c.FechaActualizacion
FROM Comentarios c
INNER JOIN Usuarios u ON c.UsuarioID = u.UsuarioID
WHERE c.Estado = 1;

GO

-- =====================================================
-- DATOS DE PRUEBA
-- =====================================================
INSERT INTO Usuarios (Nombre, Email, Contraseña, Universidad, Carrera, Biografia)
VALUES 
('Juan Pérez', 'juan@example.com', 'hashed_password_123', 'UNACH', 'Ingeniería Ambiental', 'Apasionado por la conservación'),
('María López', 'maria@example.com', 'hashed_password_456', 'UNACH', 'Biología', 'Especialista en flora local');

INSERT INTO Publicaciones (UsuarioID, Titulo, Descripcion)
VALUES 
(1, 'Proyecto de reforestación en Chiapas', 'Iniciativa para plantar 1000 árboles nativos'),
(2, 'Especies endémicas de Chiapas', 'Investigación sobre fauna local en peligro');

INSERT INTO Comentarios (PublicacionID, UsuarioID, Texto)
VALUES 
(1, 2, 'Excelente iniciativa, me gustaría participar'),
(2, 1, 'Muy interesante tu investigación');

INSERT INTO Likes (PublicacionID, UsuarioID)
VALUES 
(1, 2),
(2, 1);

GO
