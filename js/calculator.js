/**
 * calculator.js — Bosque Digital: Conocer para Proteger
 * Calculadora de Impacto en Bosques — Tab 3 "Consume con Conciencia"
 *
 * Fórmulas basadas en:
 *   - FAO (2006) Livestock's Long Shadow
 *   - Poore et al. (2018) Science
 *   - WWF (2020) Living Planet Report
 *   - Global Carbon Project (2023)
 *
 * Autor: Equipo Bosque Digital — UNACH 2026
 */

/* =========================================================
   FACTORES DE CONVERSIÓN (basados en FAO/WWF)
   Unidades: m² de bosque impactados por año
========================================================= */
const FACTORES = {
  // 1 kg de carne de res por semana → m²/año
  // Fuente: Poore et al. 2018; FAO Livestock's Long Shadow
  carneRes: 6.6 * 52, // kg/sem × 52 semanas × 6.6 m²/kg = m²/año

  // 1 litro de leche por semana → m²/año
  // Fuente: FAO; Poore et al. 2018
  lacteos: 0.97 * 52, // L/sem × 52 sem × 0.97 m²/L = m²/año

  // 100 hojas de papel por mes → m²/año
  // Fuente: WWF Paper Sustainability Guidelines
  papel: (0.1 / 100) * 12, // hojas/mes ÷ 100 × 12 meses × 0.1 m²/100h = m²/año

  // 1 vuelo doméstico por año → m² (deforestación indirecta por emisiones)
  // Fuente: IPCC AR6; estimación de huella de bosque indirecta
  vuelo: 0.5, // m²/vuelo

  // Compra frecuente de madera/muebles → m² adicionales
  madera: 15, // m² adicionales por año (estimación conservadora)
};

/* =========================================================
   NIVELES DE IMPACTO
========================================================= */
const NIVELES = [
  {
    min: 0,
    max: 100,
    etiqueta: "Bajo",
    clase: "level-bajo",
    color: "#52B788",
    descripcion:
      "¡Excelente! Tu huella forestal es baja. Sigue así y comparte tu ejemplo.",
  },
  {
    min: 100,
    max: 300,
    etiqueta: "Medio",
    clase: "level-medio",
    color: "#F39C12",
    descripcion:
      "Tu impacto es moderado. Pequeños cambios en tu dieta pueden marcar una gran diferencia.",
  },
  {
    min: 300,
    max: 700,
    etiqueta: "Alto",
    clase: "level-alto",
    color: "#E67E22",
    descripcion:
      "Tu huella forestal es alta. Reducir el consumo de carne es la acción más efectiva.",
  },
  {
    min: 700,
    max: Infinity,
    etiqueta: "Crítico",
    clase: "level-critico",
    color: "#C0392B",
    descripcion:
      "Tu impacto es crítico. Cada décision de consumo tiene consecuencias significativas en los bosques.",
  },
];

/* =========================================================
   RECOMENDACIONES POR NIVEL
========================================================= */
const RECOMENDACIONES = {
  bajo: [
    {
      icono: "fas fa-thumbs-up",
      texto:
        "Tu dieta ya es sostenible. Continúa eligiendo productos locales y de temporada para mantener tu bajo impacto.",
    },
    {
      icono: "fas fa-share-alt",
      texto:
        "Comparte tu estilo de vida con amigos y familia. El cambio cultural comienza con conversaciones.",
    },
    {
      icono: "fas fa-certificate",
      texto:
        "Busca productos con certificación FSC (Forest Stewardship Council) cuando compres papel o madera.",
    },
    {
      icono: "fas fa-hands-helping",
      texto:
        "Considera registrarte como voluntario en un proyecto de reforestación de CONAFOR o Pronatura Sur en Chiapas.",
    },
  ],
  medio: [
    {
      icono: "fas fa-drumstick-bite",
      texto:
        'Prueba "lunes sin carne": eliminar la carne de res un día a la semana ya reduce tu huella forestal ~14%.',
    },
    {
      icono: "fas fa-glass-whiskey",
      texto:
        "Sustituye la mitad de tus lácteos por alternativas vegetales (leche de avena, nuez). Los productores chiapanecos de café ofrecen alternativas.",
    },
    {
      icono: "fas fa-file-alt",
      texto:
        "Imprime a doble cara y usa el papel reciclado. Muchas universidades ya lo ofrecen en sus impresoras.",
    },
    {
      icono: "fas fa-leaf",
      texto:
        "Cuando necesites madera, busca madereras con certificación FSC o materiales reciclados y reconstituidos.",
    },
    {
      icono: "fas fa-tree",
      texto:
        "Planta al menos un árbol nativo este año. Cada caoba, cedro o encino que siembres compensa entre 5 y 10 m² de impacto.",
    },
  ],
  alto: [
    {
      icono: "fas fa-drumstick-bite",
      texto:
        "ACCIÓN PRIORITARIA: Reduce tu consumo de carne de res a máximo 500g por semana. Una hamburguesa menos al día puede salvar 130 m² de bosque al año.",
    },
    {
      icono: "fas fa-plane",
      texto:
        "Considera compensar tus vuelos a través de programas de reforestación certificados (ej. Gold Standard, Verra). También, usa el tren o autobús cuando sea posible.",
    },
    {
      icono: "fas fa-shopping-cart",
      texto:
        "Antes de comprar muebles nuevos, explora mercados de segunda mano y plataformas de intercambio. El mejor árbol es el que no se corta.",
    },
    {
      icono: "fas fa-leaf",
      texto:
        "Aumenta vegetales, leguminosas y cereales integrales en tu dieta. Los frijoles chiapanecos tienen una huella hídrica y forestal 30 veces menor que la carne.",
    },
    {
      icono: "fas fa-hands-helping",
      texto:
        "Participa en las brigadas de reforestación de CONAFOR en Chiapas. Las jornadas voluntarias son mensuales y abiertas a universitarios.",
    },
  ],
  critico: [
    {
      icono: "fas fa-exclamation-circle",
      texto:
        "URGENTE: Tu principal driver de impacto es el consumo de carne. Reducirlo a la mitad tendría más impacto que cualquier otra acción que puedas tomar.",
    },
    {
      icono: "fas fa-drumstick-bite",
      texto:
        "Considera eliminar la carne de res por 30 días como reto. Muchas personas que lo hacen reportan que no extrañan el sabor y sí notan los beneficios de salud.",
    },
    {
      icono: "fas fa-plane",
      texto:
        "Los vuelos tienen un impacto desproporcionado. Si no puedes eliminarlos, compensa cada vuelo plantando mínimo 5 árboles nativos.",
    },
    {
      icono: "fas fa-globe",
      texto:
        "Habla con tu familia sobre hábitos de consumo. Un hogar de 4 personas que reduce su consumo de carne tiene el mismo impacto que 4 personas individuales.",
    },
    {
      icono: "fas fa-book-open",
      texto:
        "Revisa la sección de recursos y artículos de este sitio para profundizar en el tema y encontrar comunidades de apoyo para el cambio.",
    },
    {
      icono: "fas fa-seedling",
      texto:
        "Únete a la comunidad Bosque Digital y regístrate como voluntario de reforestación para compensar tu impacto de forma activa.",
    },
  ],
};

/* =========================================================
   VARIABLES DE ESTADO
========================================================= */
let gaugeChart = null;

/* =========================================================
   INICIALIZACIÓN
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  initSliders();
  initCalculadora();
});

/* =========================================================
   SLIDERS — Actualizar valores en tiempo real
========================================================= */
function initSliders() {
  const configs = [
    { sliderId: "inputCarne", displayId: "valCarne", format: (v) => `${v} kg` },
    {
      sliderId: "inputLacteos",
      displayId: "valLacteos",
      format: (v) => `${v} L`,
    },
    {
      sliderId: "inputPapel",
      displayId: "valPapel",
      format: (v) => `${v} hojas`,
    },
    {
      sliderId: "inputVuelos",
      displayId: "valVuelos",
      format: (v) => `${parseInt(v)} vuelos`,
    },
  ];

  configs.forEach(({ sliderId, displayId, format }) => {
    const slider = document.getElementById(sliderId);
    const display = document.getElementById(displayId);
    if (!slider || !display) return;

    slider.addEventListener("input", () => {
      display.textContent = format(slider.value);
    });
  });
}

/* =========================================================
   LÓGICA DE LA CALCULADORA
========================================================= */
function initCalculadora() {
  const btnCalcular = document.getElementById("btnCalcular");
  const btnCompartir = document.getElementById("btnCompartir");
  const btnCopy = document.getElementById("btnCopy");

  if (btnCalcular) {
    btnCalcular.addEventListener("click", ejecutarCalculo);
  }

  if (btnCompartir) {
    btnCompartir.addEventListener("click", mostrarPanelCompartir);
  }

  if (btnCopy) {
    btnCopy.addEventListener("click", copiarTexto);
  }
}

/**
 * Recopila los valores del formulario, calcula el impacto
 * y actualiza los resultados en el DOM.
 */
function ejecutarCalculo() {
  // Leer valores de los inputs
  const carneKgSem = parseFloat(
    document.getElementById("inputCarne")?.value || 0,
  );
  const lacteosLSem = parseFloat(
    document.getElementById("inputLacteos")?.value || 0,
  );
  const papelHojasMes = parseFloat(
    document.getElementById("inputPapel")?.value || 0,
  );
  const vuelosAño = parseFloat(
    document.getElementById("inputVuelos")?.value || 0,
  );
  const maderaFrecuente =
    document.querySelector('input[name="madera"]:checked')?.value === "si";

  // Calcular m² por categoría
  const impactoCarne = carneKgSem * FACTORES.carneRes;
  const impactoLacteos = lacteosLSem * FACTORES.lacteos;
  const impactoPapel = papelHojasMes * FACTORES.papel;
  const impactoVuelos = vuelosAño * FACTORES.vuelo;
  const impactoMadera = maderaFrecuente ? FACTORES.madera : 0;

  const totalM2 = Math.round(
    impactoCarne +
      impactoLacteos +
      impactoPapel +
      impactoVuelos +
      impactoMadera,
  );

  // Determinar nivel de impacto
  const nivel =
    NIVELES.find((n) => totalM2 >= n.min && totalM2 < n.max) ||
    NIVELES[NIVELES.length - 1];

  // Actualizar DOM
  mostrarResultados(totalM2, nivel, {
    impactoCarne,
    impactoLacteos,
    impactoPapel,
    impactoVuelos,
    impactoMadera,
  });

  // Notificar a badges.js que la calculadora fue usada
  window.dispatchEvent(new CustomEvent("bd:calculadoraUsada"));

  // Guardar resultado en localStorage para el badge
  localStorage.setItem(
    "bd_ultimo_calculo",
    JSON.stringify({
      totalM2,
      nivel: nivel.etiqueta,
      fecha: new Date().toISOString(),
    }),
  );
}

/**
 * Actualiza el DOM con los resultados del cálculo.
 * @param {number} totalM2
 * @param {Object} nivel
 * @param {Object} desglose
 */
function mostrarResultados(totalM2, nivel, desglose) {
  const resultsInitial = document.getElementById("resultsInitial");
  const resultsData = document.getElementById("resultsData");

  if (resultsInitial) resultsInitial.classList.add("hidden");
  if (resultsData) resultsData.classList.remove("hidden");

  // Actualizar valor del medidor
  const gaugeValue = document.getElementById("gaugeValue");
  if (gaugeValue) {
    animarNumero(gaugeValue, totalM2);
  }

  // Actualizar gauge (Chart.js doughnut)
  actualizarGauge(totalM2, nivel);

  // Actualizar badge de nivel
  const levelBadge = document.getElementById("levelBadge");
  if (levelBadge) {
    levelBadge.textContent = `${nivel.etiqueta} — ${nivel.descripcion}`;
    levelBadge.className = `level-badge ${nivel.clase}`;
  }

  // Mostrar equivalencias visuales
  mostrarEquivalencias(totalM2);

  // Mostrar recomendaciones personalizadas
  mostrarRecomendaciones(nivel.etiqueta.toLowerCase());

  // Scroll al panel de resultados en móvil
  const results = document.getElementById("calcResults");
  if (results && window.innerWidth <= 960) {
    results.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

/* =========================================================
   GAUGE ANIMADO (Chart.js doughnut)
========================================================= */
/**
 * Crea o actualiza el gauge circular de impacto.
 * @param {number} totalM2 - Total de m² impactados
 * @param {Object} nivel   - Objeto del nivel de impacto
 */
function actualizarGauge(totalM2, nivel) {
  const canvas = document.getElementById("impactGauge");
  if (!canvas) return;

  // Máximo del gauge = 1000 m² (nivel crítico alto)
  const maximo = 1000;
  const valor = Math.min(totalM2, maximo);
  const restante = Math.max(maximo - valor, 0);

  if (gaugeChart) {
    // Actualizar datos del gauge existente
    gaugeChart.data.datasets[0].data = [valor, restante];
    gaugeChart.data.datasets[0].backgroundColor = [nivel.color, "#E8E0D0"];
    gaugeChart.update({ duration: 800, easing: "easeOutQuart" });
  } else {
    // Crear nuevo gauge
    gaugeChart = new Chart(canvas, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [valor, restante],
            backgroundColor: [nivel.color, "#E8E0D0"],
            borderWidth: 0,
            hoverOffset: 0,
          },
        ],
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        rotation: -90,
        circumference: 180,
        cutout: "75%",
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
        animation: {
          duration: 1000,
          easing: "easeOutQuart",
        },
      },
    });
  }
}

/* =========================================================
   EQUIVALENCIAS VISUALES
========================================================= */
/**
 * Genera las equivalencias visuales del impacto calculado.
 * @param {number} totalM2 - Total de m² impactados
 */
function mostrarEquivalencias(totalM2) {
  const contenedor = document.getElementById("equivalencias");
  if (!contenedor) return;

  // Calcular equivalencias
  const canchas = (totalM2 / 7140).toFixed(2); // 7,140 m² = cancha de fútbol estándar
  const arboles = Math.round(totalM2 / 25); // ~25 m² de bosque por árbol adulto
  const piscinasBOE = (totalM2 / 50).toFixed(1); // 50 m² por piscina simple
  const estadiosFut =
    totalM2 >= 7140
      ? `${canchas}`
      : `${((totalM2 / 7140) * 100).toFixed(0)}% de una cancha`;

  contenedor.innerHTML = `
    <p class="equivalencia-item">
      <i class="fas fa-futbol" aria-hidden="true"></i>
      Equivale a <strong>${estadiosFut} cancha(s) de fútbol</strong>
      (7,140 m² c/u)
    </p>
    <p class="equivalencia-item">
      <i class="fas fa-tree" aria-hidden="true"></i>
      Impacta el área que necesitan <strong>${arboles} árboles adultos</strong>
      para crecer
    </p>
    <p class="equivalencia-item">
      <i class="fas fa-ruler-combined" aria-hidden="true"></i>
      Es como <strong>${totalM2.toLocaleString("es-MX")} metros cuadrados</strong>
      de selva o bosque por año
    </p>
    <p class="equivalencia-item">
      <i class="fas fa-globe-americas" aria-hidden="true"></i>
      En Chiapas, esto representa el ${((totalM2 / 3_650_000) * 100).toFixed(4)}%
      de un bosque comunal típico de 3,650 ha
    </p>
  `;
}

/* =========================================================
   RECOMENDACIONES PERSONALIZADAS
========================================================= */
/**
 * Muestra las recomendaciones según el nivel de impacto.
 * @param {string} nivelKey - 'bajo', 'medio', 'alto', 'critico'
 */
function mostrarRecomendaciones(nivelKey) {
  const lista = document.getElementById("recomendaciones");
  if (!lista) return;

  const clave = nivelKey === "crítico" ? "critico" : nivelKey;
  const recs = RECOMENDACIONES[clave] || RECOMENDACIONES.medio;

  lista.innerHTML = recs
    .map(
      (r) => `
    <li class="rec-item">
      <i class="${r.icono}" aria-hidden="true"></i>
      <span>${r.texto}</span>
    </li>
  `,
    )
    .join("");
}

/* =========================================================
   COMPARTIR RESULTADO
========================================================= */
function mostrarPanelCompartir() {
  const panel = document.getElementById("sharePanel");
  const textarea = document.getElementById("shareText");

  if (!panel || !textarea) return;

  // Obtener datos del último cálculo
  const calculo = JSON.parse(localStorage.getItem("bd_ultimo_calculo") || "{}");
  const totalM2 = calculo.totalM2 || 0;
  const nivelTxt = calculo.nivel || "Medio";
  const arboles = Math.round(totalM2 / 25);
  const canchas = (totalM2 / 7140).toFixed(2);

  const texto = `🌿 Bosque Digital — Conocer para Proteger

Calculé mi impacto anual en los bosques:
📊 ${totalM2.toLocaleString("es-MX")} m² de bosque impactados por año
⚠️ Nivel: ${nivelTxt}
🌳 Equivale a ${arboles} árboles adultos
⚽ O ${canchas} canchas de fútbol

¿Cuál es tu huella forestal? Descúbrelo en:
bosquedigital.unach.mx

#BosqueDigital #UNACH #DeforestacionCero #Chiapas #MedioAmbiente`;

  textarea.value = texto;
  panel.classList.remove("hidden");
}

function copiarTexto() {
  const textarea = document.getElementById("shareText");
  if (!textarea) return;

  textarea.select();
  textarea.setSelectionRange(0, 99999); // Para móviles

  try {
    navigator.clipboard
      .writeText(textarea.value)
      .then(() => {
        if (window.mostrarToast)
          window.mostrarToast("¡Texto copiado al portapapeles!");
      })
      .catch(() => {
        // Fallback para browsers sin clipboard API
        document.execCommand("copy");
        if (window.mostrarToast) window.mostrarToast("¡Texto copiado!");
      });
  } catch {
    document.execCommand("copy");
    if (window.mostrarToast) window.mostrarToast("¡Texto copiado!");
  }
}

/* =========================================================
   ANIMACIÓN NUMÉRICA
========================================================= */
/**
 * Anima un elemento de texto desde 0 hasta el valor final.
 * @param {HTMLElement} el     - Elemento a animar
 * @param {number}      target - Valor final
 */
function animarNumero(el, target) {
  const duracion = 900;
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
