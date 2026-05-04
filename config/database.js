/**
 * config/database.js - Configuración de conexión a SQL Server
 */

const sql = require('mssql');

const config = {
  server: process.env.DB_SERVER || 'localhost',
  port: parseInt(process.env.DB_PORT) || 1433,
  database: process.env.DB_NAME || 'BosqueDigital',
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '',
  authentication: {
    type: 'default'
  },
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_CERT === 'true',
    connectTimeout: 30000,
    requestTimeout: 30000
  }
};

let pool = null;

/**
 * Obtener o crear pool de conexiones
 */
async function getPool() {
  if (pool) {
    return pool;
  }

  try {
    pool = new sql.ConnectionPool(config);
    
    pool.on('error', err => {
      console.error('Error en pool de conexiones:', err);
      pool = null;
    });

    await pool.connect();
    console.log('✓ Conectado a SQL Server');
    
    return pool;
  } catch (err) {
    console.error('Error conectando a BD:', err);
    throw err;
  }
}

/**
 * Ejecutar consulta
 */
async function query(sql, params = {}) {
  const pool = await getPool();
  const request = pool.request();

  // Agregar parámetros
  for (const [key, value] of Object.entries(params)) {
    request.input(key, value);
  }

  try {
    const result = await request.query(sql);
    return result;
  } catch (err) {
    console.error('Error en consulta:', err);
    throw err;
  }
}

/**
 * Cerrar conexión
 */
async function closePool() {
  if (pool) {
    await pool.close();
    pool = null;
    console.log('Conexión cerrada');
  }
}

module.exports = {
  getPool,
  query,
  closePool,
  sql
};
