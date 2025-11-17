const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Importamos la configuración de la base de datos
// (El archivo db.config.js no exporta nada, solo se ejecuta para conectar)
require("./config/db.config.js");

const app = express();
const PORT = process.env.PORT || 4001; // Usamos el puerto de .env o 4001

// === Middlewares ===
// cors: Permite que tu app React (en otro puerto) haga peticiones a este servidor
app.use(cors());

// express.json: Permite que el servidor entienda datos JSON enviados en peticiones (ej. POST, PUT)
app.use(express.json());

// === Rutas ===
// Ruta de prueba para verificar que el servidor funciona
app.get("/", (req, res) => {
  res.send("Servidor backend funcionando correctamente!");
});

// Rutas de la API
app.use("/api/dueño", require("./routes/dueño.routes.js"));
app.use("/api/animal", require("./routes/animal.routes.js"));
app.use("/api/evento-salud", require("./routes/evento_salud.routes.js"));
app.use("/api/peso", require("./routes/peso.routes.js"));

// === Iniciar el servidor ===
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
