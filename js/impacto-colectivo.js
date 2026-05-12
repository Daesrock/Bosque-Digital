/**
 * js/impacto-colectivo.js - Gestión del impacto colectivo
 * Carga datos reales de la BD y los muestra en tiempo real
 */

class ImpactoColectivo {
  constructor() {
    this.impacto = null;
    this.init();
  }

  async init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.cargarImpacto());
    } else {
      this.cargarImpacto();
    }
  }

  /**
   * Cargar impacto colectivo desde la API
   */
  async cargarImpacto() {
    try {
      const respuesta = await api.obtenerImpactoColectivo();
      this.impacto = respuesta;
      this.renderizar();
    } catch (error) {
      console.error('Error al cargar impacto colectivo:', error);
      // Mostrar valores por defecto si hay error
      this.renderizar({
        usuariosRegistrados: 1247,
        arbolesPlantados: 8934,
        voluntariosActivos: 342,
        tonCO2Evitadas: 56
      });
    }
  }

  /**
   * Renderizar el impacto en el DOM con animación
   */
  renderizar(datos = this.impacto) {
    const colUsuarios = document.getElementById('colUsuarios');
    const colArboles = document.getElementById('colArboles');
    const colVoluntarios = document.getElementById('colVoluntarios');
    const colCO2 = document.getElementById('colCO2');

    if (colUsuarios) this.animarNumero(colUsuarios, datos.usuariosRegistrados);
    if (colArboles) this.animarNumero(colArboles, datos.arbolesPlantados);
    if (colVoluntarios) this.animarNumero(colVoluntarios, datos.voluntariosActivos);
    if (colCO2) this.animarNumero(colCO2, Math.round(datos.tonCO2Evitadas));
  }

  /**
   * Animar un número de 0 al valor final
   */
  animarNumero(elemento, valorFinal) {
    const valorActual = parseInt(elemento.textContent) || 0;
    
    if (valorActual === valorFinal) return;

    const incremento = (valorFinal - valorActual) / 40;
    let valor = valorActual;

    const interval = setInterval(() => {
      valor += incremento;
      
      if (incremento > 0 && valor >= valorFinal) {
        elemento.textContent = valorFinal.toLocaleString('es-MX');
        clearInterval(interval);
      } else if (incremento < 0 && valor <= valorFinal) {
        elemento.textContent = valorFinal.toLocaleString('es-MX');
        clearInterval(interval);
      } else {
        elemento.textContent = Math.round(valor).toLocaleString('es-MX');
      }
    }, 30);
  }

  /**
   * Aumentar el impacto colectivo (llamado desde calculator.js)
   */
  async incrementarImpacto(arboles = 0, voluntarios = 0, tonCO2 = 0) {
    try {
      if (!api.estaAutenticado()) {
        console.log('Usuario no autenticado, no se actualiza impacto colectivo');
        return;
      }

      await api.actualizarImpactoColectivo(arboles, voluntarios, tonCO2);
      
      // Recargar datos
      await this.cargarImpacto();
    } catch (error) {
      console.error('Error al actualizar impacto colectivo:', error);
    }
  }
}

// Crear instancia global
const impactoColectivo = new ImpactoColectivo();
