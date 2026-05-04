/**
 * js/auth-ui.js - Interfaz de usuario para autenticación (registro/login)
 */

class AuthUI {
  constructor() {
    this.modalRegistro = null;
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
    this.crearModales();
    this.configurarEventos();
    this.actualizarNavbar();
  }

  /**
   * Crear modales de autenticación
   */
  crearModales() {
    const body = document.body;

    const modalHTML = `
      <!-- Modal de Registro/Login -->
      <div id="modal-auth" class="modal">
        <div class="modal-content modal-auth">
          <button class="modal-close" aria-label="Cerrar">&times;</button>
          
          <div class="auth-tabs">
            <button class="auth-tab-btn active" data-tab="login">Inicia Sesión</button>
            <button class="auth-tab-btn" data-tab="registro">Regístrate</button>
          </div>

          <!-- Tab: Login -->
          <div id="tab-login" class="auth-tab-content active">
            <h3>Inicia Sesión</h3>
            <form id="form-login">
              <div class="form-group">
                <label for="login-email">Email</label>
                <input type="email" id="login-email" placeholder="tu@email.com" required>
              </div>
              <div class="form-group">
                <label for="login-password">Contraseña</label>
                <input type="password" id="login-password" placeholder="••••••••" required>
              </div>
              <button type="submit" class="btn-primary full-width">Inicia Sesión</button>
              <p class="form-hint">¿No tienes cuenta? <a href="#" class="switch-tab" data-tab="registro">Regístrate aquí</a></p>
            </form>
          </div>

          <!-- Tab: Registro -->
          <div id="tab-registro" class="auth-tab-content">
            <h3>Regístrate</h3>
            <form id="form-registro">
              <div class="form-group">
                <label for="registro-nombre">Nombre</label>
                <input type="text" id="registro-nombre" placeholder="Tu nombre" required>
              </div>
              <div class="form-group">
                <label for="registro-email">Email</label>
                <input type="email" id="registro-email" placeholder="tu@email.com" required>
              </div>
              <div class="form-group">
                <label for="registro-universidad">Universidad (opcional)</label>
                <input type="text" id="registro-universidad" placeholder="Ej: UNACH">
              </div>
              <div class="form-group">
                <label for="registro-carrera">Carrera (opcional)</label>
                <input type="text" id="registro-carrera" placeholder="Ej: Ingeniería Ambiental">
              </div>
              <div class="form-group">
                <label for="registro-password">Contraseña</label>
                <input type="password" id="registro-password" placeholder="••••••••" required>
              </div>
              <div class="form-group">
                <label for="registro-password-confirm">Confirmar Contraseña</label>
                <input type="password" id="registro-password-confirm" placeholder="••••••••" required>
              </div>
              <button type="submit" class="btn-primary full-width">Regístrate</button>
              <p class="form-hint">¿Ya tienes cuenta? <a href="#" class="switch-tab" data-tab="login">Inicia sesión aquí</a></p>
            </form>
          </div>
        </div>
      </div>

      <!-- Modal de Perfil -->
      <div id="modal-perfil" class="modal">
        <div class="modal-content modal-perfil">
          <button class="modal-close" aria-label="Cerrar">&times;</button>
          <h3>Mi Perfil</h3>
          <form id="form-perfil">
            <div class="form-group">
              <label for="perfil-nombre">Nombre</label>
              <input type="text" id="perfil-nombre" required>
            </div>
            <div class="form-group">
              <label for="perfil-email">Email</label>
              <input type="email" id="perfil-email" disabled>
            </div>
            <div class="form-group">
              <label for="perfil-universidad">Universidad</label>
              <input type="text" id="perfil-universidad" placeholder="Ej: UNACH">
            </div>
            <div class="form-group">
              <label for="perfil-carrera">Carrera</label>
              <input type="text" id="perfil-carrera" placeholder="Ej: Ingeniería Ambiental">
            </div>
            <div class="form-group">
              <label for="perfil-biografia">Biografía</label>
              <textarea id="perfil-biografia" rows="4" placeholder="Cuéntanos sobre ti"></textarea>
            </div>
            <button type="submit" class="btn-primary">Guardar cambios</button>
          </form>
        </div>
      </div>

      <!-- Modal de Configuración -->
      <div id="modal-config" class="modal">
        <div class="modal-content modal-config">
          <button class="modal-close" aria-label="Cerrar">&times;</button>
          <h3>Configuración</h3>
          <form id="form-config">
            <label class="config-toggle">
              <input type="checkbox" id="config-notifs">
              Mostrar notificaciones
            </label>
            <label class="config-toggle">
              <input type="checkbox" id="config-animaciones">
              Animaciones del sitio
            </label>
            <button type="submit" class="btn-primary">Guardar preferencias</button>
          </form>
          <button type="button" id="btn-reset-badges" class="btn-primary">
            Restablecer insignias
          </button>
        </div>
      </div>
    `;

    body.insertAdjacentHTML('beforeend', modalHTML);
    this.modalRegistro = document.getElementById('modal-auth');
  }

  /**
   * Configurar eventos
   */
  configurarEventos() {
    // Botón "Únete" en navbar
    const btnUnete = document.querySelector('.nav-cta');
    if (btnUnete) {
      btnUnete.addEventListener('click', (e) => {
        e.preventDefault();
        this.abrirModal();
      });
    }

    // Tabs de autenticación
    document.querySelectorAll('.auth-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => this.cambiarTab(btn.dataset.tab));
    });

    // Links para cambiar tab
    document.querySelectorAll('.switch-tab').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.cambiarTab(link.dataset.tab);
      });
    });

    // Formulario de login
    document.getElementById('form-login')?.addEventListener('submit', (e) => this.handleLogin(e));

    // Formulario de registro
    document.getElementById('form-registro')?.addEventListener('submit', (e) => this.handleRegistro(e));

    // Botón logout
    document.getElementById('btn-logout')?.addEventListener('click', () => this.handleLogout());

    // Cerrar modales
    document.querySelectorAll('.modal .modal-close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        if (modal) modal.style.display = 'none';
      });
    });

    // Cerrar modal al clickear fuera
    this.modalRegistro?.addEventListener('click', (e) => {
      if (e.target === this.modalRegistro) {
        this.cerrarModal();
      }
    });

    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal && modal.id !== 'modal-auth') {
          modal.style.display = 'none';
        }
      });
    });

    // Dropdown de usuario
    const navUserBtn = document.getElementById('navUserBtn');
    if (navUserBtn) {
      navUserBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleDropdown();
      });
    }

    document.addEventListener('click', (e) => {
      const navUser = document.getElementById('navUser');
      if (navUser && !navUser.contains(e.target)) {
        this.cerrarDropdown();
      }
    });

    document.getElementById('dropdown-perfil')?.addEventListener('click', () => this.abrirPerfil());
    document.getElementById('dropdown-mis-publicaciones')?.addEventListener('click', () => this.abrirMisPublicaciones());
    document.getElementById('dropdown-configuracion')?.addEventListener('click', () => this.abrirConfiguracion());

    document.getElementById('form-perfil')?.addEventListener('submit', (e) => this.guardarPerfil(e));
    document.getElementById('form-config')?.addEventListener('submit', (e) => this.guardarConfiguracion(e));
    document.getElementById('btn-reset-badges')?.addEventListener('click', () => this.resetearInsignias());
  }

  /**
   * Cambiar entre tabs de login/registro
   */
  cambiarTab(tabName) {
    // Cambiar tab activo
    document.querySelectorAll('.auth-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    document.querySelectorAll('.auth-tab-content').forEach(content => {
      content.classList.toggle('active', content.id === `tab-${tabName}`);
    });
  }

  /**
   * Manejar login
   */
  async handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const contraseña = document.getElementById('login-password').value;

    try {
      const response = await api.login(email, contraseña);
      this.loginExitoso(response);
    } catch (error) {
      console.error('Error en login:', error);
      alert(error.message || 'Error al iniciar sesión');
    }
  }

  /**
   * Manejar registro
   */
  async handleRegistro(e) {
    e.preventDefault();

    const nombre = document.getElementById('registro-nombre').value;
    const email = document.getElementById('registro-email').value;
    const password = document.getElementById('registro-password').value;
    const passwordConfirm = document.getElementById('registro-password-confirm').value;
    const universidad = document.getElementById('registro-universidad').value;
    const carrera = document.getElementById('registro-carrera').value;

    if (password !== passwordConfirm) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await api.registro(nombre, email, password, universidad, carrera);
      localStorage.setItem('nombre', nombre);
      localStorage.setItem('email', email);
      this.loginExitoso(response);
    } catch (error) {
      console.error('Error en registro:', error);
      alert(error.message || 'Error al registrarse');
    }
  }

  /**
   * Login exitoso
   */
  loginExitoso(response) {
    this.cerrarModal();
    this.actualizarNavbar();
    this.cerrarDropdown();
    
    // Limpiar formularios
    document.getElementById('form-login')?.reset();
    document.getElementById('form-registro')?.reset();

    // Notificar éxito
    const nombre = localStorage.getItem('nombre') || response.nombre || 'Usuario';
    const email = localStorage.getItem('email') || response.email || '';
    this.persistirUsuarioComunidad(nombre, email);
    alert(`¡Bienvenido ${nombre}!`);

    // Recargar página o actualizar UI
    if (comunidadFeed) {
      comunidadFeed.cargarPublicaciones();
    }
  }

  /**
   * Manejar logout
   */
  handleLogout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      api.logout();
      this.actualizarNavbar();
      this.cerrarDropdown();
      alert('Has cerrado sesión');
    }
  }

  /**
   * Actualizar navbar con estado de autenticación
   */
  actualizarNavbar() {
    const btnUnete = document.querySelector('.nav-cta');
    const navUser = document.getElementById('navUser');
    const userDropdown = document.getElementById('user-dropdown');

    if (api.estaAutenticado()) {
      // Mostrar dropdown
      if (btnUnete) btnUnete.style.display = 'none';
      if (navUser) navUser.classList.remove('hidden');
      if (userDropdown) {
        userDropdown.style.display = 'block';
        
        // Actualizar info del usuario
        const nombre = localStorage.getItem('nombre') || 'Usuario';
        const email = localStorage.getItem('email') || 'email@example.com';
        
        document.getElementById('dropdown-nombre').textContent = nombre;
        document.getElementById('dropdown-email').textContent = email;

        const navUserName = document.getElementById('navUserName');
        if (navUserName) navUserName.textContent = nombre;
      }
    } else {
      // Mostrar botón únete
      if (btnUnete) btnUnete.style.display = 'flex';
      if (navUser) navUser.classList.add('hidden');
      if (userDropdown) userDropdown.style.display = 'none';
      const navUserBtn = document.getElementById('navUserBtn');
      if (navUserBtn) navUserBtn.setAttribute('aria-expanded', 'false');
    }
  }

  /**
   * Abrir modal de autenticación
   */
  abrirModal() {
    this.modalRegistro.style.display = 'block';
  }

  /**
   * Cerrar modal de autenticación
   */
  cerrarModal() {
    this.modalRegistro.style.display = 'none';
  }

  /**
   * Cerrar dropdown de usuario
   */
  cerrarDropdown() {
    const userDropdown = document.getElementById('user-dropdown');
    if (userDropdown) {
      userDropdown.classList.remove('open');
    }
    const navUserBtn = document.getElementById('navUserBtn');
    if (navUserBtn) navUserBtn.setAttribute('aria-expanded', 'false');
  }

  toggleDropdown() {
    const userDropdown = document.getElementById('user-dropdown');
    if (!userDropdown) return;
    userDropdown.classList.toggle('open');
    const navUserBtn = document.getElementById('navUserBtn');
    if (navUserBtn) {
      navUserBtn.setAttribute('aria-expanded', userDropdown.classList.contains('open'));
    }
  }

  async abrirPerfil() {
    if (!api.estaAutenticado()) {
      this.abrirModal();
      return;
    }

    const modalPerfil = document.getElementById('modal-perfil');
    if (!modalPerfil) return;

    try {
      const usuarioID = api.obtenerUsuarioID();
      const perfil = await api.obtenerPerfil(usuarioID);
      document.getElementById('perfil-nombre').value = perfil.Nombre || '';
      document.getElementById('perfil-email').value = perfil.Email || '';
      document.getElementById('perfil-universidad').value = perfil.Universidad || '';
      document.getElementById('perfil-carrera').value = perfil.Carrera || '';
      document.getElementById('perfil-biografia').value = perfil.Biografia || '';
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      alert('No se pudo cargar el perfil');
      return;
    }

    modalPerfil.style.display = 'block';
    this.cerrarDropdown();
  }

  abrirMisPublicaciones() {
    if (!api.estaAutenticado()) {
      this.abrirModal();
      return;
    }

    if (comunidadFeed) {
      comunidadFeed.mostrarMisPublicaciones();
    }

    const feedSection = document.getElementById('comunidad-feed-section');
    if (feedSection) {
      feedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    this.cerrarDropdown();
  }

  abrirConfiguracion() {
    const modalConfig = document.getElementById('modal-config');
    if (!modalConfig) return;

    const notifs = localStorage.getItem('bd_notificaciones');
    const animaciones = localStorage.getItem('bd_animaciones');
    document.getElementById('config-notifs').checked = notifs !== 'false';
    document.getElementById('config-animaciones').checked = animaciones !== 'false';

    modalConfig.style.display = 'block';
    this.cerrarDropdown();
  }

  async guardarPerfil(e) {
    e.preventDefault();

    try {
      const nombre = document.getElementById('perfil-nombre').value.trim();
      const universidad = document.getElementById('perfil-universidad').value.trim();
      const carrera = document.getElementById('perfil-carrera').value.trim();
      const biografia = document.getElementById('perfil-biografia').value.trim();

      await api.actualizarPerfil(nombre, biografia, carrera, universidad);
      localStorage.setItem('nombre', nombre);
      this.actualizarNavbar();
      if (window.mostrarToast) {
        window.mostrarToast('Perfil actualizado');
      } else {
        alert('Perfil actualizado');
      }

      const modalPerfil = document.getElementById('modal-perfil');
      if (modalPerfil) modalPerfil.style.display = 'none';
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      alert('No se pudo actualizar el perfil');
    }
  }

  guardarConfiguracion(e) {
    e.preventDefault();

    const notifs = document.getElementById('config-notifs').checked;
    const animaciones = document.getElementById('config-animaciones').checked;
    localStorage.setItem('bd_notificaciones', notifs ? 'true' : 'false');
    localStorage.setItem('bd_animaciones', animaciones ? 'true' : 'false');

    if (window.mostrarToast) {
      window.mostrarToast('Preferencias guardadas');
    } else {
      alert('Preferencias guardadas');
    }

    const modalConfig = document.getElementById('modal-config');
    if (modalConfig) modalConfig.style.display = 'none';
  }

  resetearInsignias() {
    if (window.bdBadges && window.bdBadges.resetear) {
      window.bdBadges.resetear();
    }
  }

  persistirUsuarioComunidad(nombre, email) {
    if (!nombre || !email) return;
    const usuario = { nombre, correo: email, fecha: new Date().toISOString() };
    localStorage.setItem('bd_usuario', JSON.stringify(usuario));
  }
}

// Inicializar
let authUI;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    authUI = new AuthUI();
    window.authUI = authUI;
  });
} else {
  authUI = new AuthUI();
  window.authUI = authUI;
}
