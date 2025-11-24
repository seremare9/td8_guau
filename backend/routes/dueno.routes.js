// routes/dueño.routes.js

const express = require("express");
const router = express.Router();

// Importamos todas las funciones del controlador
const {
  getDuenos,
  getDuenoById,
  createDueno,
  updateDueno,
  deleteDueno,
} = require("../controllers/dueno.controller.js");

// Rutas para dueños

// GET /api/dueño - Obtener todos los dueños
router.get("/", getDuenos);

// GET /api/dueño/:id - Obtener un dueño por ID
router.get("/:id", getDuenoById);

// POST /api/dueño - Crear un nuevo dueño
router.post("/", createDueno);

// PUT /api/dueño/:id - Actualizar un dueño
router.put("/:id", updateDueno);

// DELETE /api/dueño/:id - Eliminar un dueño
router.delete("/:id", deleteDueno);

// Exportamos el router
module.exports = router;
