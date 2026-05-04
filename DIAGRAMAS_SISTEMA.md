# 📊 DIAGRAMA DEL SISTEMA BOSQUE DIGITAL

## Arquitectura General

```
┌─────────────────────────────────────────────────────────────────┐
│                         NAVEGADOR WEB                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  HTML + CSS + JavaScript                                 │  │
│  │  - index.html (página principal)                         │  │
│  │  - api-client.js (cliente HTTP)                          │  │
│  │  - auth-ui.js (modal login/registro)                     │  │
│  │  - comunidad-feed.js (feed publicaciones)                │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────┬──────────────────────────────────────────┘
                         │ HTTP/JSON (Fetch API)
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SERVIDOR NODE.JS/EXPRESS                     │
│                          :3000                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Middlewares                                             │  │
│  │  - CORS                                                  │  │
│  │  - JSON Parser                                           │  │
│  │  - JWT Verification                                      │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Rutas API (/api/*)                                      │  │
│  │  ├── auth.js (Registro, Login)                           │  │
│  │  ├── usuarios.js (Perfiles)                              │  │
│  │  ├── publicaciones.js (CRUD)                             │  │
│  │  ├── comentarios.js (CRUD)                               │  │
│  │  └── likes.js (Like/Unlike)                              │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────┬──────────────────────────────────────────┘
                         │ mssql Driver
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              BASE DE DATOS SQL SERVER 2022 EXPRESS              │
│              BosqueDigital                                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Tablas:                                                 │  │
│  │  - Usuarios (Autenticación, perfiles)                    │  │
│  │  - Publicaciones (Posts)                                 │  │
│  │  - Comentarios (Respuestas)                              │  │
│  │  - Likes (Reacciones)                                    │  │
│  │  - Sesiones (Tokens JWT)                                 │  │
│  │                                                          │  │
│  │  Vistas:                                                 │  │
│  │  - vw_PublicacionesConDetalles                           │  │
│  │  - vw_ComentariosConDetalles                             │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Flujo de Autenticación

```
┌─────────────┐
│   Usuario   │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ 1. Hace Click en    │
│    "Únete/Regístrate│
└─────┬───────────────┘
      │
      ▼
┌──────────────────────────┐
│ 2. Abre Modal de         │
│    Registro/Login        │
│    (auth-ui.js)          │
└─────┬────────────────────┘
      │
      ▼
┌──────────────────────────┐
│ 3. Rellena Formulario    │
│    - Nombre/Email        │
│    - Contraseña          │
│    - Universidad (opt)   │
└─────┬────────────────────┘
      │
      ▼
┌──────────────────────────────┐
│ 4. api.registro() o          │
│    api.login()               │
│    (api-client.js)           │
└─────┬────────────────────────┘
      │ POST /api/auth/registro
      │ o POST /api/auth/login
      ▼
┌──────────────────────────────┐
│ 5. Backend valida datos      │
│    (express-validator)       │
└─────┬────────────────────────┘
      │
      ▼
┌──────────────────────────────┐
│ 6. Verifica email único      │
│    (SQL)                     │
└─────┬────────────────────────┘
      │
      ▼
┌──────────────────────────────┐
│ 7. Hash password con bcrypt  │
│    10 rondas                 │
└─────┬────────────────────────┘
      │
      ▼
┌──────────────────────────────┐
│ 8. Inserta en BD o verifica  │
│    contraseña               │
└─────┬────────────────────────┘
      │
      ▼
┌──────────────────────────────┐
│ 9. Genera JWT Token          │
│    exp: 7 días               │
└─────┬────────────────────────┘
      │
      ▼
┌──────────────────────────────┐
│ 10. Retorna JSON con token   │
│     { usuarioID, token }     │
└─────┬────────────────────────┘
      │
      ▼
┌──────────────────────────────┐
│ 11. Guarda en localStorage   │
│     - token                  │
│     - usuarioID              │
│     - nombre                 │
│     - email                  │
└─────┬────────────────────────┘
      │
      ▼
┌──────────────────────────────┐
│ 12. Cierra modal             │
│ 13. Actualiza navbar         │
│ 14. ¡Usuario autenticado!    │
└──────────────────────────────┘
```

---

## Flujo de Crear Publicación

```
┌──────────────────────┐
│ Usuario Autenticado  │
└──────┬───────────────┘
       │
       ▼
┌────────────────────────────┐
│ 1. Click "¿Qué hay nuevo?" │
└─────┬──────────────────────┘
      │
      ▼
┌───────────────────────────────────────┐
│ 2. Abre Modal Crear Publicación       │
│    (comunidad-feed.js)                │
└─────┬─────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────┐
│ 3. Rellena:                                 │
│    - Título                                 │
│    - Descripción                            │
│    - Imagen (opcional)                      │
└─────┬───────────────────────────────────────┘
      │
      ▼
┌───────────────────────────────────────┐
│ 4. Si sube imagen: Convierte a Base64 │
│    (FileReader API)                   │
└─────┬─────────────────────────────────┘
      │
      ▼
┌───────────────────────────────────────┐
│ 5. api.crearPublicacion()             │
│    (api-client.js)                    │
└─────┬─────────────────────────────────┘
      │ POST /api/publicaciones
      │ Headers: Authorization: Bearer <token>
      │ Body: { titulo, descripcion, imagen }
      ▼
┌─────────────────────────────────────┐
│ 6. Backend verifica JWT              │
│    Middleware: verificarToken()      │
└─────┬───────────────────────────────┘
      │
      ▼
┌──────────────────────────────────────┐
│ 7. Valida datos                      │
│    - Titulo no vacío                 │
│    - Descripcion no vacía            │
└─────┬────────────────────────────────┘
      │
      ▼
┌──────────────────────────────────────┐
│ 8. Inserta en tabla Publicaciones    │
│    INSERT INTO Publicaciones (...)   │
└─────┬────────────────────────────────┘
      │
      ▼
┌──────────────────────────────────────┐
│ 9. Retorna PublicacionID             │
└─────┬────────────────────────────────┘
      │
      ▼
┌──────────────────────────────────────┐
│ 10. Frontend actualiza feed          │
│     comunidad-feed.renderizar        │
│     Puedo ver mi publicación!        │
└──────────────────────────────────────┘
```

---

## Flujo de Comentar

```
┌──────────────────────────────┐
│ Usuario lee Publicación      │
│ Click "Comentar"             │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ 1. Abre Modal de Comentarios │
│    (comunidad-feed.js)       │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ 2. Carga comentarios previos │
│    GET /api/comentarios/...  │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ 3. Escribe comentario        │
│    en textarea               │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ 4. Click "Comentar"          │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ 5. api.crearComentario()             │
│    POST /api/comentarios             │
│    { publicacionID, texto }          │
└──────┬────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ 6. Backend verifica:                 │
│    - JWT válido                      │
│    - PublicacionID existe            │
│    - Texto no vacío                  │
└──────┬────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ 7. Inserta en Comentarios            │
│    INSERT INTO Comentarios (...)     │
└──────┬────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ 8. Retorna ComentarioID              │
└──────┬────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ 9. Frontend:                         │
│    - Recarga comentarios             │
│    - Limpia textarea                 │
│    - Muestra comentario nuevo        │
└──────────────────────────────────────┘
```

---

## Flujo de Like

```
┌─────────────────────────┐
│ Usuario lee Publicación │
│ Click Botón ❤️ Like    │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ 1. Verifica autenticación       │
│    api.estaAutenticado()        │
└──────┬────────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ 2. Verifica si ya dio like      │
│    GET /api/likes/usuario/:id   │
└──────┬────────────────────────────┘
       │
       ▼
   ┌───┴────┐
   │        │
   │ ✓ No  │ ✓ Sí
   │        │
   ▼        ▼
┌──────┐  ┌──────────┐
│ Dar  │  │ Remover  │
│ Like │  │ Like     │
└──┬───┘  └────┬─────┘
   │          │
   ▼          ▼
┌─────────────────────────┐
│ POST /api/likes/:id     │
│ DELETE /api/likes/:id   │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Backend:                 │
│ - Verifica JWT           │
│ - Valida publicación     │
│ - Inserta/Elimina en BD  │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Retorna { totalLikes }   │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Frontend:                │
│ - Anima botón ❤️         │
│ - Actualiza contador     │
│ - Muestra nuevo total    │
└──────────────────────────┘
```

---

## Estructura de Datos (Relaciones)

```
Usuarios (1)
    │
    ├──────────────(1:N)──────────── Publicaciones
    │                                    │
    │                                    ├──────────(1:N)────── Comentarios
    │                                    │                          │
    │                                    │                          └──(N:1)──┐
    │                                    │                                     │
    │                                    └──────────(1:N)────── Likes        │
    │                                                                │        │
    │                                                                └──(N:1)─┤
    │                                                                         │
    ├────────────────(1:N)────────────── Comentarios ◄──────────────────────┘
    │
    ├────────────────(1:N)────────────── Likes
    │
    └────────────────(1:N)────────────── Sesiones
```

---

## Flujo de Datos en la Aplicación

```
        ┌─────────────────────┐
        │   Usuario Final     │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────┐
        │  Frontend (Browser) │
        │  ├─ HTML5           │
        │  ├─ CSS3            │
        │  └─ JavaScript ES6+ │
        └──────────┬──────────┘
                   │ JSON/HTTP
        ┌──────────▼──────────────────────┐
        │  Express Server (:3000)        │
        │  ├─ Rutas API                  │
        │  ├─ Middleware                 │
        │  └─ Lógica de Negocio          │
        └──────────┬──────────────────────┘
                   │ SQL/mssql
        ┌──────────▼──────────────────────┐
        │  SQL Server 2022 Express        │
        │  ├─ Tablas                      │
        │  ├─ Índices                     │
        │  ├─ Vistas                      │
        │  └─ Relaciones FK               │
        └─────────────────────────────────┘
```

---

## Ciclo de Vida de una Sesión

```
1. REGISTRO/LOGIN
   ├─ Usuario ingresa credenciales
   ├─ Backend valida y hashea
   ├─ Genera JWT token
   └─ Cliente guarda en localStorage

2. PETICIONES AUTENTICADAS
   ├─ Cada petición incluye Bearer token
   ├─ Middleware verifica JWT
   ├─ Si válido → permite acceso
   └─ Si inválido → responde 401

3. OPERACIONES CRUD
   ├─ Crear
   ├─ Leer
   ├─ Actualizar (solo propietario)
   └─ Eliminar (solo propietario)

4. LOGOUT
   ├─ Usuario hace click en logout
   ├─ Frontend elimina token de localStorage
   ├─ Servidor invalida sesión (opcional)
   └─ Usuario redirigido a login

5. RENOVACIÓN TOKEN
   ├─ Token válido por 7 días
   ├─ Si expira → debe login nuevamente
   └─ Se puede agregar refresh token
```

---

Este diagrama muestra la arquitectura completa del sistema Bosque Digital.
