// routes/evento_salud.routes.js

const express = require("express");
const router = express.Router();

// Importamos todas las funciones del controlador
const {
  getEventosSalud,
  getEventosByAnimal,
  getEventoById,
  createEventoSalud,
  updateEventoSalud,
  deleteEventoSalud,
} = require("../controllers/evento_salud.controller.js");

// Rutas para eventos de salud

// GET /api/evento-salud - Obtener todos los eventos (opcional: ?id_animal=1&tipo=vacunacion)
router.get("/", getEventosSalud);

// GET /api/evento-salud/animal/:id_animal - Obtener eventos de un animal (opcional: ?tipo=vacunacion)
router.get("/animal/:id_animal", getEventosByAnimal);

// GET /api/evento-salud/:id - Obtener un evento por ID
router.get("/:id", getEventoById);

// POST /api/evento-salud - Crear un nuevo evento
router.post("/", createEventoSalud);

// PUT /api/evento-salud/:id - Actualizar un evento
router.put("/:id", updateEventoSalud);

// DELETE /api/evento-salud/:id - Eliminar un evento
router.delete("/:id", deleteEventoSalud);

// Exportamos el router
module.exports = router;



