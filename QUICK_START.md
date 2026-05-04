# 🚀 GUÍA RÁPIDA DE INICIO

## Instalación en 5 minutos

### 1️⃣ Verificar SQL Server
```powershell
# Verificar que SQL Server está corriendo (Windows)
Get-Service MSSQLSERVER | Select Status
```

### 2️⃣ Crear la Base de Datos
```powershell
# Ejecutar el script SQL
cd "c:\Users\bryan\Desktop\Bosque-Digital"
sqlcmd -S localhost -U sa -P "tu_password" -i "database\schema.sql"
```

O manualmente:
1. Abre SQL Server Management Studio
2. Conecta a `localhost`
3. Abre `database/schema.sql`
4. Ejecuta (Ctrl + E)

### 3️⃣ Configurar variables de entorno
Edita `.env`:
```
DB_PASSWORD=tu_password_aqui
JWT_SECRET=cambia_esto_por_algo_seguro
```

### 4️⃣ Instalar dependencias
```powershell
npm install
```

### 5️⃣ Iniciar servidor
```powershell
npm run dev
```

Deberías ver:
```
╔════════════════════════════════════════╗
║  🌲 Bosque Digital - Backend           ║
║  Servidor corriendo en puerto 3000    ║
║  URL: http://localhost:3000           ║
╚════════════════════════════════════════╝
```

### 6️⃣ Abrir la aplicación
1. Abre `index.html` en tu navegador
2. O usa **Live Server** de VS Code
3. Haz clic en "Únete" para registrarte

---

## 🧪 Probar la Aplicación

### Crear una cuenta
1. Click en **"Únete"** en la navbar
2. Click en **"Regístrate"**
3. Llena el formulario
4. ¡Listo! Ya estás registrado

### Crear una publicación
1. En la sección de **Comunidad**
2. Click en **"¿Qué hay de nuevo?"**
3. Escribe un título y descripción
4. (Opcional) Sube una imagen
5. Click en **"Publicar"**

### Interactuar
- 💬 **Comentar**: Click en el botón "Comentar"
- ❤️ **Like**: Click en el botón "Like"
- 🗑️ **Eliminar**: Solo en tus publicaciones

---

## 🔧 Solución de problemas

### "Cannot connect to SQL Server"
```powershell
# Verificar que SQL Server está corriendo
Get-Service MSSQLSERVER | Start-Service

# Verificar conexión
sqlcmd -S localhost -U sa -P "tu_password" -Q "SELECT 1"
```

### "Port 3000 already in use"
```powershell
# Liberar el puerto
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# O usar otro puerto
$env:PORT=3001
npm run dev
```

### Las imágenes no se cargan
- Verifica que la carpeta `/uploads` existe
- Intenta con imágenes más pequeñas
- Revisa la consola del navegador (F12)

---

## 📚 Carpetas Importantes

```
/api/routes/        ← Rutas de la API
/config/            ← Configuración BD
/middleware/        ← Autenticación JWT
/css/               ← Estilos (incluyendo nueva comunidad)
/js/                ← JavaScripts (incluyendo nuevos módulos)
/database/          ← Script SQL
```

---

## 🎯 Próximos pasos

1. ✅ Base de datos creada
2. ✅ Servidor corriendo
3. ✅ Frontend integrado
4. 🔲 Desplegar a Azure (opcional)
5. 🔲 Agregar notificaciones en tiempo real
6. 🔲 Mejorar UI con más features

---

**¡Listo! Ahora tienes todo lo necesario para usar Bosque Digital** 🌲
