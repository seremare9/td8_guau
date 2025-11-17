// Importamos la librería 'pg' (node-postgres)
const { Pool } = require("pg");

// Importamos 'dotenv' para cargar las variables de entorno
require("dotenv").config();

// Creamos un "pool" de conexiones a la base de datos
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

// Exportamos el 'pool' para poder usarlo en otros archivos (como los controladores)
module.exports = pool;
