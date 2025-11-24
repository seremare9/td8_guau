// Script de prueba para iniciar el servidor y ver errores
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4001;

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor backend funcionando correctamente!");
});

// Intentar conectar a la base de datos (sin bloquear el servidor)
try {
  require("./config/db.config.js");
  console.log("✅ Configuración de BD cargada");
} catch (error) {
  console.error("⚠️  Error al cargar configuración de BD:", error.message);
  console.log("⚠️  El servidor iniciará pero las rutas de API pueden fallar");
}

// Cargar rutas
try {
  app.use("/api/dueno", require("./routes/dueño.routes.js"));
  app.use("/api/animal", require("./routes/animal.routes.js"));
  app.use("/api/evento-salud", require("./routes/evento_salud.routes.js"));
  app.use("/api/peso", require("./routes/peso.routes.js"));
  console.log("✅ Rutas cargadas");
} catch (error) {
  console.error("❌ Error al cargar rutas:", error.message);
}

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📡 Prueba en: http://localhost:${PORT}\n`);
}).on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Error: El puerto ${PORT} ya está en uso`);
    console.error(`💡 Solución: Cambia el puerto en .env o mata el proceso que lo está usando`);
  } else {
    console.error(`❌ Error al iniciar servidor:`, error.message);
  }
  process.exit(1);
});



