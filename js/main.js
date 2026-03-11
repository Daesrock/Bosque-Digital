/**
 * main.js — Bosque Digital: Conocer para Proteger
 * Lógica general: navbar, contadores, tabs, especies, leyes,
 * foro, comunidad, gráficas Chart.js, acordeón blog, tooltips.
 * Autor: Equipo Bosque Digital — UNACH 2026
 */

/* =========================================================
   INICIALIZACIÓN AL CARGAR EL DOM
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar AOS (animaciones al hacer scroll)
  AOS.init({
    duration: 600,
    easing: "ease-out-cubic",
    once: true,
    offset: 80,
  });

  // Módulos principales
  initNavbar();
  initScrollProgress();
  initHeroCounters();
  initTabs();
  initCalculadoraCTA();
  initCharts();
  initEspecies();
  initOrganizaciones();
  initBuscadorLeyes();
  initBlog();
  initForo();
  initRegistro();
  initImpactoColectivo();
  initModal();
  initScrollBadge(); // notifica a badges.js cuando se llega al footer
});

/* =========================================================
   NAVBAR — scroll y menú hamburguesa
========================================================= */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Agregar clase .scrolled cuando baja del hero
  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 80) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
      actualizarNavActivo();
    },
    { passive: true },
  );

  // Toggle del menú hamburguesa en móvil
  navToggle.addEventListener("click", () => {
    const abierto = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", abierto);
    navToggle.setAttribute(
      "aria-label",
      abierto ? "Cerrar menú" : "Abrir menú",
    );
  });

  // Cerrar menú al hacer clic fuera
  document.addEventListener("click", (e) => {
    if (!navbar.contains(e.target) && navMenu.classList.contains("open")) {
      navMenu.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  // Cerrar menú al seleccionar enlace
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

/** Marca el enlace de navegación activo según la sección visible */
function actualizarNavActivo() {
  const secciones = ["hero", "problema", "soluciones", "comunidad"];
  const navLinks = document.querySelectorAll(".nav-link");
  const scrollY = window.scrollY + 100;

  secciones.forEach((id) => {
    const sec = document.getElementById(id);
    if (sec) {
      const top = sec.offsetTop;
      const bot = top + sec.offsetHeight;
      if (scrollY >= top && scrollY < bot) {
        navLinks.forEach((l) => {
          l.classList.toggle("active", l.getAttribute("href") === `#${id}`);
        });
      }
    }
  });
}

/* =========================================================
   BARRA DE PROGRESO DE SCROLL
========================================================= */
function initScrollProgress() {
  // Insertar barra antes del body
  const bar = document.createElement("div");
  bar.id = "scrollProgress";
  document.body.prepend(bar);

  window.addEventListener(
    "scroll",
    () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      bar.style.width = `${pct}%`;
    },
    { passive: true },
  );
}

/* =========================================================
   CONTADORES ANIMADOS DEL HERO
========================================================= */
function initHeroCounters() {
  const statHectareas = document.getElementById("statHectareas");
  const statAnual = document.getElementById("statAnual");
  const statGEI = document.getElementById("statGEI");

  if (statHectareas) animarContador(statHectareas, 420, 2000, "M ha");
  if (statAnual) animarContador(statAnual, 10, 2000, "M ha/año");
  if (statGEI) animarContador(statGEI, 15, 2000, "%");
}

/**
 * Anima un contador de 0 al valor final.
 */
function animarContador(elemento, valorFinal, duracion = 2000, sufijo = "") {
  let inicio = 0;
  const incremento = valorFinal / (duracion / 16);
  const timer = setInterval(() => {
    inicio += incremento;
    if (inicio >= valorFinal) {
      elemento.textContent = valorFinal.toLocaleString("es-MX") + sufijo;
      clearInterval(timer);
    } else {
      elemento.textContent =
        Math.floor(inicio).toLocaleString("es-MX") + sufijo;
    }
  }, 16);
}

/* =========================================================
   TABS DEL MÓDULO DE SOLUCIONES
========================================================= */
function initTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-content");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.dataset.tab;

      // Actualizar botones
      tabBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      // Mostrar panel activo
      tabPanels.forEach((panel) => {
        panel.classList.remove("active");
      });
      const panelActivo = document.getElementById(`tab-${tabId}`);
      if (panelActivo) {
        panelActivo.classList.add("active");
        // Re-ejecutar AOS en el panel recién visible
        AOS.refresh();
      }

      // Notificar a badges.js según la acción del tab
      if (tabId === "legisla") {
        window.dispatchEvent(new CustomEvent("bd:tabLegisla"));
      }
    });
  });
}

function initCalculadoraCTA() {
  const btn = document.getElementById("btnIrCalculadora");
  if (!btn) return;

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const tabBtn = document.getElementById("tab-btn-consume");
    const panel = document.getElementById("tab-consume");
    const seccion = document.getElementById("soluciones");

    if (tabBtn) tabBtn.click();
    if (seccion) seccion.scrollIntoView({ behavior: "smooth", block: "start" });

    setTimeout(() => {
      if (panel) panel.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 350);
  });
}

/* =========================================================
   GRÁFICAS CON CHART.JS
========================================================= */
function initCharts() {
  // --- Paleta de colores del proyecto ---
  const VERDE_OSCURO = "#1B4332";
  const VERDE_MEDIO = "#2D6A4F";
  const VERDE_CLARO = "#52B788";
  const VERDE_SUAVE = "#95D5B2";
  const TIERRA = "#8B5E3C";
  const NARANJA = "#E67E22";
  const AMARILLO = "#F39C12";
  const ROJO = "#C0392B";
  const CREMA = "#F5F0E8";

  // Opciones globales de tipografía
  Chart.defaults.font.family = "'Poppins', sans-serif";
  Chart.defaults.color = "#3D5A47";

  // === GRÁFICA 1: Dona de causas de deforestación ===
  const ctxCausas = document.getElementById("chartCausas");
  if (ctxCausas) {
    new Chart(ctxCausas, {
      type: "doughnut",
      data: {
        labels: [
          "Ganadería",
          "Agricultura comercial",
          "Agricultura subsistencia",
          "Minería y extracción",
          "Otros",
        ],
        datasets: [
          {
            data: [46, 27, 17, 5, 5],
            backgroundColor: [
              VERDE_OSCURO,
              TIERRA,
              NARANJA,
              AMARILLO,
              VERDE_SUAVE,
            ],
            borderColor: CREMA,
            borderWidth: 3,
            hoverOffset: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "60%",
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              padding: 16,
              font: { size: 12, weight: "600" },
            },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`,
            },
          },
        },
        animation: {
          animateRotate: true,
          duration: 1200,
          easing: "easeOutQuart",
        },
      },
    });
  }

  // === GRÁFICA 2: Barras por región ===
  const ctxRegiones = document.getElementById("chartRegiones");
  if (ctxRegiones) {
    new Chart(ctxRegiones, {
      type: "bar",
      data: {
        labels: [
          "Amazonía\n(Brasil)",
          "África\nSubsahariana",
          "Sudeste\nAsiático",
          "Centroamérica\ny Caribe",
          "México",
          "Boreal\n(Rusia/Canadá)",
        ],
        datasets: [
          {
            label: "Millones de ha perdidas (2001–2022)",
            data: [59.8, 38.2, 18.6, 7.3, 4.1, 21.7],
            backgroundColor: [
              ROJO,
              NARANJA,
              AMARILLO,
              TIERRA,
              VERDE_MEDIO,
              VERDE_CLARO,
            ],
            borderColor: "transparent",
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.parsed.x} Mha perdidas`,
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: { color: "rgba(0,0,0,0.06)" },
            ticks: { font: { size: 11 } },
          },
          y: {
            grid: { display: false },
            ticks: { font: { size: 11 } },
          },
        },
        animation: {
          duration: 1400,
          easing: "easeOutBounce",
          delay: (ctx) => ctx.dataIndex * 120,
        },
      },
    });
  }

  // === GRÁFICA 3: Línea de tendencia CO₂ ===
  const ctxEmisiones = document.getElementById("chartEmisiones");
  if (ctxEmisiones) {
    const anios = [
      2000, 2002, 2004, 2006, 2008, 2010, 2012, 2014, 2016, 2018, 2020, 2022,
      2023,
    ];
    const datos = [
      5.8, 5.5, 5.1, 5.3, 4.9, 4.7, 4.8, 4.5, 4.6, 4.9, 5.1, 4.8, 4.7,
    ];

    new Chart(ctxEmisiones, {
      type: "line",
      data: {
        labels: anios,
        datasets: [
          {
            label: "Emisiones CO₂ de deforestación (GtCO₂/año)",
            data: datos,
            borderColor: ROJO,
            backgroundColor: "rgba(192,57,43,0.12)",
            borderWidth: 3,
            pointBackgroundColor: ROJO,
            pointRadius: 5,
            pointHoverRadius: 7,
            fill: true,
            tension: 0.35,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: { font: { size: 12, weight: "600" } },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.parsed.y} GtCO₂/año`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: "rgba(0,0,0,0.05)" },
            ticks: { font: { size: 11 } },
          },
          y: {
            beginAtZero: false,
            min: 3.5,
            max: 7,
            grid: { color: "rgba(0,0,0,0.07)" },
            ticks: {
              font: { size: 11 },
              callback: (v) => `${v} Gt`,
            },
          },
        },
        animation: { duration: 1600, easing: "easeOutQuart" },
      },
    });
  }
}

/* =========================================================
   TAB 1 — ESPECIES NATIVAS
========================================================= */
async function initEspecies() {
  try {
    const resp = await fetch("./data/especies.json");
    const especies = await resp.json();

    window._especiesData = especies; // guardar para filtros

    const estadoSelect = document.getElementById("estadoSelect");
    if (estadoSelect) {
      estadoSelect.addEventListener("change", () => {
        renderEspecies(window._especiesData, estadoSelect.value);
      });
    }

    renderEspecies(especies, "Chiapas");
  } catch (err) {
    console.error("[Bosque Digital] Error al cargar especies:", err);
    const grid = document.getElementById("especiesGrid");
    if (grid)
      grid.innerHTML =
        '<p class="leyes-empty">No se pudo cargar la lista de especies.</p>';
  }
}

/**
 * Renderiza las tarjetas de especies según el estado seleccionado.
 * @param {Array}  especies  - Array de objetos especie
 * @param {string} estadoFiltro - Estado seleccionado o 'todos'
 */
function renderEspecies(especies, estadoFiltro) {
  const grid = document.getElementById("especiesGrid");
  if (!grid) return;

  const filtradas =
    estadoFiltro === "todos"
      ? especies
      : especies.filter((e) => e.estados.includes(estadoFiltro));

  if (filtradas.length === 0) {
    grid.innerHTML =
      '<p class="leyes-empty">No hay especies registradas para este estado.</p>';
    return;
  }

  grid.innerHTML = filtradas
    .map(
      (e, i) => `
    <article class="especie-card" role="listitem" data-aos="fade-up" data-aos-delay="${(i + 1) * 100}">
      <div class="especie-img-wrap">
        <img
          src="${e.imagen}"
          alt="Fotografía de ${e.nombreComun} (${e.nombreCientifico})"
          loading="lazy"
          width="400"
          height="180"
          onerror="this.src='https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=60'"
        />
        <span class="especie-conservation">${e.estadoConservacion}</span>
      </div>
      <div class="especie-body">
        <h4 class="especie-nombre">${e.nombreComun}</h4>
        <p class="especie-cientifico">${e.nombreCientifico}</p>
        <p class="especie-desc">${e.descripcion}</p>
        <div class="especie-meta">
          ${e.usos
            .slice(0, 3)
            .map((u) => `<span class="especie-tag">${u}</span>`)
            .join("")}
        </div>
        <p class="input-hint">
          <strong>Condiciones ideales:</strong> ${e.condicionesIdeales}
        </p>
      </div>
    </article>
  `,
    )
    .join("");

  // Re-observar con AOS los nuevos elementos
  AOS.refresh();
}

/* =========================================================
   TAB 1 — ORGANIZACIONES ALIADAS EN CHIAPAS
========================================================= */
function initOrganizaciones() {
  const orgs = [
    {
      nombre: "ECOSUR",
      descripcion:
        "El Colegio de la Frontera Sur. Investigación científica en ecología, biodiversidad y comunidades de Chiapas.",
      url: "https://www.ecosur.mx",
      icon: "fas fa-microscope",
    },
    {
      nombre: "CONAFOR Chiapas",
      descripcion:
        "Comisión Nacional Forestal, delegación regional Chiapas. Programas de reforestación, PSA e incendios.",
      url: "https://www.gob.mx/conafor",
      icon: "fas fa-tree",
    },
    {
      nombre: "Pronatura Sur",
      descripcion:
        "ONG con presencia en la Selva Lacandona, Sierra Madre de Chiapas y costa. Conservación comunitaria.",
      url: "https://pronatura-sur.org",
      icon: "fas fa-leaf",
    },
    {
      nombre: "Natura y Ecosistemas Mexicanos",
      descripcion:
        "Organización que trabaja en restauración de ecosistemas y pago por servicios ambientales en el sureste de México.",
      url: "https://www.natura.org.mx",
      icon: "fas fa-globe-americas",
    },
  ];

  const grid = document.getElementById("orgCards");
  if (!grid) return;

  grid.innerHTML = orgs
    .map(
      (o, i) => `
    <div class="org-card" data-aos="fade-up" data-aos-delay="${(i + 1) * 100}">
      <div class="org-icon" aria-hidden="true">
        <i class="${o.icon}"></i>
      </div>
      <div class="org-info">
        <h4>${o.nombre}</h4>
        <p>${o.descripcion}</p>
        <a href="${o.url}" target="_blank" rel="noopener noreferrer" class="org-link">
          <i class="fas fa-external-link-alt" aria-hidden="true"></i> Visitar sitio
        </a>
      </div>
    </div>
  `,
    )
    .join("");

  AOS.refresh();
}

/* =========================================================
   TAB 2 — BUSCADOR DE LEYES AMBIENTALES
========================================================= */
async function initBuscadorLeyes() {
  const input = document.getElementById("buscadorLeyes");
  const resultados = document.getElementById("leyesResultados");
  if (!input || !resultados) return;

  let leyes = [];
  try {
    const resp = await fetch("./data/leyes.json");
    leyes = await resp.json();
  } catch (err) {
    console.error("[Bosque Digital] Error al cargar leyes:", err);
    resultados.innerHTML =
      '<p class="leyes-empty">No se pudo cargar la base de datos de leyes.</p>';
    return;
  }

  // Mostrar todas al inicio
  renderLeyes(leyes);

  // Filtrar al escribir (debounce 300ms)
  let timerId;
  input.addEventListener("input", () => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      const query = input.value.trim().toLowerCase();
      const filtradas =
        query === ""
          ? leyes
          : leyes.filter((l) => {
              return (
                l.nombre.toLowerCase().includes(query) ||
                l.resumen.toLowerCase().includes(query) ||
                l.palabrasClave.some((k) => k.includes(query)) ||
                l.categorias.some((c) => c.includes(query))
              );
            });

      renderLeyes(filtradas, query !== "");

      // Otorgar insignia "Legislador" si el usuario buscó algo
      if (query.length >= 3) {
        window.dispatchEvent(new CustomEvent("bd:buscoLey"));
      }
    }, 300);
  });
}

/**
 * Renderiza las tarjetas de leyes en el DOM.
 * @param {Array}   leyes     - Array de objetos ley
 * @param {boolean} buscando  - Si hay búsqueda activa
 */
function renderLeyes(leyes, buscando = false) {
  const resultados = document.getElementById("leyesResultados");
  if (!resultados) return;

  if (leyes.length === 0) {
    resultados.innerHTML = `
      <div class="leyes-empty">
        <i class="fas fa-search" style="font-size:2rem;color:var(--verde-claro);display:block;margin-bottom:0.5rem;"></i>
        No se encontraron resultados. Intenta con otras palabras clave.
      </div>
    `;
    return;
  }

  resultados.innerHTML = leyes
    .map(
      (l) => `
    <div class="ley-card" data-aos="fade-up">
      <div class="ley-card-header">
        <h4 class="ley-nombre">${l.nombre}</h4>
        <span class="ley-año">${l.año}</span>
      </div>
      <p class="ley-resumen">${l.resumen}</p>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px;">
        ${l.categorias.map((c) => `<span class="especie-tag">${c}</span>`).join("")}
      </div>
      <a href="${l.enlace}" target="_blank" rel="noopener noreferrer" class="ley-link">
        <i class="fas fa-external-link-alt" aria-hidden="true"></i>
        Ver texto oficial (DOF / Cámara de Diputados)
      </a>
    </div>
  `,
    )
    .join("");
}

/* =========================================================
   TAB 4 — ACORDEÓN DEL BLOG
========================================================= */
function initBlog() {
  const blogBtns = document.querySelectorAll(".blog-btn");

  blogBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      const contentId = btn.getAttribute("aria-controls");
      const content = document.getElementById(contentId);

      if (!content) return;

      // Cerrar el que estuviera abierto
      blogBtns.forEach((b) => {
        const cId = b.getAttribute("aria-controls");
        const c = document.getElementById(cId);
        b.setAttribute("aria-expanded", "false");
        if (c) c.hidden = true;
      });

      // Abrir/cerrar el actual
      if (!expanded) {
        btn.setAttribute("aria-expanded", "true");
        content.hidden = false;
      }
    });
  });
}

/* =========================================================
   TAB 4 — FORO SIMULADO (localStorage)
========================================================= */
function initForo() {
  const form = document.getElementById("foroForm");
  const nombreInput = document.getElementById("foroNombre");
  const mensajeInput = document.getElementById("foroMensaje");
  const charCount = document.getElementById("foroCharCount");
  const container = document.getElementById("forumComments");

  if (!form) return;

  // Mostrar comentarios existentes en localStorage
  renderComentariosForo();

  // Contador de caracteres
  if (mensajeInput) {
    mensajeInput.addEventListener("input", () => {
      const len = mensajeInput.value.length;
      charCount.textContent = `${len}/300`;
      charCount.style.color = len >= 280 ? "#C0392B" : "";
    });
  }

  // Enviar nuevo comentario
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = nombreInput.value.trim();
    const mensaje = mensajeInput.value.trim();

    if (!nombre || !mensaje) return;

    const comentario = {
      id: Date.now(),
      nombre,
      mensaje,
      fecha: new Date().toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };

    // Guardar en localStorage
    const comentarios = obtenerComentarios();
    comentarios.unshift(comentario);
    // Limite de 50 comentarios para no saturar storage
    if (comentarios.length > 50) comentarios.pop();
    localStorage.setItem("bd_foro", JSON.stringify(comentarios));

    // Limpiar formulario
    form.reset();
    charCount.textContent = "0/300";

    // Re-renderizar y mostrar toast
    renderComentariosForo();
    mostrarToast("¡Comentario publicado en el foro!");
  });

  function obtenerComentarios() {
    try {
      return JSON.parse(localStorage.getItem("bd_foro") || "[]");
    } catch {
      return [];
    }
  }

  function renderComentariosForo() {
    if (!container) return;
    const comentarios = obtenerComentarios();

    // Añadir algunos comentarios semilla si está vacío
    const semillas = [
      {
        id: 1,
        nombre: "Laura Pérez",
        mensaje:
          "Este proyecto me hizo reflexionar mucho sobre mis hábitos de consumo. ¡Voy a reducir mi consumo de carne!",
        fecha: "05 mar 2026",
      },
      {
        id: 2,
        nombre: "Carlos Ruiz",
        mensaje:
          "Muy impresionante ver la pérdida de bosques en el mapa. Chiapas necesita más atención urgente.",
        fecha: "04 mar 2026",
      },
      {
        id: 3,
        nombre: "Ana González",
        mensaje:
          "Me registré como voluntaria en el proyecto de Ocosingo. ¡El bosque nos necesita!",
        fecha: "03 mar 2026",
      },
    ];

    const todos = [...comentarios, ...semillas]
      .sort((a, b) => (b.id || 0) - (a.id || 0))
      .slice(0, 20);

    container.innerHTML = todos
      .map(
        (c) => `
      <article class="forum-comment" role="article">
        <div class="comment-author">
          <span class="comment-name">
            <i class="fas fa-user-circle" aria-hidden="true" style="color:var(--verde-claro)"></i>
            ${escHtml(c.nombre)}
          </span>
          <span class="comment-time">${c.fecha}</span>
        </div>
        <p class="comment-text">${escHtml(c.mensaje)}</p>
      </article>
    `,
      )
      .join("");
  }
}

/* =========================================================
   SECCIÓN 4 — REGISTRO EN LA COMUNIDAD
========================================================= */
function initRegistro() {
  const form = document.getElementById("formRegistro");
  const regForm = document.getElementById("registroForm");
  const bienvenida = document.getElementById("registroBienvenida");
  const userNameEl = document.getElementById("userName");
  const btnLogout = document.getElementById("btnLogout");

  if (!form) return;

  // Verificar si ya está registrado
  const usuario = obtenerUsuario();
  if (usuario) {
    mostrarBienvenida(usuario);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = document.getElementById("regNombre").value.trim();
    const correo = document.getElementById("regCorreo").value.trim();

    if (!nombre || !correo) return;

    const usuario = { nombre, correo, fecha: new Date().toISOString() };
    localStorage.setItem("bd_usuario", JSON.stringify(usuario));
    mostrarBienvenida(usuario);
    mostrarToast(`¡Bienvenid@, ${nombre}! Ya eres parte de Bosque Digital.`);

    // Notificar al módulo de badges (ver badges.js)
    window.dispatchEvent(new CustomEvent("bd:registro"));
  });

  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      localStorage.removeItem("bd_usuario");
      if (regForm) regForm.style.display = "";
      if (bienvenida) bienvenida.classList.add("hidden");
      mostrarToast("Has cerrado tu sesión.");
    });
  }

  function mostrarBienvenida(usuario) {
    if (userNameEl) userNameEl.textContent = usuario.nombre;
    if (regForm) regForm.style.display = "none";
    if (bienvenida) bienvenida.classList.remove("hidden");
  }
}

/** Obtiene el usuario guardado en localStorage */
function obtenerUsuario() {
  try {
    return JSON.parse(localStorage.getItem("bd_usuario"));
  } catch {
    return null;
  }
}

/* =========================================================
   TABLERO DE IMPACTO COLECTIVO — contadores animados
========================================================= */
function initImpactoColectivo() {
  const stats = document.querySelectorAll(".impacto-num[data-target]");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          animarContadorSimple(el, target);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 },
  );

  stats.forEach((s) => observer.observe(s));
}

function animarContadorSimple(el, target) {
  const duracion = 2000;
  const fps = 60;
  const pasos = Math.ceil(duracion / (1000 / fps));
  let paso = 0;

  const interval = setInterval(() => {
    paso++;
    const progreso = 1 - Math.pow(1 - paso / pasos, 3);
    el.textContent = Math.floor(target * progreso).toLocaleString("es-MX");

    if (paso >= pasos) {
      el.textContent = target.toLocaleString("es-MX");
      clearInterval(interval);
    }
  }, 1000 / fps);
}

/* =========================================================
   MODAL DE INFORMACIÓN (botones ?)
========================================================= */
function initModal() {
  const modal = document.getElementById("tooltipModal");
  const modalClose = document.getElementById("modalClose");
  const modalTitle = document.getElementById("tooltipModalTitle");
  const modalContent = document.getElementById("tooltipModalContent");

  // Abrir modal al hacer click en botones de info
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-info");
    if (btn && btn.dataset.tooltip) {
      const titulo =
        btn.closest(".chart-card-header")?.querySelector("h4")?.textContent ||
        "Información";
      modalTitle.textContent = titulo;
      modalContent.textContent = btn.dataset.tooltip;
      modal.classList.remove("hidden");
      modalClose.focus();
    }
  });

  // Cerrar modal
  if (modalClose) {
    modalClose.addEventListener("click", () => modal.classList.add("hidden"));
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.add("hidden");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      modal.classList.add("hidden");
    }
  });
}

/* =========================================================
   INSIGNIA "EXPLORADOR" — detectar scroll completo de la página
========================================================= */
function initScrollBadge() {
  const footer = document.querySelector(".site-footer");
  if (!footer) return;

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        window.dispatchEvent(new CustomEvent("bd:exploradorScroll"));
        observer.disconnect();
      }
    },
    { threshold: 0.1 },
  );

  observer.observe(footer);
}

/* =========================================================
   TOAST DE NOTIFICACIÓN
========================================================= */
/**
 * Muestra una notificación emergente en la esquina inferior derecha.
 * @param {string} mensaje  - Texto a mostrar
 * @param {number} duracion - ms de visibilidad (default 3500)
 */
function mostrarToast(mensaje, duracion = 3500) {
  const toast = document.getElementById("toastNotif");
  const toastMsg = document.getElementById("toastMsg");

  if (!toast || !toastMsg) return;

  toastMsg.textContent = mensaje;
  toast.classList.remove("hidden");

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.add("hidden"), duracion);
}

// Exportar para que otros módulos la usen
window.mostrarToast = mostrarToast;

/* =========================================================
   UTILIDADES
========================================================= */

/**
 * Escapa caracteres HTML para evitar XSS en contenido de usuarios.
 * @param {string} str
 * @returns {string}
 */
function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Exportar utilidades globales
window.escHtml = escHtml;
window.obtenerUsuario = obtenerUsuario;
