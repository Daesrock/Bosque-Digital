/**
 * map.js — Bosque Digital: Conocer para Proteger
 * Módulo de mapas Leaflet:
 *   - Mapa de reforestación en Chiapas (Tab 1 — Reforesta)
 * El mapa principal de deforestación se muestra como iframe oficial de GFW
 * directamente en index.html.
 * Autor: Equipo Bosque Digital — UNACH 2026
 */

/* =========================================================
   COORDENADAS Y VISTAS PREDEFINIDAS
========================================================= */
const VISTAS = {
  chiapas: { lat: 16.75, lng: -93.11, zoom: 7 },
};

/* =========================================================
   DATOS DE PROYECTOS DE REFORESTACIÓN EN CHIAPAS
========================================================= */
const PROYECTOS_REFORESTA = [
  {
    lat: 17.2,
    lng: -91.5,
    municipio: "Ocosingo",
    proyecto: "Corredor Biológico Mesoamericano — Zona Norte",
    especies: "Caoba, Cedro Rojo, Ramón Blanco",
    hectareas: 340,
    org: "Pronatura Sur / CONAFOR",
    estado: "Activo",
  },
  {
    lat: 16.73,
    lng: -92.64,
    municipio: "San Cristóbal de las Casas",
    proyecto: "Restauración Bosque Mesófilo Los Altos",
    especies: "Encino Colorado, Pino Ocote, Oyamel",
    hectareas: 180,
    org: "ECOSUR / CONANP",
    estado: "Activo",
  },
  {
    lat: 17.53,
    lng: -91.98,
    municipio: "Palenque",
    proyecto: "Reforestación Ejidal Selva Maya",
    especies: "Caoba, Copal, Ceiba (Pochote)",
    hectareas: 260,
    org: "CONAFOR Chiapas",
    estado: "Activo",
  },
  {
    lat: 16.23,
    lng: -93.26,
    municipio: "Villaflores",
    proyecto: "Agroforestería en Depresión Central",
    especies: "Huanacaxtle, Tepemezquite, Cedro Rojo",
    hectareas: 420,
    org: "Natura y Ecosistemas Mexicanos",
    estado: "Activo",
  },
  {
    lat: 15.35,
    lng: -92.24,
    municipio: "Motozintla",
    proyecto: "Restauración Sierra Madre de Chiapas",
    especies: "Pino Ocote, Encino Colorado, Cipres",
    hectareas: 310,
    org: "Pronatura Sur / PROBOSQUE",
    estado: "Activo",
  },
];

/* =========================================================
   VARIABLES DE ESTADO DEL MÓDULO
========================================================= */
let mapaReforesta = null; // Mapa del tab Reforesta
let voluntariosRegistrados = {}; // { municipio: true }

/* =========================================================
   INICIALIZACIÓN AL CARGAR EL DOM
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  initMapaReforesta();
  cargarVoluntariosLocalStorage();
});

/* =========================================================
   MAPA DE REFORESTACIÓN EN CHIAPAS — Tab 1
========================================================= */
function initMapaReforesta() {
  const contenedor = document.getElementById("reforestaMap");
  if (!contenedor) return;

  // El mapa se inicializa cuando el tab Reforesta se activa
  // para evitar problemas de tamaño con Leaflet en contenedores ocultos
  const tabReforesta = document.getElementById("tab-btn-reforesta");
  const tabBtns = document.querySelectorAll(".tab-btn");

  // Esperar a que el usuario abra el tab de Reforesta para inicializar
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.tab === "reforesta") {
        setTimeout(() => {
          if (!mapaReforesta) {
            crearMapaReforesta();
          } else {
            // Si ya existe, actualizar tamaño (puede haberse distorsionado)
            mapaReforesta.invalidateSize();
          }
        }, 250); // Pequeño delay para que el contenedor sea visible
      }
    });
  });

  // Si el tab de Reforesta ya está activo al cargar, inicializar directamente
  if (tabReforesta && tabReforesta.classList.contains("active")) {
    setTimeout(crearMapaReforesta, 500);
  }
}

/** Crea el mapa Leaflet secundario con proyectos de reforestación en Chiapas */
function crearMapaReforesta() {
  const contenedor = document.getElementById("reforestaMap");
  if (!contenedor || mapaReforesta) return;

  mapaReforesta = L.map("reforestaMap", {
    center: [VISTAS.chiapas.lat, VISTAS.chiapas.lng],
    zoom: VISTAS.chiapas.zoom,
    scrollWheelZoom: false,
    zoomControl: true,
  });

  // Tile layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(mapaReforesta);

  // Añadir proyectos de reforestación
  PROYECTOS_REFORESTA.forEach((proyecto) => {
    colocarMarcadorReforesta(proyecto);
  });

  // Ajustar vista para mostrar todos los marcadores
  const grupo = L.featureGroup(
    PROYECTOS_REFORESTA.map((p) => L.marker([p.lat, p.lng])),
  );
  mapaReforesta.fitBounds(grupo.getBounds().pad(0.3));
}

/**
 * Coloca un marcador de proyecto de reforestación en el mapa secundario.
 * @param {Object} proyecto - Datos del proyecto
 */
function colocarMarcadorReforesta(proyecto) {
  if (!mapaReforesta) return;

  // Verificar si ya se registró como voluntario
  const yaRegistrado = voluntariosRegistrados[proyecto.municipio] || false;

  const icono = L.divIcon({
    className: "",
    html: `
      <div style="
        width:28px;
        height:28px;
        background:${yaRegistrado ? "#52B788" : "#2D6A4F"};
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.35);
      ">
        <span style="
          display:block;transform:rotate(45deg);
          font-size:13px;text-align:center;
          line-height:22px;color:white;
        ">🌱</span>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
  });

  const marcador = L.marker([proyecto.lat, proyecto.lng], { icon: icono });

  const popupId = `btn-vol-${proyecto.municipio.replace(/\s/g, "-")}`;

  const contenidoPopup = `
    <div style="font-family:'Poppins',sans-serif;min-width:230px;">
      <p style="font-weight:800;color:#1B4332;font-size:14px;margin-bottom:4px;">
        🌱 ${proyecto.proyecto}
      </p>
      <p style="font-size:12px;color:#3D5A47;margin-bottom:2px;">
        <strong>Municipio:</strong> ${proyecto.municipio}, Chiapas
      </p>
      <p style="font-size:12px;color:#3D5A47;margin-bottom:2px;">
        <strong>Especies:</strong> ${proyecto.especies}
      </p>
      <p style="font-size:12px;color:#3D5A47;margin-bottom:2px;">
        <strong>Superficie:</strong> ${proyecto.hectareas.toLocaleString("es-MX")} ha
      </p>
      <p style="font-size:12px;color:#3D5A47;margin-bottom:8px;">
        <strong>Organización:</strong> ${proyecto.org}
      </p>
      <button
        id="${popupId}"
        style="
          width:100%;padding:8px;
          background:${yaRegistrado ? "#52B788" : "#1B4332"};
          color:white;border:none;border-radius:8px;
          font-family:'Poppins',sans-serif;font-size:12px;
          font-weight:700;cursor:pointer;
          display:flex;align-items:center;justify-content:center;gap:6px;
        "
        ${yaRegistrado ? "disabled" : ""}
        onclick="registrarVoluntario('${proyecto.municipio}')"
      >
        ${
          yaRegistrado
            ? "✅ Ya eres voluntario aquí"
            : "🙋 Unirme como voluntario"
        }
      </button>
    </div>
  `;

  marcador.bindPopup(contenidoPopup, { maxWidth: 300 });
  marcador.addTo(mapaReforesta);
}

/* =========================================================
   REGISTRO DE VOLUNTARIO
========================================================= */
/**
 * Registra al usuario como voluntario en un proyecto de reforestación.
 * Guarda en localStorage y notifica al sistema de badges.
 * @param {string} municipio - Nombre del municipio del proyecto
 */
function registrarVoluntario(municipio) {
  voluntariosRegistrados[municipio] = true;
  localStorage.setItem(
    "bd_voluntarios",
    JSON.stringify(voluntariosRegistrados),
  );

  // Notificar al módulo de badges
  window.dispatchEvent(
    new CustomEvent("bd:voluntarioRegistrado", {
      detail: { municipio },
    }),
  );

  // Mostrar toast
  if (window.mostrarToast) {
    window.mostrarToast(
      `¡Gracias! Te has registrado como voluntario en ${municipio}, Chiapas.`,
    );
  }

  // Recrear el mapa para actualizar el popup
  if (mapaReforesta) {
    mapaReforesta.eachLayer((layer) => {
      if (layer instanceof L.Marker) layer.remove();
    });
    PROYECTOS_REFORESTA.forEach((p) => colocarMarcadorReforesta(p));
  }

  // Cerrar el popup abierto
  if (mapaReforesta) mapaReforesta.closePopup();
}

/** Carga el registro de voluntados desde localStorage al iniciar */
function cargarVoluntariosLocalStorage() {
  try {
    const guardados = JSON.parse(
      localStorage.getItem("bd_voluntarios") || "{}",
    );
    voluntariosRegistrados = guardados;
  } catch {
    voluntariosRegistrados = {};
  }
}

// Exportar función global para que los popups inline de Leaflet puedan llamarla
window.registrarVoluntario = registrarVoluntario;
