# ✅ CHECKLIST DE INSTALACIÓN - BOSQUE DIGITAL

## REQUISITOS PREVIOS

- [ ] Windows 10/11 o macOS/Linux
- [ ] Node.js 16+ instalado (descarga desde nodejs.org)
- [ ] SQL Server 2022 Express instalado
- [ ] Visual Studio Code o editor de código
- [ ] Git (opcional)

**Verificar:**
```powershell
node --version      # v16.0.0 o superior
npm --version       # 8.0.0 o superior
sqlcmd -?           # Debe reconocer el comando
```

---

## FASE 1: PREPARACIÓN DE BASE DE DATOS ⚙️

### 1.1 Verificar SQL Server
- [ ] Abre SQL Server Configuration Manager
- [ ] Verifica que MSSQLSERVER está corriendo
- [ ] Nota: Si está "Stopped", haz clic en "Start"

**O en PowerShell:**
```powershell
# Ver estado
Get-Service MSSQLSERVER | Select Status

# Iniciar si está detenido
Start-Service MSSQLSERVER
```

### 1.2 Crear la Base de Datos
- [ ] Descarga y extrae el proyecto completo
- [ ] Abre PowerShell en la carpeta del proyecto
- [ ] Ejecuta:
```powershell
sqlcmd -S localhost -U sa -P "tu_password_aqui" -i "database\schema.sql"
```

**Resultado esperado:**
```
Changed database context to 'BosqueDigital'.
✓ Se crearon todas las tablas exitosamente
```

### 1.3 Verificar en SSMS (Opcional)
- [ ] Abre SQL Server Management Studio
- [ ] Conecta a `localhost`
- [ ] Usuario: `sa`
- [ ] Contraseña: `tu_password`
- [ ] En Object Explorer, verifica: BosqueDigital → Tables
- [ ] Deberías ver 5 tablas: Usuarios, Publicaciones, Comentarios, Likes, Sesiones

---

## FASE 2: CONFIGURACIÓN DEL BACKEND 🚀

### 2.1 Configurar Variables de Entorno
- [ ] Abre `.env` en la carpeta raíz
- [ ] Actualiza estos valores:

```env
DB_SERVER=localhost
DB_PORT=1433
DB_NAME=BosqueDigital
DB_USER=sa
DB_PASSWORD=TU_PASSWORD_AQUI       ← REEMPLAZA
DB_ENCRYPT=false
DB_TRUST_CERT=true
PORT=3000
JWT_SECRET=cambia_esto_por_algo_seguro_muy_largo_2024  ← REEMPLAZA
CORS_ORIGIN=http://localhost:3000
```

- [ ] Guarda el archivo

### 2.2 Instalar Dependencias
- [ ] Abre PowerShell en la carpeta del proyecto
- [ ] Ejecuta:
```powershell
npm install
```

- [ ] Espera a que termine (puede tardar 1-2 minutos)
- [ ] Verifica que se creó carpeta `node_modules` (~200MB)

### 2.3 Iniciar Servidor
- [ ] En la misma PowerShell, ejecuta:
```powershell
npm run dev
```

- [ ] Espera a ver este mensaje:
```
╔════════════════════════════════════════╗
║  🌲 Bosque Digital - Backend           ║
║  Servidor corriendo en puerto 3000    ║
║  URL: http://localhost:3000           ║
╚════════════════════════════════════════╝
```

- [ ] **NO cierres esta ventana** (el servidor debe seguir corriendo)

---

## FASE 3: VERIFICAR FRONTEND 🌐

### 3.1 Servir la Aplicación
- [ ] Abre una **NUEVA** PowerShell/Terminal
- [ ] Ve a la carpeta del proyecto
- [ ] Opción A - Usa Live Server (recomendado):
  - [ ] Abre `index.html` en VS Code
  - [ ] Clic derecho → "Open with Live Server"
  - [ ] Se abrirá en navegador automáticamente

- [ ] Opción B - Abre directamente:
  - [ ] `file:///.../Bosque-Digital/index.html` en navegador

### 3.2 Verifica que la Aplicación Carga
- [ ] Ves el navbar con "Bosque Digital"
- [ ] Ves el botón "Únete" en la navbar
- [ ] En consola (F12) no hay errores rojos críticos

---

## FASE 4: PRUEBAS FUNCIONALES ✅

### 4.1 Registro de Usuario
- [ ] Haz clic en "Únete" en la navbar
- [ ] Haz clic en "Regístrate"
- [ ] Rellena el formulario:
  - Nombre: `Juan Pérez`
  - Email: `juan@example.com`
  - Universidad: `UNACH`
  - Carrera: `Ingeniería Ambiental`
  - Contraseña: `TestPassword123`
  - Confirmar: `TestPassword123`
- [ ] Click "Regístrate"
- [ ] ✅ Deberías ver: "¡Bienvenido Juan Pérez!"

**Verifica en BD:**
```sql
SELECT * FROM Usuarios
```

### 4.2 Crear Publicación
- [ ] En la página, ve a sección "Comunidad"
- [ ] Click "¿Qué hay de nuevo?"
- [ ] Rellena:
  - Título: `Mi primer árbol`
  - Descripción: `Planté un árbol nativo en Chiapas`
- [ ] Click "Publicar"
- [ ] ✅ Deberías ver tu publicación en el feed

**Verifica en BD:**
```sql
SELECT * FROM Publicaciones
```

### 4.3 Comentar
- [ ] En la publicación, click "Comentar"
- [ ] Escribe: `¡Excelente iniciativa!`
- [ ] Click "Comentar"
- [ ] ✅ Deberías ver tu comentario en la lista

**Verifica en BD:**
```sql
SELECT * FROM Comentarios
```

### 4.4 Dar Like
- [ ] En la publicación, click ❤️ "Like"
- [ ] ✅ El contador debería cambiar a 1

**Verifica en BD:**
```sql
SELECT * FROM Likes
```

### 4.5 Login/Logout
- [ ] Haz logout (click en dropdown del usuario)
- [ ] Haz login con el email y contraseña que creaste
- [ ] ✅ Deberías volver a estar autenticado

---

## FASE 5: SOLUCIÓN DE PROBLEMAS 🔧

### Error: "Cannot connect to database"
```
SOLUCIÓN:
1. Verifica que SQL Server está corriendo
   Get-Service MSSQLSERVER | Select Status
2. Verifica las credenciales en .env
3. Prueba conectar manualmente en SSMS
4. Reinicia SQL Server si es necesario
```

### Error: "Port 3000 already in use"
```
SOLUCIÓN:
1. Cambia PORT en .env a 3001
2. O libera el puerto:
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
```

### El frontend no ve el backend
```
SOLUCIÓN:
1. Verifica que el servidor Node está corriendo
2. Abre consola (F12) y busca errores de conexión
3. Verifica CORS en .env
4. Intenta: fetch('http://localhost:3000/api/health')
```

### Las publicaciones/comentarios no aparecen
```
SOLUCIÓN:
1. Abre F12 → Network → refresca la página
2. Busca llamadas a /api/publicaciones
3. Si el status es 401: token expirado, haz logout/login
4. Si el status es 500: error del servidor, revisa consola Node.js
```

---

## FASE 6: OPTIMIZACIÓN (OPCIONAL) 🎯

### 6.1 Ambiente de Desarrollo
- [ ] Instala `nodemon` para auto-reload:
  ```powershell
  npm install -g nodemon
  ```

### 6.2 Tests (Opcional)
- [ ] Usa `EJEMPLOS_API.js` para probar:
  1. Abre consola (F12)
  2. Copia una función del archivo
  3. Ejecuta: `ejemploRegistro()`

### 6.3 Despliegue (Fase 2)
- [ ] Para desplegar a Azure:
  - Ve a `SETUP.md`
  - Busca sección "Despliegue Azure"

---

## FASE 7: BACKUP & SEGURIDAD 🔐

### 7.1 Hacer Backup de BD
```sql
-- Backup automático (SQL Server)
BACKUP DATABASE BosqueDigital 
TO DISK = 'C:\Backups\BosqueDigital.bak'
```

### 7.2 Cambiar JWT_SECRET
- [ ] En `.env`, reemplaza con algo único:
  ```
  JWT_SECRET=tu_string_aleatorio_super_seguro_de_64_caracteres_minimo
  ```

### 7.3 Variables .env en Producción
- [ ] **NUNCA** guardes `.env` en Git
- [ ] Usa variables de entorno del servidor
- [ ] En Azure: usa Key Vault

---

## 📊 CHECKLIST FINAL

### Aplicación
- [ ] Registro funciona ✅
- [ ] Login funciona ✅
- [ ] Crear publicación funciona ✅
- [ ] Ver publicaciones funciona ✅
- [ ] Comentar funciona ✅
- [ ] Like funciona ✅
- [ ] No hay errores en consola (F12) ✅
- [ ] Responde rápido (< 1s) ✅

### Base de Datos
- [ ] BD creada en SQL Server ✅
- [ ] Todas las tablas existen ✅
- [ ] Datos se guardan correctamente ✅
- [ ] Sin errores en queries ✅

### Backend
- [ ] Servidor corriendo en puerto 3000 ✅
- [ ] API responde en http://localhost:3000/api/health ✅
- [ ] Conexión BD activa ✅
- [ ] Sin errores en consola ✅

### Frontend
- [ ] HTML se carga correctamente ✅
- [ ] Estilos CSS aplicados ✅
- [ ] JavaScript funciona sin errores ✅
- [ ] Responsive en móvil ✅

---

## 🎉 ¡COMPLETADO!

Si todas las casillas están marcadas, **¡Tu aplicación Bosque Digital está lista para usar!**

### Próximos Pasos:
1. Invita a usuarios a registrarse
2. Prueba todas las funcionalidades
3. Recopila feedback
4. Considera desplegar en producción

---

**¿Necesitas ayuda?**
- Consulta `QUICK_START.md` para inicio rápido
- Consulta `SETUP.md` para configuración avanzada
- Consulta `RESUMEN_TECNICO.md` para detalles técnicos
- Usa `EJEMPLOS_API.js` para probar la API
