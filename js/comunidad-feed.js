/**
 * js/comunidad-feed.js - Gestión de feed de publicaciones, comentarios y likes
 */

class ComunidadFeed {
  constructor() {
    this.publicaciones = [];
    this.usuarioActual = localStorage.getItem('usuarioID');
    this.init();
  }

  async init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.crearElementosFeed();
    this.cargarPublicaciones();
    this.configurarEventos();
  }

  /**
   * Crear estructura HTML del feed
   */
  crearElementosFeed() {
    const seccionComunidad = document.getElementById('comunidad');
    if (!seccionComunidad) return;

    const feedSlot = document.getElementById('comunidad-feed-slot') || seccionComunidad;

    // Agregar contenedor de feed si no existe
    if (!document.getElementById('feed-container')) {
      const feedHTML = `
        <div id="feed-container" class="feed-container">
          <div id="feed-filter-bar" class="feed-filter-bar hidden">
            <span>Mostrando solo tus publicaciones</span>
            <button type="button" class="btn-clear-filter" id="btn-clear-filter">
              Ver todas
            </button>
          </div>
          <!-- Modal de crear publicación -->
          <div id="modal-crear-publicacion" class="modal">
            <div class="modal-content modal-crear-pub">
              <button class="modal-close" aria-label="Cerrar">&times;</button>
              <h3>Crear Publicación</h3>
              <form id="form-crear-publicacion">
                <div class="form-group">
                  <label for="titulo-pub">Título</label>
                  <input type="text" id="titulo-pub" placeholder="Título de tu publicación" required>
                </div>

                <div class="form-group">
                  <label for="descripcion-pub">Descripción</label>
                  <textarea id="descripcion-pub" placeholder="Cuéntale a la comunidad..." rows="5" required></textarea>
                </div>

                <div class="form-group">
                  <label for="imagen-pub">Imagen (Base64)</label>
                  <input type="file" id="imagen-pub" accept="image/*">
                  <small>Selecciona una imagen para tu publicación (opcional)</small>
                </div>

                <button type="submit" class="btn-primary">Publicar</button>
              </form>
            </div>
          </div>

          <!-- Botón para crear publicación -->
          <div class="crear-publicacion-widget">
            <div class="widget-header">
              <img id="foto-perfil-actual" src="https://via.placeholder.com/40" alt="Tu foto" class="avatar-small">
              <button id="btn-nueva-publicacion" class="btn-new-post">
                ¿Qué hay de nuevo?
              </button>
            </div>
          </div>

          <!-- Feed de publicaciones -->
          <div id="publicaciones-feed" class="publicaciones-feed">
            <div class="loading">Cargando publicaciones...</div>
          </div>

          <!-- Modal para comentarios -->
          <div id="modal-comentarios" class="modal">
            <div class="modal-content modal-comentarios">
              <button class="modal-close" aria-label="Cerrar">&times;</button>
              <h3>Comentarios</h3>
              <div id="comentarios-lista" class="comentarios-lista"></div>
              <div class="form-comentario">
                <textarea id="nuevo-comentario" placeholder="Escribe un comentario..." rows="3"></textarea>
                <button id="btn-enviar-comentario" class="btn-primary">Comentar</button>
              </div>
            </div>
          </div>
        </div>
      `;
      feedSlot.insertAdjacentHTML('beforeend', feedHTML);
    }
  }

  /**
   * Configurar eventos
   */
  configurarEventos() {
    // Botón para crear publicación
    const btnNuevaPublicacion = document.getElementById('btn-nueva-publicacion');
    if (btnNuevaPublicacion) {
      btnNuevaPublicacion.addEventListener('click', () => {
        if (!api.estaAutenticado()) {
          this.mostrarModalLogin();
        } else {
          this.abrirModalCrearPublicacion();
        }
      });
    }

    // Formulario de crear publicación
    const formCrearPublicacion = document.getElementById('form-crear-publicacion');
    if (formCrearPublicacion) {
      formCrearPublicacion.addEventListener('submit', (e) => this.handleCrearPublicacion(e));
    }

    const btnClearFilter = document.getElementById('btn-clear-filter');
    if (btnClearFilter) {
      btnClearFilter.addEventListener('click', () => this.cargarPublicaciones());
    }

    // Cerrar modales
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.target.closest('.modal').style.display = 'none';
      });
    });

    // Convertir imagen a base64
    const imagenInput = document.getElementById('imagen-pub');
    if (imagenInput) {
      imagenInput.addEventListener('change', (e) => this.convertirImagenABase64(e));
    }
  }

  /**
   * Cargar publicaciones desde la API
   */
  async cargarPublicaciones() {
    try {
      const response = await api.obtenerPublicaciones(1, 20);
      this.publicaciones = response.publicaciones;
      this.renderizarPublicaciones();
      this.actualizarFiltro(false);
    } catch (error) {
      console.error('Error al cargar publicaciones:', error);
      const feedContainer = document.getElementById('publicaciones-feed');
      if (feedContainer) {
        feedContainer.innerHTML = '<div class="error">Error al cargar publicaciones</div>';
      }
    }
  }

  /**
   * Renderizar publicaciones en el feed
   */
  renderizarPublicaciones() {
    const feedContainer = document.getElementById('publicaciones-feed');
    if (!feedContainer) return;

    if (this.publicaciones.length === 0) {
      feedContainer.innerHTML = '<div class="empty-feed">No hay publicaciones aún. ¡Sé el primero en publicar!</div>';
      return;
    }

    feedContainer.innerHTML = this.publicaciones.map(pub => this.crearTarjetaPublicacion(pub)).join('');

    // Agregar event listeners
    this.agregarEventosPublicaciones();
  }

  /**
   * Crear HTML de una publicación
   */
  crearTarjetaPublicacion(pub) {
    const esDelUsuario = pub.UsuarioID === parseInt(this.usuarioActual);
    const tieneImagen = pub.Imagen ? 'with-image' : '';
    const fechaFormato = new Date(pub.FechaCreacion).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return `
      <article class="publicacion-card ${tieneImagen}" data-publicacion-id="${pub.PublicacionID}">
        <!-- Header de publicación -->
        <div class="pub-header">
          <div class="pub-autor">
            <img src="${pub.FotoPerfil || 'https://via.placeholder.com/40'}" alt="${pub.Nombre}" class="avatar-small">
            <div class="pub-autor-info">
              <strong>${pub.Nombre}</strong>
              <small>${fechaFormato}</small>
            </div>
          </div>
          ${esDelUsuario ? `
            <div class="pub-acciones">
              <button class="btn-icon" onclick="comunidadFeed.editarPublicacion(${pub.PublicacionID})">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn-icon" onclick="comunidadFeed.eliminarPublicacion(${pub.PublicacionID})">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          ` : ''}
        </div>

        <!-- Contenido -->
        <div class="pub-content">
          <h4>${this.escaparHTML(pub.Titulo)}</h4>
          <p>${this.escaparHTML(pub.Descripcion)}</p>
        </div>

        <!-- Imagen si existe -->
        ${pub.Imagen ? `<img src="${pub.Imagen}" alt="${pub.Titulo}" class="pub-imagen">` : ''}

        <!-- Stats -->
        <div class="pub-stats">
          <span><i class="fas fa-heart"></i> <span class="count-likes">${pub.TotalLikes}</span> likes</span>
          <span><i class="fas fa-comment"></i> <span class="count-comments">${pub.TotalComentarios}</span> comentarios</span>
        </div>

        <!-- Acciones -->
        <div class="pub-actions">
          <button class="btn-action btn-like" onclick="comunidadFeed.toggleLike(${pub.PublicacionID})" title="Dar like">
            <i class="far fa-heart"></i> Like
          </button>
          <button class="btn-action btn-comment" onclick="comunidadFeed.abrirComentarios(${pub.PublicacionID})" title="Comentar">
            <i class="fas fa-comment"></i> Comentar
          </button>
          <button class="btn-action btn-share" title="Compartir">
            <i class="fas fa-share"></i> Compartir
          </button>
        </div>
      </article>
    `;
  }

  /**
   * Agregar event listeners a publicaciones
   */
  agregarEventosPublicaciones() {
    document.querySelectorAll('.btn-like').forEach(btn => {
      btn.addEventListener('click', async function() {
        if (!api.estaAutenticado()) {
          comunidadFeed.mostrarModalLogin();
          return;
        }
        // Lógica del like se maneja en toggleLike
      });
    });
  }

  /**
   * Toggle like de una publicación
   */
  async toggleLike(publicacionID) {
    if (!api.estaAutenticado()) {
      this.mostrarModalLogin();
      return;
    }

    try {
      // Verificar si ya tiene like
      const verificacion = await api.verificarLike(publicacionID);
      
      if (verificacion.tienelike) {
        await api.removerLike(publicacionID);
      } else {
        await api.darLike(publicacionID);
      }

      // Recargar publicación
      this.actualizarPublicacion(publicacionID);
    } catch (error) {
      console.error('Error al dar/remover like:', error);
    }
  }

  /**
   * Abrir modal de comentarios
   */
  async abrirComentarios(publicacionID) {
    try {
      const comentarios = await api.obtenerComentarios(publicacionID);
      const modalComentarios = document.getElementById('modal-comentarios');
      const listaComentarios = document.getElementById('comentarios-lista');

      listaComentarios.innerHTML = comentarios.map(com => `
        <div class="comentario-item">
          <img src="${com.FotoPerfil || 'https://via.placeholder.com/30'}" alt="${com.Nombre}" class="avatar-tiny">
          <div class="comentario-contenido">
            <strong>${com.Nombre}</strong>
            <p>${this.escaparHTML(com.Texto)}</p>
            <small>${new Date(com.FechaCreacion).toLocaleDateString('es-MX')}</small>
          </div>
        </div>
      `).join('');

      // Guardar ID de publicación en el formulario
      document.getElementById('nuevo-comentario').dataset.publicacionId = publicacionID;
      document.getElementById('btn-enviar-comentario').onclick = () => this.enviarComentario(publicacionID);

      modalComentarios.style.display = 'block';
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
    }
  }

  /**
   * Enviar comentario
   */
  async enviarComentario(publicacionID) {
    if (!api.estaAutenticado()) {
      this.mostrarModalLogin();
      return;
    }

    const textoComentario = document.getElementById('nuevo-comentario').value;

    if (!textoComentario.trim()) {
      alert('Por favor escribe un comentario');
      return;
    }

    try {
      await api.crearComentario(publicacionID, textoComentario);
      document.getElementById('nuevo-comentario').value = '';
      await this.abrirComentarios(publicacionID);
      this.actualizarPublicacion(publicacionID);
    } catch (error) {
      console.error('Error al enviar comentario:', error);
      alert('Error al enviar comentario');
    }
  }

  /**
   * Crear publicación
   */
  async handleCrearPublicacion(e) {
    e.preventDefault();

    if (!api.estaAutenticado()) {
      this.mostrarModalLogin();
      return;
    }

    const titulo = document.getElementById('titulo-pub').value;
    const descripcion = document.getElementById('descripcion-pub').value;
    const imagenInput = document.getElementById('imagen-base64');
    const imagen = imagenInput ? imagenInput.value : null;

    try {
      await api.crearPublicacion(titulo, descripcion, imagen);
      document.getElementById('form-crear-publicacion').reset();
      document.getElementById('modal-crear-publicacion').style.display = 'none';
      await this.cargarPublicaciones();
    } catch (error) {
      console.error('Error al crear publicación:', error);
      alert('Error al crear la publicación');
    }
  }

  /**
   * Convertir imagen a Base64
   */
  convertirImagenABase64(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const inputOculto = document.getElementById('imagen-base64') || 
        Object.assign(document.createElement('input'), {
          type: 'hidden',
          id: 'imagen-base64'
        });

      if (!document.getElementById('imagen-base64')) {
        document.getElementById('form-crear-publicacion').appendChild(inputOculto);
      }

      inputOculto.value = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  /**
   * Actualizar una publicación después de cambios
   */
  async actualizarPublicacion(publicacionID) {
    const pub = this.publicaciones.find(p => p.PublicacionID === publicacionID);
    if (!pub) return;

    const response = await api.obtenerPublicacion(publicacionID);
    Object.assign(pub, response);
    this.renderizarPublicaciones();
  }

  /**
   * Editar publicación
   */
  editarPublicacion(publicacionID) {
    const pub = this.publicaciones.find(p => p.PublicacionID === publicacionID);
    if (!pub) return;

    const nuevoTitulo = prompt('Nuevo título:', pub.Titulo);
    if (nuevoTitulo === null) return;

    const nuevaDescripcion = prompt('Nueva descripción:', pub.Descripcion);
    if (nuevaDescripcion === null) return;

    api.actualizarPublicacion(publicacionID, nuevoTitulo, nuevaDescripcion, pub.Imagen)
      .then(() => this.actualizarPublicacion(publicacionID))
      .catch(err => {
        console.error('Error al editar:', err);
        alert('Error al editar la publicación');
      });
  }

  /**
   * Eliminar publicación
   */
  async eliminarPublicacion(publicacionID) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta publicación?')) return;

    try {
      await api.eliminarPublicacion(publicacionID);
      this.publicaciones = this.publicaciones.filter(p => p.PublicacionID !== publicacionID);
      this.renderizarPublicaciones();
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error al eliminar la publicación');
    }
  }

  /**
   * Abrir modal de crear publicación
   */
  abrirModalCrearPublicacion() {
    document.getElementById('modal-crear-publicacion').style.display = 'block';
  }

  /**
   * Mostrar modal de login
   */
  mostrarModalLogin() {
    alert('Por favor inicia sesión o regístrate para realizar esta acción');
    if (window.authUI) {
      window.authUI.abrirModal();
    }
  }

  async mostrarMisPublicaciones() {
    if (!api.estaAutenticado()) {
      this.mostrarModalLogin();
      return;
    }

    const usuarioID = api.obtenerUsuarioID();
    try {
      const publicaciones = await api.obtenerPublicacionesPorUsuario(usuarioID);
      this.publicaciones = Array.isArray(publicaciones) ? publicaciones : publicaciones.publicaciones;
      this.renderizarPublicaciones();
      this.actualizarFiltro(true);
    } catch (error) {
      console.error('Error al cargar publicaciones del usuario:', error);
      alert('Error al cargar tus publicaciones');
    }
  }

  actualizarFiltro(activo) {
    const bar = document.getElementById('feed-filter-bar');
    if (!bar) return;
    bar.classList.toggle('hidden', !activo);
  }

  /**
   * Escapar HTML para prevenir XSS
   */
  escaparHTML(texto) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return texto.replace(/[&<>"']/g, m => map[m]);
  }
}

// Instancia global
let comunidadFeed;

// Inicializar cuando esté lista la API
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    comunidadFeed = new ComunidadFeed();
  });
} else {
  comunidadFeed = new ComunidadFeed();
}
