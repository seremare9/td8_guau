// routes/dueño.routes.js

const express = require("express");
const router = express.Router();

// Importamos todas las funciones del controlador
const {
  getDueños,
  getDueñoById,
  createDueño,
  updateDueño,
  deleteDueño,
} = require("../controllers/dueño.controller.js");

// Rutas para dueños

// GET /api/dueño - Obtener todos los dueños
router.get("/", getDueños);

// GET /api/dueño/:id - Obtener un dueño por ID
router.get("/:id", getDueñoById);

// POST /api/dueño - Crear un nuevo dueño
router.post("/", createDueño);

// PUT /api/dueño/:id - Actualizar un dueño
router.put("/:id", updateDueño);

// DELETE /api/dueño/:id - Eliminar un dueño
router.delete("/:id", deleteDueño);

// Exportamos el router
module.exports = router;
