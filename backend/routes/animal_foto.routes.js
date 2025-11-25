// routes/animal_foto.routes.js

const express = require("express");
const router = express.Router();

// Importamos todas las funciones del controlador
const {
  getFotosByAnimal,
  getFotoById,
  createFoto,
  createMultipleFotos,
  deleteFoto,
  deleteFotosByAnimal,
} = require("../controllers/animal_foto.controller.js");

// Rutas para fotos de animales

// GET /api/animal-foto/animal/:id_animal - Obtener todas las fotos de un animal
router.get("/animal/:id_animal", getFotosByAnimal);

// GET /api/animal-foto/:id - Obtener una foto por ID
router.get("/:id", getFotoById);

// POST /api/animal-foto - Crear una nueva foto
router.post("/", createFoto);

// POST /api/animal-foto/multiple - Crear múltiples fotos a la vez
router.post("/multiple", createMultipleFotos);

// DELETE /api/animal-foto/:id - Eliminar una foto
router.delete("/:id", deleteFoto);

// DELETE /api/animal-foto/animal/:id_animal - Eliminar todas las fotos de un animal
router.delete("/animal/:id_animal", deleteFotosByAnimal);

// Exportamos el router
module.exports = router;

