
// Importamos el 'pool' (la conexión a la BD)
const pool = require("../config/db.config.js");

// Función para obtener todos los duenos
const getDuenos = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id_dueño, nombre, correo, creado_en, tipo_padre, foto_url, notificaciones_activas FROM dueño ORDER BY creado_en DESC"
    );

    // Respondemos al frontend con los resultados
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Error en el servidor" });
  }
};

// Función para obtener un dueno por ID
const getDuenoById = async (req, res) => {
  try {
    const { id } = req.params;
   
    const result = await pool.query(
      "SELECT id_dueño, nombre, correo, creado_en, tipo_padre, foto_url, notificaciones_activas FROM dueño WHERE id_dueño = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Dueno no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Error en el servidor" });
  }
};

// Función para crear un nuevo dueno
const createDueno = async (req, res) => {
  console.log(
    "¡ENTRÓ AL CONTROLADOR! Intentando guardar en tabla 'dueño'..."
  );

  try {
    const {
      nombre,
      correo,
      contraseña,
      tipo_padre,
      foto_url,
      notificaciones_activas,
    } = req.body;

    if (!nombre || !correo || !contraseña || !tipo_padre) {
      return res.status(400).json({
        message:
          "Faltan campos requeridos: nombre, correo, contraseña, tipo_padre",
      });
    }

    const existingDueno = await pool.query(
      "SELECT id_dueño FROM dueño WHERE correo = $1",
      [correo]
    );

    if (existingDueno.rows.length > 0) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    const result = await pool.query(
      `INSERT INTO dueño (nombre, correo, contraseña, tipo_padre, foto_url, notificaciones_activas) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id_dueño, nombre, correo, creado_en, tipo_padre, foto_url, notificaciones_activas`,
      [
        nombre,
        correo,
        contraseña,
        tipo_padre,
        foto_url || null,
        notificaciones_activas !== undefined ? notificaciones_activas : true,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    if (err.code === "23505") {
      res.status(400).json({ message: "El correo ya está registrado" });
    } else if (err.code === "23514") {
      res
        .status(400)
        .json({ message: "Datos inválidos. Verifique el formato del correo." });
    } else {
      res.status(500).send({ message: "Error en el servidor" });
    }
  }
};

// Función para actualizar un dueno
const updateDueno = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      correo,
      contraseña,
      tipo_padre,
      foto_url,
      notificaciones_activas,
    } = req.body;

    const existingDueno = await pool.query(
      "SELECT id_dueño FROM dueño WHERE id_dueño = $1",
      [id]
    );

    if (existingDueno.rows.length === 0) {
      return res.status(404).json({ message: "Dueno no encontrado" });
    }

    if (correo) {
      const correoExistente = await pool.query(
        "SELECT id_dueño FROM dueño WHERE correo = $1 AND id_dueño != $2",
        [correo, id]
      );

      if (correoExistente.rows.length > 0) {
        return res
          .status(400)
          .json({ message: "El correo ya está en uso por otro usuario" });
      }
    }

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
      return res
        .status(400)
        .json({ message: "No se proporcionaron campos para actualizar" });
    }

    valores.push(id);
   
    const query = `UPDATE dueño SET ${campos.join(
      ", "
    )} WHERE id_dueño = $${paramIndex} RETURNING id_dueño, nombre, correo, creado_en, tipo_padre, foto_url, notificaciones_activas`;

    const result = await pool.query(query, valores);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    if (err.code === "23505") {
      res.status(400).json({ message: "El correo ya está registrado" });
    } else if (err.code === "23514") {
      res
        .status(400)
        .json({ message: "Datos inválidos. Verifique el formato del correo." });
    } else {
      res.status(500).send({ message: "Error en el servidor" });
    }
  }
};

// Función para eliminar un dueno
const deleteDueno = async (req, res) => {
  try {
    const { id } = req.params;

    const existingDueno = await pool.query(
      "SELECT id_dueño FROM dueño WHERE id_dueño = $1",
      [id]
    );

    if (existingDueno.rows.length === 0) {
      return res.status(404).json({ message: "Dueno no encontrado" });
    }


    res.json({ message: "Dueno eliminado correctamente" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Error en el servidor" });
  }
};

// Exportamos todas las funciones
module.exports = {
  getDuenos,
  getDuenoById,
  createDueno,
  updateDueno,
  deleteDueno,
};
