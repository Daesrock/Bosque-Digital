/**
 * badges.js — Bosque Digital: Conocer para Proteger
 * Sistema de Insignias / Logros
 *
 * Escucha eventos personalizados disparados por otros módulos
 * y desbloquea insignias en el DOM + localStorage.
 *
 * Eventos escuchados:
 *   bd:exploradorScroll     — el usuario scrolleó hasta el footer
 *   bd:calculadoraUsada     — el usuario completó el cálculo de impacto
 *   bd:voluntarioRegistrado — el usuario se registró como voluntario de reforestación
 *   bd:buscoLey             — el usuario buscó una ley ambiental
 *   bd:registro             — el usuario se registró en la comunidad
 *
 * LocalStorage key: 'bd_badges' → JSON array de IDs de badges desbloqueados
 *
 * Autor: Equipo Bosque Digital — UNACH 2026
 */

/* =========================================================
   DEFINICIÓN DE BADGES
========================================================= */
const BADGES = [
  {
    id: "explorador",
    nombre: "Explorador del Bosque",
    evento: "bd:exploradorScroll",
    dom: "badge-explorador",
    descripcion: "Recorriste todo el sitio y llegaste al fondo del bosque.",
  },
  {
    id: "consciente",
    nombre: "Consumidor Consciente",
    evento: "bd:calculadoraUsada",
    dom: "badge-consciente",
    descripcion: "Calculaste tu huella forestal y conoces tu impacto.",
  },
  {
    id: "comprometido",
    nombre: "Guardián Comprometido",
    evento: "bd:voluntarioRegistrado",
    dom: "badge-comprometido",
    descripcion: "Te registraste como voluntario de reforestación en Chiapas.",
  },
  {
    id: "legislador",
    nombre: "Defensor Legal",
    evento: "bd:buscoLey",
    dom: "badge-legislador",
    descripcion: "Consultaste la legislación ambiental de México.",
  },
  {
    id: "defensor",
    nombre: "Defensor del Bosque",
    evento: null, // Se desbloquea automáticamente al completar los 4 anteriores
    dom: "badge-defensor",
    descripcion:
      "¡Completaste todos los logros! Eres un verdadero defensor del bosque.",
  },
];

// IDs de los 4 badges primarios (excluye 'defensor')
const BADGES_PRIMARIOS = [
  "explorador",
  "consciente",
  "comprometido",
  "legislador",
];

/* =========================================================
   INICIALIZACIÓN
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  restaurarBadgesDesdeStorage();
  registrarEventos();
  verificarBadgeDefensor();
});

/* =========================================================
   RESTAURAR DESDE LOCALSTORAGE
========================================================= */
/**
 * Al cargar la página, lee 'bd_badges' y refleja los badges
 * desbloqueados en el DOM sin notificaciones.
 */
function restaurarBadgesDesdeStorage() {
  const guardados = obtenerBadgesGuardados();

  guardados.forEach((id) => {
    actualizarDomBadge(id, false); // false = sin toast ni animación
  });
}

/* =========================================================
   REGISTRO DE EVENTOS
========================================================= */
function registrarEventos() {
  BADGES.forEach((badge) => {
    if (!badge.evento) return; // 'defensor' no tiene evento directo

    window.addEventListener(badge.evento, () => {
      desbloquearBadge(badge.id);
    });
  });
}

/* =========================================================
   DESBLOQUEAR BADGE
========================================================= */
/**
 * Desbloquea un badge: actualiza DOM, localStorage y notifica al usuario.
 * @param {string}  id       - ID del badge (ej: 'explorador')
 * @param {boolean} animar   - Si debe mostrar toast y animación (default: true)
 */
function desbloquearBadge(id, animar = true) {
  const guardados = obtenerBadgesGuardados();

  // Evitar desbloquear dos veces
  if (guardados.includes(id)) return;

  // Guardar en localStorage
  guardados.push(id);
  localStorage.setItem("bd_badges", JSON.stringify(guardados));

  // Actualizar DOM
  actualizarDomBadge(id, animar);

  // Revisar si se pueden desbloquear más badges (ej: 'defensor')
  if (BADGES_PRIMARIOS.includes(id)) {
    verificarBadgeDefensor();
  }
}

/* =========================================================
   ACTUALIZAR DOM
========================================================= */
/**
 * Aplica las clases CSS y textos para el badge desbloqueado.
 * @param {string}  id     - ID del badge
 * @param {boolean} animar - Mostrar toast y animación de celebración
 */
function actualizarDomBadge(id, animar = true) {
  const badge = BADGES.find((b) => b.id === id);
  if (!badge) return;

  const el = document.getElementById(badge.dom);
  if (!el) return;

  // Actualizar clases
  el.classList.remove("locked");
  el.classList.add("unlocked");

  // Actualizar estado visual
  const statusEl = el.querySelector(".badge-status");
  if (statusEl) {
    statusEl.textContent = "✅ Desbloqueada";
  }

  // Añadir atributo de accesibilidad
  el.setAttribute(
    "aria-label",
    `Insignia desbloqueada: ${badge.nombre} — ${badge.descripcion}`,
  );

  if (animar) {
    // Animación de pulso breve
    el.classList.add("badge-celebracion");
    setTimeout(() => el.classList.remove("badge-celebracion"), 1200);

    // Toast de notificación
    if (window.mostrarToast) {
      window.mostrarToast(`🏅 ¡Insignia desbloqueada! "${badge.nombre}"`);
    }

    // Actualizar contador global de badges en la UI
    actualizarContadorBadges();
  }
}

/* =========================================================
   VERIFICAR BADGE DEFENSOR
========================================================= */
/**
 * Si los 4 badges primarios están desbloqueados,
 * desbloquea automáticamente 'defensor'.
 */
function verificarBadgeDefensor() {
  const guardados = obtenerBadgesGuardados();

  const todosCompletados = BADGES_PRIMARIOS.every((id) =>
    guardados.includes(id),
  );

  if (todosCompletados && !guardados.includes("defensor")) {
    // Pequeño delay para que el usuario vea la secuencia de badges
    setTimeout(() => {
      desbloquearBadge("defensor");
    }, 800);
  }
}

/* =========================================================
   ACTUALIZAR CONTADOR EN UI
========================================================= */
/**
 * Actualiza cualquier elemento #badgesCount con el número de badges desbloqueados.
 */
function actualizarContadorBadges() {
  const guardados = obtenerBadgesGuardados();
  const contadores = document.querySelectorAll("#badgesCount, .badges-count");

  contadores.forEach((el) => {
    el.textContent = guardados.length;
  });
}

/* =========================================================
   UTILIDADES
========================================================= */
/**
 * Obtiene el array de IDs de badges guardados en localStorage.
 * @returns {string[]}
 */
function obtenerBadgesGuardados() {
  try {
    return JSON.parse(localStorage.getItem("bd_badges") || "[]");
  } catch {
    return [];
  }
}

/* =========================================================
   EXPOSICIÓN GLOBAL (para debugging desde consola)
========================================================= */
window.bdBadges = {
  desbloquear: desbloquearBadge,
  obtener: obtenerBadgesGuardados,
  resetear: () => {
    localStorage.removeItem("bd_badges");
    // Revertir DOM
    BADGES.forEach((b) => {
      const el = document.getElementById(b.dom);
      if (!el) return;
      el.classList.add("locked");
      el.classList.remove("unlocked", "badge-celebracion");
      const statusEl = el.querySelector(".badge-status");
      if (statusEl) statusEl.textContent = "🔒 Bloqueada";
    });
    if (window.mostrarToast)
      window.mostrarToast("Badges reseteados (para testing).");
  },
};
