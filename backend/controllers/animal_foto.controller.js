// controllers/animal_foto.controller.js

const pool = require("../config/db.config.js");

// 1. Función para obtener todas las fotos de un animal
const getFotosByAnimal = async (req, res) => {
  try {
    const { id_animal } = req.params;
    const result = await pool.query(
      "SELECT * FROM animal_foto WHERE id_animal = $1 ORDER BY creado_en DESC",
      [id_animal]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Error en el servidor" });
  }
};

// 2. Función para obtener una foto por ID
const getFotoById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM animal_foto WHERE id_foto = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Foto no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Error en el servidor" });
  }
};

// 3. Función para crear una nueva foto
const createFoto = async (req, res) => {
  try {
    const { id_animal, foto_url } = req.body;

    // Validaciones básicas
    if (!id_animal || !foto_url) {
      return res.status(400).json({
        message: "Faltan campos requeridos: id_animal, foto_url",
      });
    }

    // Verificar que el animal exista
    const animalExists = await pool.query(
      "SELECT id_animal FROM animal WHERE id_animal = $1",
      [id_animal]
    );

    if (animalExists.rows.length === 0) {
      return res.status(404).json({ message: "Animal no encontrado" });
    }

    // Insertar la nueva foto
    const result = await pool.query(
      `INSERT INTO animal_foto (id_animal, foto_url) 
       VALUES ($1, $2) 
       RETURNING *`,
      [id_animal, foto_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    if (err.code === "23503") {
      res
        .status(400)
        .json({ message: "Error de referencia: verifique el id_animal" });
    } else {
      res.status(500).send({ message: "Error en el servidor: " + err.message });
    }
  }
};

// 4. Función para crear múltiples fotos a la vez
const createMultipleFotos = async (req, res) => {
  try {
    const { id_animal, fotos } = req.body; // fotos es un array de foto_url

    // Validaciones básicas
    if (!id_animal || !fotos || !Array.isArray(fotos) || fotos.length === 0) {
      return res.status(400).json({
        message: "Faltan campos requeridos: id_animal, fotos (array no vacío)",
      });
    }

    // Verificar que el animal exista
    const animalExists = await pool.query(
      "SELECT id_animal FROM animal WHERE id_animal = $1",
      [id_animal]
    );

    if (animalExists.rows.length === 0) {
      return res.status(404).json({ message: "Animal no encontrado" });
    }

    // Insertar todas las fotos
    const insertedFotos = [];
    for (const foto_url of fotos) {
      try {
        const result = await pool.query(
          `INSERT INTO animal_foto (id_animal, foto_url) 
           VALUES ($1, $2) 
           RETURNING *`,
          [id_animal, foto_url]
        );
        insertedFotos.push(result.rows[0]);
      } catch (err) {
        console.error(`Error al insertar foto ${foto_url}:`, err.message);
        // Continuar con las demás fotos
      }
    }

    res.status(201).json(insertedFotos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Error en el servidor: " + err.message });
  }
};

// 5. Función para eliminar una foto
const deleteFoto = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que la foto exista
    const existingFoto = await pool.query(
      "SELECT id_foto FROM animal_foto WHERE id_foto = $1",
      [id]
    );

    if (existingFoto.rows.length === 0) {
      return res.status(404).json({ message: "Foto no encontrada" });
    }

    // Eliminar la foto
    await pool.query("DELETE FROM animal_foto WHERE id_foto = $1", [id]);

    res.json({ message: "Foto eliminada correctamente" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Error en el servidor" });
  }
};

// 6. Función para eliminar todas las fotos de un animal
const deleteFotosByAnimal = async (req, res) => {
  try {
    const { id_animal } = req.params;

    // Verificar que el animal exista
    const animalExists = await pool.query(
      "SELECT id_animal FROM animal WHERE id_animal = $1",
      [id_animal]
    );

    if (animalExists.rows.length === 0) {
      return res.status(404).json({ message: "Animal no encontrado" });
    }

    // Eliminar todas las fotos del animal
    await pool.query("DELETE FROM animal_foto WHERE id_animal = $1", [id_animal]);

    res.json({ message: "Fotos eliminadas correctamente" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Error en el servidor" });
  }
};

// Exportar todas las funciones
module.exports = {
  getFotosByAnimal,
  getFotoById,
  createFoto,
  createMultipleFotos,
  deleteFoto,
  deleteFotosByAnimal,
};

