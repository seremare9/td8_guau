// Importamos la librería 'pg' (node-postgres)
const { Pool } = require("pg");

require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Verificamos la conexión
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error al conectar con la base de datos:", err.stack);
  } else {
    console.log("Conexión exitosa a la base de datos en:", res.rows[0].now);
  }
});

module.exports = pool;
