// controllers/peso.controller.js

const pool = require("../config/db.config.js");

// 1. Función para obtener todos los registros de peso
const getPesos = async (req, res) => {
  try {
    const { id_animal } = req.query;
    let query = "SELECT * FROM peso WHERE 1=1";
    const params = [];
    let paramIndex = 1;

    if (id_animal) {
      query += ` AND id_animal = $${paramIndex++}`;
      params.push(id_animal);
    }

    query += " ORDER BY fecha DESC, creado_en DESC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Error en el servidor" });
  }
};

// 2. Función para obtener registros de peso de un animal específico
const getPesosByAnimal = async (req, res) => {
  try {
    const { id_animal } = req.params;
    const result = await pool.query(
      "SELECT * FROM peso WHERE id_animal = $1 ORDER BY fecha DESC, creado_en DESC",
      [id_animal]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Error en el servidor" });
  }
};

// 3. Función para obtener el último peso registrado de un animal
const getUltimoPesoByAnimal = async (req, res) => {
  try {
    const { id_animal } = req.params;
    const result = await pool.query(
      "SELECT * FROM peso WHERE id_animal = $1 ORDER BY fecha DESC, creado_en DESC LIMIT 1",
      [id_animal]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No hay registros de peso para este animal" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Error en el servidor" });
  }
};

// 4. Función para obtener un registro de peso por ID
const getPesoById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM peso WHERE id_peso = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Registro de peso no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Error en el servidor" });
  }
};

// 5. Función para crear un nuevo registro de peso
const createPeso = async (req, res) => {
  try {
    const { id_animal, kg, fecha } = req.body;

    // Validaciones básicas
    if (!id_animal || !kg) {
      return res.status(400).json({
        message: "Faltan campos requeridos: id_animal, kg",
      });
    }

    // Validar que el peso sea positivo
    if (parseFloat(kg) <= 0) {
      return res.status(400).json({
        message: "El peso debe ser mayor a 0",
      });
    }

    // Verificar que el animal exista
    const animalExists = await pool.query("SELECT id_animal FROM animal WHERE id_animal = $1", [
      id_animal,
    ]);

    if (animalExists.rows.length === 0) {
      return res.status(404).json({ message: "Animal no encontrado" });
    }

    // Insertar el nuevo registro de peso
    const result = await pool.query(
      `INSERT INTO peso (id_animal, kg, fecha) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [id_animal, kg, fecha || new Date().toISOString().split("T")[0]]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    if (err.code === "23503") {
      res.status(400).json({ message: "Error de referencia: verifique el id_animal" });
    } else if (err.code === "23514") {
      res.status(400).json({ message: "Datos inválidos: el peso debe ser mayor a 0" });
    } else {
      res.status(500).send({ message: "Error en el servidor" });
    }
  }
};

// 6. Función para actualizar un registro de peso
const updatePeso = async (req, res) => {
  try {
    const { id } = req.params;
    const { kg, fecha } = req.body;

    // Verificar que el registro exista
    const existingPeso = await pool.query("SELECT id_peso FROM peso WHERE id_peso = $1", [id]);

    if (existingPeso.rows.length === 0) {
      return res.status(404).json({ message: "Registro de peso no encontrado" });
    }

    // Construir la consulta dinámicamente
    const campos = [];
    const valores = [];
    let paramIndex = 1;

    if (kg !== undefined) {
      // Validar que el peso sea positivo
      if (parseFloat(kg) <= 0) {
        return res.status(400).json({
          message: "El peso debe ser mayor a 0",
        });
      }
      campos.push(`kg = $${paramIndex++}`);
      valores.push(kg);
    }
    if (fecha !== undefined) {
      campos.push(`fecha = $${paramIndex++}`);
      valores.push(fecha);
    }

    if (campos.length === 0) {
      return res.status(400).json({ message: "No se proporcionaron campos para actualizar" });
    }

    valores.push(id);
    const query = `UPDATE peso SET ${campos.join(", ")} WHERE id_peso = $${paramIndex} RETURNING *`;

    const result = await pool.query(query, valores);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    if (err.code === "23514") {
      res.status(400).json({ message: "Datos inválidos: el peso debe ser mayor a 0" });
    } else {
      res.status(500).send({ message: "Error en el servidor" });
    }
  }
};

// 7. Función para eliminar un registro de peso
const deletePeso = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el registro exista
    const existingPeso = await pool.query("SELECT id_peso FROM peso WHERE id_peso = $1", [id]);

    if (existingPeso.rows.length === 0) {
      return res.status(404).json({ message: "Registro de peso no encontrado" });
    }

    // Eliminar el registro
    await pool.query("DELETE FROM peso WHERE id_peso = $1", [id]);

    res.json({ message: "Registro de peso eliminado correctamente" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Error en el servidor" });
  }
};

// Exportar todas las funciones
module.exports = {
  getPesos,
  getPesosByAnimal,
  getUltimoPesoByAnimal,
  getPesoById,
  createPeso,
  updatePeso,
  deletePeso,
};



