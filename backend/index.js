const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Importamos la configuración de la base de datos
// (El archivo db.config.js no exporta nada, solo se ejecuta para conectar)
require("./config/db.config.js");

const app = express();
const PORT = process.env.PORT || 4001; // Usamos el puerto de .env (debe coincidir con el frontend)

// === Middlewares ===
// cors: Permite que tu app React (en otro puerto) haga peticiones a este servidor
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// express.json: Permite que el servidor entienda datos JSON enviados en peticiones (ej. POST, PUT)
// Aumentamos el límite a 50MB para permitir imágenes en base64
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Este código imprimirá en la terminal cada vez que alguien toque la puerta
app.use((req, res, next) => {
  console.log(`\n📢 PETICIÓN RECIBIDA: ${req.method} ${req.url}`);
  console.log("📦 Datos recibidos (body):", req.body);
  console.log("------------------------------------------------");
  next(); // Importante: deja pasar la petición a las rutas
});

// === Rutas ===
// Ruta de prueba para verificar que el servidor funciona
app.get("/", (req, res) => {
  res.send("Servidor backend funcionando correctamente!");
});

// Rutas de la API
app.use("/api/dueno", require("./routes/dueno.routes.js"));
app.use("/api/animal", require("./routes/animal.routes.js"));
app.use("/api/evento-salud", require("./routes/evento_salud.routes.js"));
app.use("/api/peso", require("./routes/peso.routes.js"));
app.use("/api/animal-foto", require("./routes/animal_foto.routes.js"));

// === Iniciar el servidor ===
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
