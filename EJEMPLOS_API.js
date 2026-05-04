/**
 * EJEMPLOS DE USO DE LA API
 * Copiar y pegar en la consola del navegador (F12) para probar
 */

// =====================================================
// AUTENTICACIÓN
// =====================================================

// 1. Registrar un nuevo usuario
async function ejemploRegistro() {
  try {
    const resultado = await api.registro(
      'Juan Pérez',
      'juan@example.com',
      'MiPassword123',
      'UNACH',
      'Ingeniería Ambiental'
    );
    console.log('✅ Registro exitoso:', resultado);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// 2. Iniciar sesión
async function ejemploLogin() {
  try {
    const resultado = await api.login('juan@example.com', 'MiPassword123');
    console.log('✅ Login exitoso:', resultado);
    console.log('Token guardado:', localStorage.getItem('token'));
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// 3. Verificar si estoy autenticado
function ejemploVerificarAutenticacion() {
  const estaAutenticado = api.estaAutenticado();
  console.log('¿Autenticado?', estaAutenticado);
  console.log('Mi UsuarioID:', api.obtenerUsuarioID());
}

// =====================================================
// USUARIOS
// =====================================================

// 4. Obtener perfil de un usuario
async function ejemploObtenerPerfil() {
  try {
    const usuarioID = 1; // Cambia por el ID real
    const perfil = await api.obtenerPerfil(usuarioID);
    console.log('✅ Perfil obtenido:', perfil);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// 5. Actualizar mi perfil
async function ejemploActualizarPerfil() {
  try {
    const resultado = await api.actualizarPerfil(
      'Juan Pérez Actualizado',
      'Me encanta la naturaleza y la programación',
      'Ingeniería Ambiental',
      'UNACH'
    );
    console.log('✅ Perfil actualizado:', resultado);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// 6. Listar todos los usuarios
async function ejemploListarUsuarios() {
  try {
    const usuarios = await api.listarUsuarios();
    console.log('✅ Usuarios:', usuarios);
    usuarios.forEach(u => {
      console.log(`- ${u.Nombre} (${u.Email})`);
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// =====================================================
// PUBLICACIONES
// =====================================================

// 7. Crear una publicación
async function ejemploCrearPublicacion() {
  try {
    const resultado = await api.crearPublicacion(
      'Mi primer árbol plantado',
      'Hoy planté mi primer árbol nativo en Chiapas. Es importante actuar para proteger nuestros bosques.',
      null // Sin imagen (o proporciona una en Base64)
    );
    console.log('✅ Publicación creada:', resultado);
    console.log('PublicacionID:', resultado.publicacionID);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// 8. Obtener todas las publicaciones
async function ejemploObtenerPublicaciones() {
  try {
    const resultado = await api.obtenerPublicaciones(1, 10);
    console.log('✅ Publicaciones:', resultado);
    console.log(`Total: ${resultado.total} publicaciones`);
    resultado.publicaciones.forEach(p => {
      console.log(`\n📰 ${p.Titulo}`);
      console.log(`   Por: ${p.Nombre}`);
      console.log(`   Likes: ${p.TotalLikes} | Comentarios: ${p.TotalComentarios}`);
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// 9. Obtener una publicación específica
async function ejemploObtenerPublicacion() {
  try {
    const publicacionID = 1; // Cambia por el ID real
    const publicacion = await api.obtenerPublicacion(publicacionID);
    console.log('✅ Publicación:', publicacion);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// 10. Obtener publicaciones de un usuario
async function ejemploObtenerPublicacionesPorUsuario() {
  try {
    const usuarioID = 1; // Cambia por el ID real
    const publicaciones = await api.obtenerPublicacionesPorUsuario(usuarioID);
    console.log(`✅ Publicaciones del usuario ${usuarioID}:`, publicaciones);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// 11. Actualizar una publicación
async function ejemploActualizarPublicacion() {
  try {
    const publicacionID = 1; // Cambia por el ID real
    const resultado = await api.actualizarPublicacion(
      publicacionID,
      'Título actualizado',
      'Descripción actualizada',
      null
    );
    console.log('✅ Publicación actualizada:', resultado);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// 12. Eliminar una publicación
async function ejemploEliminarPublicacion() {
  try {
    if (confirm('¿Estás seguro de que quieres eliminar la publicación?')) {
      const publicacionID = 1; // Cambia por el ID real
      const resultado = await api.eliminarPublicacion(publicacionID);
      console.log('✅ Publicación eliminada:', resultado);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// =====================================================
// COMENTARIOS
// =====================================================

// 13. Crear un comentario
async function ejemploCrearComentario() {
  try {
    const publicacionID = 1; // Cambia por el ID real
    const resultado = await api.crearComentario(
      publicacionID,
      '¡Excelente iniciativa! Me gustaría unirme al próximo evento de reforestación.'
    );
    console.log('✅ Comentario creado:', resultado);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// 14. Obtener comentarios de una publicación
async function ejemploObtenerComentarios() {
  try {
    const publicacionID = 1; // Cambia por el ID real
    const comentarios = await api.obtenerComentarios(publicacionID);
    console.log('✅ Comentarios:', comentarios);
    comentarios.forEach(c => {
      console.log(`\n💬 ${c.Nombre}:`);
      console.log(`   "${c.Texto}"`);
      console.log(`   ${new Date(c.FechaCreacion).toLocaleString('es-MX')}`);
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// 15. Actualizar un comentario
async function ejemploActualizarComentario() {
  try {
    const comentarioID = 1; // Cambia por el ID real
    const resultado = await api.actualizarComentario(
      comentarioID,
      'Texto del comentario actualizado'
    );
    console.log('✅ Comentario actualizado:', resultado);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// 16. Eliminar un comentario
async function ejemploEliminarComentario() {
  try {
    const comentarioID = 1; // Cambia por el ID real
    const resultado = await api.eliminarComentario(comentarioID);
    console.log('✅ Comentario eliminado:', resultado);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// =====================================================
// LIKES
// =====================================================

// 17. Dar like a una publicación
async function ejemploDarLike() {
  try {
    const publicacionID = 1; // Cambia por el ID real
    const resultado = await api.darLike(publicacionID);
    console.log('✅ Like dado:', resultado);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// 18. Remover like
async function ejemploRemoverLike() {
  try {
    const publicacionID = 1; // Cambia por el ID real
    const resultado = await api.removerLike(publicacionID);
    console.log('✅ Like removido:', resultado);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// 19. Obtener likes de una publicación
async function ejemploObtenerLikes() {
  try {
    const publicacionID = 1; // Cambia por el ID real
    const resultado = await api.obtenerLikes(publicacionID);
    console.log(`✅ ${resultado.total} personas dieron like:`);
    resultado.likes.forEach(like => {
      console.log(`- ${like.Nombre}`);
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// 20. Verificar si ya di like
async function ejemploVerificarLike() {
  try {
    const publicacionID = 1; // Cambia por el ID real
    const resultado = await api.verificarLike(publicacionID);
    console.log('✅ ¿Ya diste like?', resultado.tienelike ? 'Sí' : 'No');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// =====================================================
// SCRIPT DE PRUEBA COMPLETO
// =====================================================

async function ejecutarPruebasCompletas() {
  console.log('🚀 Iniciando pruebas del API...\n');

  // 1. Registrarse
  console.log('📝 1. Registrando usuario...');
  try {
    await api.registro(
      'Usuario Prueba ' + new Date().getTime(),
      'prueba' + new Date().getTime() + '@example.com',
      'TestPassword123',
      'UNACH',
      'Carrera Test'
    );
    console.log('✅ Usuario registrado\n');
  } catch (e) {
    console.log('ℹ️ Usuario ya existe\n');
  }

  // 2. Listar publicaciones
  console.log('📰 2. Listando publicaciones...');
  const publicaciones = await api.obtenerPublicaciones(1, 5);
  console.log(`✅ ${publicaciones.publicaciones.length} publicaciones encontradas\n`);

  // 3. Crear publicación
  console.log('✍️ 3. Creando publicación...');
  const nuevaPub = await api.crearPublicacion(
    'Publicación de prueba',
    'Este es un test del sistema de publicaciones',
    null
  );
  console.log(`✅ Publicación creada con ID: ${nuevaPub.publicacionID}\n`);

  // 4. Dar like
  console.log('❤️ 4. Dando like...');
  try {
    const like = await api.darLike(nuevaPub.publicacionID);
    console.log(`✅ Like dado! Total: ${like.totalLikes}\n`);
  } catch (e) {
    console.log('ℹ️ No se pudo dar like\n');
  }

  // 5. Crear comentario
  console.log('💬 5. Creando comentario...');
  const comentario = await api.crearComentario(
    nuevaPub.publicacionID,
    'Este es un comentario de prueba'
  );
  console.log(`✅ Comentario creado con ID: ${comentario.comentarioID}\n`);

  console.log('🎉 ¡Pruebas completadas exitosamente!');
}

// =====================================================
// CÓMO USAR ESTOS EJEMPLOS
// =====================================================

/*
1. Abre la aplicación en tu navegador
2. Abre la consola (F12 o Ctrl+Shift+I)
3. Copia y pega cualquiera de estas funciones
4. Ejecuta: ejemplo<NombreFuncion>()

EJEMPLOS:
- ejemploRegistro()
- ejemploLogin()
- ejemploCrearPublicacion()
- ejemploObtenerPublicaciones()
- ejemploDarLike()
- ejemploCrearComentario()
- ejecutarPruebasCompletas()

NOTA: Asegúrate de que:
- El servidor está corriendo (npm run dev)
- La BD está creada
- Estés autenticado (token en localStorage)
*/
