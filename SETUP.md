# 🌿 Bosque Digital - Sistema Completo de Comunidad

## 📋 Descripción General

Este proyecto es una **plataforma educativa e interactiva sobre deforestación** con un **sistema completo de comunidad** que permite:

- ✅ **Registro e Inicio de Sesión** con autenticación segura
- ✅ **Publicaciones** con imágenes (Base64)
- ✅ **Comentarios** en publicaciones
- ✅ **Sistema de Likes** para publicaciones
- ✅ **Perfiles de Usuario** con información personal
- ✅ **Base de Datos SQL Server** completa

---

## 🚀 GUÍA DE CONFIGURACIÓN RÁPIDA

### Paso 1: Instalar SQL Server (Si no lo tienes)

1. Descarga [SQL Server Express 2022](https://www.microsoft.com/sql-server/sql-server-downloads)
2. Instala con la instancia predeterminada (`SQLEXPRESS`)
3. Durante la instalación, establece un usuario `sa` con contraseña fuerte

### Paso 2: Crear la Base de Datos

1. Abre **SQL Server Management Studio (SSMS)**
2. Conéctate al servidor local
3. Abre el archivo `database/schema.sql`
4. **Ejecuta** el script (Ctrl + E)
5. Verifica que se creó la BD `BosqueDigital`

**Alternativa con PowerShell:**
```powershell
sqlcmd -S localhost -U sa -P "tu_password" -i "database/schema.sql"
```

### Paso 3: Configurar Variables de Entorno

1. Abre el archivo `.env` en la raíz del proyecto
2. Actualiza los valores:

```env
DB_SERVER=localhost
DB_PORT=1433
DB_NAME=BosqueDigital
DB_USER=sa
DB_PASSWORD=tu_password_real_aqui
DB_ENCRYPT=false
DB_TRUST_CERT=true
PORT=3000
JWT_SECRET=tu_clave_secreta_muy_larga_y_segura_2024_cambiar_esto
```

### Paso 4: Instalar Dependencias Node.js

```bash
# En la carpeta del proyecto
npm install
```

### Paso 5: Iniciar el Servidor

```bash
# Desarrollo (con auto-reload)
npm run dev

# Producción
npm start
```

**Resultado esperado:**
```
╔════════════════════════════════════════╗
║  🌲 Bosque Digital - Backend           ║
║  Servidor corriendo en puerto 3000    ║
║  URL: http://localhost:3000           ║
╚════════════════════════════════════════╝
```

### Paso 6: Usar la Aplicación

1. Abre `index.html` en tu navegador (o usa Live Server)
2. Haz clic en **"Únete"** para registrarte
3. ¡Comienza a crear publicaciones!

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
Bosque Digital/
├── database/
│   └── schema.sql              # Script SQL para crear BD
├── config/
│   └── database.js             # Configuración conexión BD
├── middleware/
│   └── auth.js                 # Middleware de autenticación JWT
├── api/
│   └── routes/
│       ├── auth.js             # Rutas de registro/login
│       ├── usuarios.js         # Rutas de perfiles
│       ├── publicaciones.js    # Rutas de publicaciones
│       ├── comentarios.js      # Rutas de comentarios
│       └── likes.js            # Rutas de likes
├── css/
│   ├── styles.css              # Estilos principales
│   └── comunidad-auth.css      # Estilos de comunidad
├── js/
│   ├── main.js                 # Lógica general
│   ├── api-client.js           # Cliente API
│   ├── auth-ui.js              # UI de autenticación
│   ├── comunidad-feed.js       # Feed de publicaciones
│   ├── map.js                  # Mapas
│   ├── calculator.js           # Calculadora
│   └── badges.js               # Sistema de badges
├── index.html                  # Página principal
├── server.js                   # Servidor Express
├── package.json                # Dependencias
├── .env                        # Variables de entorno
└── .gitignore                  # Archivos a ignorar

```

---

## 🔌 API ENDPOINTS

### Autenticación

```
POST   /api/auth/registro       - Registrar nuevo usuario
POST   /api/auth/login          - Iniciar sesión
GET    /api/auth/verificar      - Verificar token
```

### Usuarios

```
GET    /api/usuarios/perfil/:usuarioID      - Obtener perfil
PUT    /api/usuarios/perfil                 - Actualizar perfil
GET    /api/usuarios/lista                  - Listar todos los usuarios
```

### Publicaciones

```
POST   /api/publicaciones                   - Crear publicación
GET    /api/publicaciones                   - Obtener todas
GET    /api/publicaciones/:publicacionID    - Obtener una
GET    /api/publicaciones/usuario/:usuarioID - Obtener del usuario
PUT    /api/publicaciones/:publicacionID    - Actualizar
DELETE /api/publicaciones/:publicacionID    - Eliminar
```

### Comentarios

```
POST   /api/comentarios                          - Crear comentario
GET    /api/comentarios/publicacion/:publicacionID - Obtener comentarios
GET    /api/comentarios/usuario/:usuarioID       - Obtener del usuario
PUT    /api/comentarios/:comentarioID            - Actualizar
DELETE /api/comentarios/:comentarioID            - Eliminar
```

### Likes

```
POST   /api/likes/:publicacionID           - Dar like
DELETE /api/likes/:publicacionID           - Remover like
GET    /api/likes/:publicacionID           - Obtener likes
GET    /api/likes/usuario/:publicacionID   - Verificar si tiene like
```

---

## 🔐 SEGURIDAD

✅ **Contraseñas**: Hasheadas con bcrypt
✅ **Autenticación**: JWT (JSON Web Tokens)
✅ **Validación**: Express-validator
✅ **SQL Injection**: Parámetros vinculados
✅ **XSS**: Escapado de HTML en UI

---

## 📊 ESQUEMA DE BASE DE DATOS

### Tabla: Usuarios
```sql
- UsuarioID (PK)
- Nombre
- Email (UNIQUE)
- Contraseña (Hashed)
- Universidad
- Carrera
- FotoPerfil
- Biografia
- Telefono
- FechaRegistro
- Estado
- UltimoAcceso
```

### Tabla: Publicaciones
```sql
- PublicacionID (PK)
- UsuarioID (FK)
- Titulo
- Descripcion
- Imagen (Base64)
- FechaCreacion
- FechaActualizacion
- Estado
```

### Tabla: Comentarios
```sql
- ComentarioID (PK)
- PublicacionID (FK)
- UsuarioID (FK)
- Texto
- FechaCreacion
- FechaActualizacion
- Estado
```

### Tabla: Likes
```sql
- LikeID (PK)
- PublicacionID (FK)
- UsuarioID (FK)
- FechaCreacion
- CONSTRAINT: Un like por usuario/publicación
```

---

## 🛠️ TECNOLOGÍAS UTILIZADAS

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MSSQL** - Driver para SQL Server
- **bcrypt** - Hashing de contraseñas
- **jsonwebtoken** - Autenticación JWT
- **cors** - Control de acceso
- **multer** - Carga de archivos
- **express-validator** - Validación

### Frontend
- **HTML5** - Estructura
- **CSS3** - Estilos (Responsive)
- **JavaScript ES6+** - Lógica
- **Fetch API** - Comunicación con backend

### Base de Datos
- **SQL Server 2022 Express** - RDBMS

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: "Cannot connect to database"
```
✓ Verifica que SQL Server está corriendo
✓ Comprueba las credenciales en .env
✓ Asegúrate de que la BD existe
✓ Intenta conectar manualmente con SSMS
```

### Error: "Port 3000 already in use"
```
# Usa otro puerto
PORT=3001 npm start

# O libera el puerto (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Las imágenes no se suben
```
✓ Verifica que la carpeta /uploads existe
✓ Aumenta el límite en server.js si es necesario
✓ Usa Base64 en lugar de archivos
```

---

## 📝 EJEMPLO DE USO

### Registrarse
```javascript
await api.registro(
  'Juan Pérez',
  'juan@example.com',
  'MiContraseña123',
  'UNACH',
  'Ingeniería Ambiental'
);
```

### Crear Publicación
```javascript
await api.crearPublicacion(
  'Mi primer árbol plantado',
  'Hoy planté mi primer árbol nativo en Chiapas',
  imagenBase64
);
```

### Dar Like
```javascript
await api.darLike(publicacionID);
```

### Comentar
```javascript
await api.crearComentario(publicacionID, 'Excelente iniciativa!');
```

---

## 🚦 PRÓXIMAS MEJORAS

- [ ] Notificaciones en tiempo real
- [ ] Sistema de seguidores/amigos
- [ ] Búsqueda avanzada
- [ ] Reportar contenido inapropiado
- [ ] Sistema de badges/logros
- [ ] Integración con redes sociales
- [ ] Soporte para videos
- [ ] Chat privado entre usuarios

---

## 📞 SOPORTE

Para reportar bugs o sugerencias:
- 📧 Email: equipo@bosquedigital.mx
- 🐛 GitHub Issues: [Crear issue]
- 💬 Discord: [Enlace servidor]

---

## 📄 LICENCIA

Proyecto educativo - Universidad Autónoma de Chiapas (UNACH)  
2026 - Bosque Digital Team 🌲

---

**¡Gracias por ser parte de Bosque Digital!**
