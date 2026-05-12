# 🚀 INSTRUCCIONES PARA ACTUALIZAR BD AZURE - BOSQUE DIGITAL

## ✅ Cambios Agregados

El proyecto ahora incluye:

### 1. **Impacto Colectivo en Tiempo Real** 
- Nueva tabla: `ImpactoColectivo`
- Estadísticas globales: usuarios, árboles, voluntarios, CO₂
- Se carga dinámicamente desde la BD

### 2. **Registro de Impacto Individual**
- Nueva tabla: `RegistroImpacto`
- Guarda cada cálculo de impacto del usuario
- Histórico y análisis de tendencias

### 3. **5 Nuevos Endpoints API**
```
GET    /api/impacto/colectivo                    - Obtener estadísticas
PUT    /api/impacto/colectivo                    - Actualizar estadísticas
POST   /api/impacto/individual                   - Guardar cálculo personal
GET    /api/impacto/individual/historial         - Ver historial
GET    /api/impacto/individual/promedio          - Ver promedios
```

### 4. **Calculadora Integrada**
- Guarda automáticamente el impacto al calcular
- Actualiza impacto colectivo en tiempo real

---

## 📋 PASOS PARA ACTUALIZAR TU BD DE AZURE

### Opción 1: Ejecutar directamente desde Azure Portal

1. **Abre Azure Portal**: https://portal.azure.com
2. **Ve a tu SQL Server**: `newbestserverback2`
3. **Busca Query Editor**:
   - Clic en "Query Editor" en el menú izquierdo
   - Inicia sesión si se solicita
4. **Copia todo el contenido de `database/actualizar_impacto.sql`**
5. **Pégalo en Query Editor**
6. **Haz clic en "Run"**
7. ✅ Verás mensajes de éxito

### Opción 2: Usar SQL Server Management Studio (SSMS)

```
1. Abre SSMS
2. Conecta a: newbestserverback2.database.windows.net
   - Usuario: adminsql
   - Contraseña: Admin123
   - Base de datos: BosqueDigital

3. Abre archivo: database/actualizar_impacto.sql
4. Ejecuta (Ctrl + E o Ctrl + Shift + E)
5. Verifica que todo se ejecutó correctamente
```

### Opción 3: Usar Azure CLI (PowerShell)

```powershell
# Instalar Azure CLI si no lo tienes:
# https://learn.microsoft.com/en-us/cli/azure/install-azure-cli

# Ejecutar script SQL
sqlcmd -S newbestserverback2.database.windows.net `
       -U adminsql `
       -P Admin123 `
       -d BosqueDigital `
       -i "database/actualizar_impacto.sql"
```

---

## ✨ VERIFICAR QUE FUNCIONÓ

### En Azure Portal o SSMS:

```sql
-- Ver si las tablas se crearon
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_NAME IN ('ImpactoColectivo', 'RegistroImpacto');

-- Ver datos iniciales
SELECT * FROM ImpactoColectivo;

-- Contar registros
SELECT COUNT(*) as Total FROM RegistroImpacto;
```

### En la Aplicación:

1. **Abre `index.html` en tu navegador**
2. **Ve a la sección "Comunidad"**
3. **Verifica que aparecen las estadísticas**:
   - 1,247 Usuarios Registrados
   - 8,934 Árboles Plantados
   - 342 Voluntarios Activos
   - 56 Ton CO₂ Evitadas

4. **Si los números están animándose**: ✅ ¡Funciona!

---

## 🔄 FLUJO COMPLETO

```
Usuario calcula impacto
       ↓
JavaScript lo procesa
       ↓
Si está autenticado →  Guarda en RegistroImpacto (BD)
       ↓
Actualiza impacto colectivo
       ↓
Frontend recarga valores desde API
       ↓
Números se animan en tiempo real
```

---

## 📊 NUEVOS DATOS EN LA BD

### Tabla: ImpactoColectivo
```
ImpactoID | UsuariosRegistrados | ArbolesPlantados | VoluntariosActivos | TonCO2Evitadas | FechaActualizacion
1         | 1247                | 8934             | 342                | 56.00          | 2026-05-12 ...
```

### Tabla: RegistroImpacto (Ejemplo)
```
RegistroID | UsuarioID | AreaForestal | TonCO2Equivalente | FechaCalculo
1          | 1         | 450.5        | 2.25              | 2026-05-12 ...
2          | 2         | 320.0        | 1.60              | 2026-05-12 ...
```

---

## 🆘 SOLUCIONAR PROBLEMAS

### Error: "Cannot create index, table doesn't exist"
→ Ejecuta primero `database/schema.sql` completo

### Error: "Login failed"
→ Verifica credenciales en .env:
```
DB_USER=adminsql
DB_PASSWORD=Admin123
DB_SERVER=newbestserverback2.database.windows.net
```

### Los números no se actualizan
→ Verifica en DevTools (F12):
- Consola: busca errores de red
- Network: verifica que `/api/impacto/colectivo` retorna datos

### No aparecen los datos
→ Limpia caché: Ctrl+Shift+Delete en navegador

---

## 📝 RESUMEN DE CAMBIOS

| Componente | Cambios |
|-----------|---------|
| **BD** | +2 tablas, +1 índice |
| **Backend** | +1 archivo de rutas, +5 endpoints |
| **Frontend** | +1 archivo JS, +scripts modificados |
| **HTML** | +1 script cargado |
| **API Client** | +5 métodos nuevos |

---

## ✅ CHECKLIST FINAL

- [ ] Ejecuté el script SQL en Azure
- [ ] Verificué que se crearon las tablas
- [ ] Los números en "Impacto Colectivo" se cargan
- [ ] Puedo calcular impacto y se guarda
- [ ] No hay errores en la consola (F12)

---

¡**Listo!** 🎉 Tu BD de Azure está actualizada con las nuevas funcionalidades.

Si tienes preguntas, revisa:
- `SETUP.md` - Guía completa de instalación
- `RESUMEN_TECNICO.md` - Detalles técnicos
