# 🌿 Bosque Digital: Conocer para Proteger

Plataforma educativa interactiva sobre deforestación, desarrollada por estudiantes de la Universidad Autónoma de Chiapas (UNACH) para la comunidad universitaria de Tuxtla Gutiérrez, Chiapas.

---

## 📋 Descripción

Bosque Digital es una SPA (Single-Page Application) que comunica la crisis global de deforestación a través de:

- **Mapas interactivos** con datos de Global Forest Watch (GFW)
- **Calculadora de huella forestal** personalizada por hábitos de consumo
- **Base de datos de legislación ambiental** mexicana (10 leyes)
- **Catálogo de especies nativas** para reforestación en Chiapas (12 especies)
- **Sistema de comunidad** con badges, voluntariado y foro
- **Gráficas y visualizaciones** con datos actualizados

---

## 🗂️ Estructura del Proyecto

```
Bosque Digital/
├── index.html              # Estructura SPA principal
├── css/
│   └── styles.css          # Sistema de diseño completo (~1200 líneas)
├── js/
│   ├── main.js             # Orquestador: navbar, tabs, gráficas, foro, registro
│   ├── map.js              # Mapas Leaflet: deforestación + reforestación
│   ├── calculator.js       # Calculadora de impacto en bosques
│   └── badges.js           # Sistema de insignias/logros
├── api/
│   └── gfw-proxy.js        # Vercel Edge Function — proxy GFW (protege API key)
├── data/
│   ├── leyes.json          # 10 leyes ambientales de México
│   └── especies.json       # 12 especies nativas para reforestación
├── .env.local              # Variables de entorno locales (NO commitear)
├── .gitignore
└── README.md
```

## 📦 Tecnologías Utilizadas

| Tecnología                                                                | Versión | Uso                           |
| ------------------------------------------------------------------------- | ------- | ----------------------------- |
| HTML5                                                                     | —       | Estructura semántica SPA      |
| CSS3                                                                      | —       | Sistema de diseño, responsivo |
| Vanilla JS                                                                | ES2020+ | Toda la lógica del cliente    |
| [Leaflet.js](https://leafletjs.com/)                                      | 1.9.4   | Mapas interactivos            |
| [Chart.js](https://www.chartjs.org/)                                      | 4.4.2   | Gráficas y gauge              |
| [AOS.js](https://michalsnik.github.io/aos/)                               | 2.3.4   | Animaciones de scroll         |
| [Font Awesome](https://fontawesome.com/)                                  | 6.5.1   | Iconografía                   |
| [Google Fonts](https://fonts.google.com/)                                 | —       | Tipografía Poppins            |
| [Vercel Edge Functions](https://vercel.com/docs/functions/edge-functions) | —       | Proxy API                     |

---

## 📊 Fuentes de Datos

- **FAO (2006)** — _Livestock's Long Shadow: Environmental Issues and Options_
- **Poore, J. et al. (2018)** — _Reducing food's environmental impacts through producers and consumers_, Science
- **WWF (2020)** — _Living Planet Report_
- **IPCC AR6 (2022)** — _Climate Change 2022: Mitigation of Climate Change_
- **CONAFOR (2023)** — _Inventario Nacional Forestal y de Suelos_
- **SEMARNAT (2022)** — _Informe de la Situación del Medio Ambiente en México_
- **Global Forest Watch** — [globalforestwatch.org](https://www.globalforestwatch.org/)
- **Hansen/UMD/Google/USGS/NASA** — _Global Forest Change Dataset_

---

## 📄 Licencia

Este proyecto es de carácter académico y educativo. Los datos utilizados son de fuentes públicas con sus respectivos créditos. El código es de libre uso con fines educativos y no comerciales.

---

_"Los bosques son los pulmones de la Tierra. Conocerlos es el primer paso para protegerlos."_
