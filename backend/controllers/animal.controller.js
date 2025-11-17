// controllers/animal.controller.js

const pool = require("../config/db.config.js");

// 1. Función para obtener todos los animales
const getAnimales = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, r.nombre as raza_nombre 
       FROM animal a 
       JOIN raza r ON a.id_raza = r.id_raza 
       ORDER BY a.creado_en DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Error en el servidor" });
  }
};

// 2. Función para obtener animales de un dueño específico
const getAnimalesByDueño = async (req, res) => {
  try {
    const { id_dueño } = req.params;
    const result = await pool.query(
      `SELECT a.*, r.nombre as raza_nombre, da.es_principal, da.desde
       FROM animal a
       JOIN raza r ON a.id_raza = r.id_raza
       JOIN dueño_animal da ON a.id_animal = da.id_animal
       WHERE da.id_dueño = $1
       ORDER BY da.es_principal DESC, a.creado_en DESC`,
      [id_dueño]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Error en el servidor" });
  }
};

// 3. Función para obtener un animal por ID
const getAnimalById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT a.*, r.nombre as raza_nombre 
       FROM animal a 
       JOIN raza r ON a.id_raza = r.id_raza 
       WHERE a.id_animal = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Animal no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Error en el servidor" });
  }
};

// 4. Función auxiliar para obtener o crear una raza por nombre
const getOrCreateRaza = async (nombreRaza) => {
  try {
    // Primero intentar encontrar la raza
    let result = await pool.query("SELECT id_raza FROM raza WHERE nombre = $1", [nombreRaza]);

    if (result.rows.length > 0) {
      return result.rows[0].id_raza;
    }

    // Si no existe, crearla
    result = await pool.query(
      "INSERT INTO raza (nombre) VALUES ($1) RETURNING id_raza",
      [nombreRaza]
    );
    return result.rows[0].id_raza;
  } catch (err) {
    console.error("Error en getOrCreateRaza:", err.message);
    throw err;
  }
};

// 5. Función para mapear tamaño del frontend al backend
const mapTamaño = (gender) => {
  const mapping = {
    small: "chico",
    medium: "mediano",
    large: "grande",
    chico: "chico",
    mediano: "mediano",
    grande: "grande",
  };
  return mapping[gender?.toLowerCase()] || "mediano";
};

// 6. Función para crear un nuevo animal
const createAnimal = async (req, res) => {
  try {
    const { nombre, raza_nombre, edad, sexo, fecha_nacimiento, color, tamaño, foto_url, estado, id_dueño } = req.body;

    // Validaciones básicas
    if (!nombre || !raza_nombre || !sexo || !tamaño) {
      return res.status(400).json({
        message: "Faltan campos requeridos: nombre, raza_nombre, sexo, tamaño",
      });
    }

    // Obtener o crear la raza
    let id_raza;
    try {
      id_raza = await getOrCreateRaza(raza_nombre);
    } catch (err) {
      return res.status(400).json({ message: "Error al obtener/crear la raza" });
    }

    // Mapear tamaño
    const tamañoMapeado = mapTamaño(tamaño);

    // Calcular edad si no se proporciona pero sí fecha_nacimiento
    let edadCalculada = edad;
    if (!edad && fecha_nacimiento) {
      const fechaNac = new Date(fecha_nacimiento);
      const hoy = new Date();
      const años = hoy.getFullYear() - fechaNac.getFullYear();
      const mesActual = hoy.getMonth();
      const mesNac = fechaNac.getMonth();
      if (mesActual < mesNac || (mesActual === mesNac && hoy.getDate() < fechaNac.getDate())) {
        edadCalculada = años - 1;
      } else {
        edadCalculada = años;
      }
    }

    // Insertar el nuevo animal
    const result = await pool.query(
      `INSERT INTO animal (id_raza, nombre, edad, sexo, fecha_nacimiento, color, tamaño, foto_url, estado) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [
        id_raza,
        nombre,
        edadCalculada || null,
        sexo,
        fecha_nacimiento || null,
        color || null,
        tamañoMapeado,
        foto_url || null,
        estado || "activo",
      ]
    );

    const nuevoAnimal = result.rows[0];

    // Si se proporciona id_dueño, crear la relación
    if (id_dueño) {
      try {
        await pool.query(
          `INSERT INTO dueño_animal (id_dueño, id_animal, es_principal) 
           VALUES ($1, $2, $3) 
           ON CONFLICT (id_dueño, id_animal) DO NOTHING`,
          [id_dueño, nuevoAnimal.id_animal, true] // Primera mascota es principal por defecto
        );
      } catch (err) {
        console.error("Error al crear relación dueño_animal:", err.message);
        // No fallar si hay error en la relación, el animal ya está creado
      }
    }

    // Obtener el animal completo con la raza
    const animalCompleto = await pool.query(
      `SELECT a.*, r.nombre as raza_nombre 
       FROM animal a 
       JOIN raza r ON a.id_raza = r.id_raza 
       WHERE a.id_animal = $1`,
      [nuevoAnimal.id_animal]
    );

    res.status(201).json(animalCompleto.rows[0]);
  } catch (err) {
    console.error(err.message);
    if (err.code === "23503") {
      res.status(400).json({ message: "Error de referencia: verifique los datos proporcionados" });
    } else if (err.code === "23514") {
      res.status(400).json({ message: "Datos inválidos: verifique las restricciones" });
    } else {
      res.status(500).send({ message: "Error en el servidor" });
    }
  }
};

// 7. Función para actualizar un animal
const updateAnimal = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, raza_nombre, edad, sexo, fecha_nacimiento, color, tamaño, foto_url, estado } = req.body;

    // Verificar que el animal exista
    const existingAnimal = await pool.query("SELECT id_animal FROM animal WHERE id_animal = $1", [id]);

    if (existingAnimal.rows.length === 0) {
      return res.status(404).json({ message: "Animal no encontrado" });
    }

    // Construir la consulta dinámicamente
    const campos = [];
    const valores = [];
    let paramIndex = 1;

    if (nombre !== undefined) {
      campos.push(`nombre = $${paramIndex++}`);
      valores.push(nombre);
    }
    if (raza_nombre !== undefined) {
      // Obtener o crear la raza
      try {
        const id_raza = await getOrCreateRaza(raza_nombre);
        campos.push(`id_raza = $${paramIndex++}`);
        valores.push(id_raza);
      } catch (err) {
        return res.status(400).json({ message: "Error al obtener/crear la raza" });
      }
    }
    if (edad !== undefined) {
      campos.push(`edad = $${paramIndex++}`);
      valores.push(edad);
    }
    if (sexo !== undefined) {
      campos.push(`sexo = $${paramIndex++}`);
      valores.push(sexo);
    }
    if (fecha_nacimiento !== undefined) {
      campos.push(`fecha_nacimiento = $${paramIndex++}`);
      valores.push(fecha_nacimiento);
      
      // Recalcular edad si se actualiza fecha_nacimiento
      if (fecha_nacimiento) {
        const fechaNac = new Date(fecha_nacimiento);
        const hoy = new Date();
        const años = hoy.getFullYear() - fechaNac.getFullYear();
        const mesActual = hoy.getMonth();
        const mesNac = fechaNac.getMonth();
        let edadCalculada = años;
        if (mesActual < mesNac || (mesActual === mesNac && hoy.getDate() < fechaNac.getDate())) {
          edadCalculada = años - 1;
        }
        campos.push(`edad = $${paramIndex++}`);
        valores.push(edadCalculada);
      }
    }
    if (color !== undefined) {
      campos.push(`color = $${paramIndex++}`);
      valores.push(color);
    }
    if (tamaño !== undefined) {
      const tamañoMapeado = mapTamaño(tamaño);
      campos.push(`tamaño = $${paramIndex++}`);
      valores.push(tamañoMapeado);
    }
    if (foto_url !== undefined) {
      campos.push(`foto_url = $${paramIndex++}`);
      valores.push(foto_url);
    }
    if (estado !== undefined) {
      campos.push(`estado = $${paramIndex++}`);
      valores.push(estado);
    }

    if (campos.length === 0) {
      return res.status(400).json({ message: "No se proporcionaron campos para actualizar" });
    }

    valores.push(id);
    const query = `UPDATE animal SET ${campos.join(", ")} WHERE id_animal = $${paramIndex} RETURNING *`;

    const result = await pool.query(query, valores);

    // Obtener el animal completo con la raza
    const animalCompleto = await pool.query(
      `SELECT a.*, r.nombre as raza_nombre 
       FROM animal a 
       JOIN raza r ON a.id_raza = r.id_raza 
       WHERE a.id_animal = $1`,
      [id]
    );

    res.json(animalCompleto.rows[0]);
  } catch (err) {
    console.error(err.message);
    if (err.code === "23503") {
      res.status(400).json({ message: "Error de referencia" });
    } else if (err.code === "23514") {
      res.status(400).json({ message: "Datos inválidos" });
    } else {
      res.status(500).send({ message: "Error en el servidor" });
    }
  }
};

// 8. Función para eliminar un animal
const deleteAnimal = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el animal exista
    const existingAnimal = await pool.query("SELECT id_animal FROM animal WHERE id_animal = $1", [id]);

    if (existingAnimal.rows.length === 0) {
      return res.status(404).json({ message: "Animal no encontrado" });
    }

    // Eliminar el animal (las relaciones se eliminarán en cascada)
    await pool.query("DELETE FROM animal WHERE id_animal = $1", [id]);

    res.json({ message: "Animal eliminado correctamente" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Error en el servidor" });
  }
};

// Exportar todas las funciones
module.exports = {
  getAnimales,
  getAnimalesByDueño,
  getAnimalById,
  createAnimal,
  updateAnimal,
  deleteAnimal,
};



