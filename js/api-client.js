/**
 * js/api-client.js - Cliente para comunicación con la API del backend
 */

class APIClient {
  constructor(baseURL = 'http://localhost:3000/api') {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('token');
  }

  /**
   * Configurar headers con autenticación
   */
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Realizar petición HTTP
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Error ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en API:', error);
      throw error;
    }
  }

  // =====================================================
  // AUTENTICACIÓN
  // =====================================================

  async registro(nombre, email, contraseña, universidad, carrera) {
    const response = await this.request('/auth/registro', {
      method: 'POST',
      body: JSON.stringify({
        nombre,
        email,
        contraseña,
        universidad,
        carrera
      })
    });

    if (response.token) {
      this.token = response.token;
      localStorage.setItem('token', response.token);
      localStorage.setItem('usuarioID', response.usuarioID);
    }

    return response;
  }

  async login(email, contraseña) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        contraseña
      })
    });

    if (response.token) {
      this.token = response.token;
      localStorage.setItem('token', response.token);
      localStorage.setItem('usuarioID', response.usuarioID);
      localStorage.setItem('nombre', response.nombre);
      localStorage.setItem('email', response.email);
    }

    return response;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioID');
    localStorage.removeItem('nombre');
    localStorage.removeItem('email');
  }

  estaAutenticado() {
    return !!this.token;
  }

  obtenerUsuarioID() {
    return localStorage.getItem('usuarioID');
  }

  // =====================================================
  // USUARIOS
  // =====================================================

  async obtenerPerfil(usuarioID) {
    return this.request(`/usuarios/perfil/${usuarioID}`, {
      method: 'GET'
    });
  }

  async actualizarPerfil(nombre, biografia, carrera, universidad) {
    return this.request('/usuarios/perfil', {
      method: 'PUT',
      body: JSON.stringify({
        nombre,
        biografia,
        carrera,
        universidad
      })
    });
  }

  async listarUsuarios() {
    return this.request('/usuarios/lista', {
      method: 'GET'
    });
  }

  // =====================================================
  // PUBLICACIONES
  // =====================================================

  async crearPublicacion(titulo, descripcion, imagen) {
    return this.request('/publicaciones', {
      method: 'POST',
      body: JSON.stringify({
        titulo,
        descripcion,
        imagen
      })
    });
  }

  async obtenerPublicaciones(pagina = 1, limite = 10) {
    return this.request(`/publicaciones?pagina=${pagina}&limite=${limite}`, {
      method: 'GET'
    });
  }

  async obtenerPublicacionesPorUsuario(usuarioID) {
    return this.request(`/publicaciones/usuario/${usuarioID}`, {
      method: 'GET'
    });
  }

  async obtenerPublicacion(publicacionID) {
    return this.request(`/publicaciones/${publicacionID}`, {
      method: 'GET'
    });
  }

  async actualizarPublicacion(publicacionID, titulo, descripcion, imagen) {
    return this.request(`/publicaciones/${publicacionID}`, {
      method: 'PUT',
      body: JSON.stringify({
        titulo,
        descripcion,
        imagen
      })
    });
  }

  async eliminarPublicacion(publicacionID) {
    return this.request(`/publicaciones/${publicacionID}`, {
      method: 'DELETE'
    });
  }

  // =====================================================
  // COMENTARIOS
  // =====================================================

  async crearComentario(publicacionID, texto) {
    return this.request('/comentarios', {
      method: 'POST',
      body: JSON.stringify({
        publicacionID,
        texto
      })
    });
  }

  async obtenerComentarios(publicacionID) {
    return this.request(`/comentarios/publicacion/${publicacionID}`, {
      method: 'GET'
    });
  }

  async actualizarComentario(comentarioID, texto) {
    return this.request(`/comentarios/${comentarioID}`, {
      method: 'PUT',
      body: JSON.stringify({ texto })
    });
  }

  async eliminarComentario(comentarioID) {
    return this.request(`/comentarios/${comentarioID}`, {
      method: 'DELETE'
    });
  }

  // =====================================================
  // LIKES
  // =====================================================

  async darLike(publicacionID) {
    return this.request(`/likes/${publicacionID}`, {
      method: 'POST'
    });
  }

  async removerLike(publicacionID) {
    return this.request(`/likes/${publicacionID}`, {
      method: 'DELETE'
    });
  }

  async obtenerLikes(publicacionID) {
    return this.request(`/likes/${publicacionID}`, {
      method: 'GET'
    });
  }

  async verificarLike(publicacionID) {
    return this.request(`/likes/usuario/${publicacionID}`, {
      method: 'GET'
    });
  }
}

// Crear instancia global
const api = new APIClient();
