// routes/animal.routes.js

const express = require("express");
const router = express.Router();

// Importamos todas las funciones del controlador
const {
  getAnimales,
  getAnimalesByDueno,
  getAnimalById,
  createAnimal,
  updateAnimal,
  deleteAnimal,
} = require("../controllers/animal.controller.js");

// Rutas para animales

// GET /api/animal - Obtener todos los animales
router.get("/", getAnimales);

// GET /api/animal/dueno/:id_dueno - Obtener animales de un dueno específico
router.get("/dueno/:id_dueno", getAnimalesByDueno);

// GET /api/animal/:id - Obtener un animal por ID
router.get("/:id", getAnimalById);

// POST /api/animal - Crear un nuevo animal
router.post("/", createAnimal);

// PUT /api/animal/:id - Actualizar un animal
router.put("/:id", updateAnimal);

// DELETE /api/animal/:id - Eliminar un animal
router.delete("/:id", deleteAnimal);

// Exportamos el router
module.exports = router;



