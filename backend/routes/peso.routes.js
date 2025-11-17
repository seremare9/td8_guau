// routes/peso.routes.js

const express = require("express");
const router = express.Router();

// Importamos todas las funciones del controlador
const {
  getPesos,
  getPesosByAnimal,
  getUltimoPesoByAnimal,
  getPesoById,
  createPeso,
  updatePeso,
  deletePeso,
} = require("../controllers/peso.controller.js");

// Rutas para registros de peso

// GET /api/peso - Obtener todos los registros (opcional: ?id_animal=1)
router.get("/", getPesos);

// GET /api/peso/animal/:id_animal - Obtener registros de peso de un animal
router.get("/animal/:id_animal", getPesosByAnimal);

// GET /api/peso/animal/:id_animal/ultimo - Obtener el último peso registrado de un animal
router.get("/animal/:id_animal/ultimo", getUltimoPesoByAnimal);

// GET /api/peso/:id - Obtener un registro de peso por ID
router.get("/:id", getPesoById);

// POST /api/peso - Crear un nuevo registro de peso
router.post("/", createPeso);

// PUT /api/peso/:id - Actualizar un registro de peso
router.put("/:id", updatePeso);

// DELETE /api/peso/:id - Eliminar un registro de peso
router.delete("/:id", deletePeso);

// Exportamos el router
module.exports = router;



