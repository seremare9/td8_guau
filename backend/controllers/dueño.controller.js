// controllers/dueño.controller.js

// 1. Importamos el 'pool' (la conexión a la BD)
const pool = require("../config/db.config.js");

// 2. Función para obtener todos los dueños
const getDueños = async (req, res) => {
  try {
    // 3. Ejecutamos la consulta SQL
    const result = await pool.query("SELECT id_dueño, nombre, correo, creado_en, tipo_padre, foto_url, notificaciones_activas FROM dueño ORDER BY creado_en DESC");

    // 4. Respondemos al frontend con los resultados
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Error en el servidor" });
  }
};

// 3. Función para obtener un dueño por ID
const getDueñoById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT id_dueño, nombre, correo, creado_en, tipo_padre, foto_url, notificaciones_activas FROM dueño WHERE id_dueño = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Dueño no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Error en el servidor" });
  }
};

// 4. Función para crear un nuevo dueño
const createDueño = async (req, res) => {
  try {
    const { nombre, correo, contraseña, tipo_padre, foto_url, notificaciones_activas } = req.body;

    // Validaciones básicas
    if (!nombre || !correo || !contraseña || !tipo_padre) {
      return res.status(400).json({ 
        message: "Faltan campos requeridos: nombre, correo, contraseña, tipo_padre" 
      });
    }

    // Verificar que el correo no esté ya registrado
    const existingDueño = await pool.query(
      "SELECT id_dueño FROM dueño WHERE correo = $1",
      [correo]
    );

    if (existingDueño.rows.length > 0) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // Insertar el nuevo dueño
    const result = await pool.query(
      `INSERT INTO dueño (nombre, correo, contraseña, tipo_padre, foto_url, notificaciones_activas) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id_dueño, nombre, correo, creado_en, tipo_padre, foto_url, notificaciones_activas`,
      [nombre, correo, contraseña, tipo_padre, foto_url || null, notificaciones_activas !== undefined ? notificaciones_activas : true]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    if (err.code === "23505") {
      // Violación de restricción única
      res.status(400).json({ message: "El correo ya está registrado" });
    } else if (err.code === "23514") {
      // Violación de constraint check
      res.status(400).json({ message: "Datos inválidos. Verifique el formato del correo." });
    } else {
      res.status(500).send({ message: "Error en el servidor" });
    }
  }
};

// 5. Función para actualizar un dueño
const updateDueño = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo, contraseña, tipo_padre, foto_url, notificaciones_activas } = req.body;

    // Verificar que el dueño exista
    const existingDueño = await pool.query(
      "SELECT id_dueño FROM dueño WHERE id_dueño = $1",
      [id]
    );

    if (existingDueño.rows.length === 0) {
      return res.status(404).json({ message: "Dueño no encontrado" });
    }

    // Si se intenta cambiar el correo, verificar que no esté en uso
    if (correo) {
      const correoExistente = await pool.query(
        "SELECT id_dueño FROM dueño WHERE correo = $1 AND id_dueño != $2",
        [correo, id]
      );

      if (correoExistente.rows.length > 0) {
        return res.status(400).json({ message: "El correo ya está en uso por otro usuario" });
      }
    }

    // Construir la consulta dinámicamente según los campos proporcionados
    const campos = [];
    const valores = [];
    let paramIndex = 1;

    if (nombre !== undefined) {
      campos.push(`nombre = $${paramIndex++}`);
      valores.push(nombre);
    }
    if (correo !== undefined) {
      campos.push(`correo = $${paramIndex++}`);
      valores.push(correo);
    }
    if (contraseña !== undefined) {
      campos.push(`contraseña = $${paramIndex++}`);
      valores.push(contraseña);
    }
    if (tipo_padre !== undefined) {
      campos.push(`tipo_padre = $${paramIndex++}`);
      valores.push(tipo_padre);
    }
    if (foto_url !== undefined) {
      campos.push(`foto_url = $${paramIndex++}`);
      valores.push(foto_url);
    }
    if (notificaciones_activas !== undefined) {
      campos.push(`notificaciones_activas = $${paramIndex++}`);
      valores.push(notificaciones_activas);
    }

    if (campos.length === 0) {
      return res.status(400).json({ message: "No se proporcionaron campos para actualizar" });
    }

    valores.push(id);
    const query = `UPDATE dueño SET ${campos.join(", ")} WHERE id_dueño = $${paramIndex} RETURNING id_dueño, nombre, correo, creado_en, tipo_padre, foto_url, notificaciones_activas`;

    const result = await pool.query(query, valores);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    if (err.code === "23505") {
      res.status(400).json({ message: "El correo ya está registrado" });
    } else if (err.code === "23514") {
      res.status(400).json({ message: "Datos inválidos. Verifique el formato del correo." });
    } else {
      res.status(500).send({ message: "Error en el servidor" });
    }
  }
};

// 6. Función para eliminar un dueño
const deleteDueño = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el dueño exista
    const existingDueño = await pool.query(
      "SELECT id_dueño FROM dueño WHERE id_dueño = $1",
      [id]
    );

    if (existingDueño.rows.length === 0) {
      return res.status(404).json({ message: "Dueño no encontrado" });
    }

    // Eliminar el dueño (las relaciones se eliminarán en cascada según el esquema)
    await pool.query("DELETE FROM dueño WHERE id_dueño = $1", [id]);

    res.json({ message: "Dueño eliminado correctamente" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Error en el servidor" });
  }
};

// 7. Exportamos todas las funciones
module.exports = {
  getDueños,
  getDueñoById,
  createDueño,
  updateDueño,
  deleteDueño,
};
