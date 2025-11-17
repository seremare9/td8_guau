// controllers/evento_salud.controller.js

const pool = require("../config/db.config.js");

// Función auxiliar para mapear tipos del frontend al backend
const mapTipoEvento = (tipoComponente) => {
  const mapping = {
    vacunas: "vacunacion",
    vacunacion: "vacunacion",
    medicina: "medicina",
    antiparasitario: "antiparasitario",
    veterinario: "visita_veterinario",
    visita_veterinario: "visita_veterinario",
    higiene: "otro", // Higiene no está en el enum, lo mapeamos a "otro"
    otro: "otro",
    sintomas: "sintomas",
  };
  return mapping[tipoComponente?.toLowerCase()] || "otro";
};

// Función auxiliar para mapear frecuencia
const mapFrecuencia = (frecuencia) => {
  const mapping = {
    nunca: "nunca",
    diario: "diario",
    semanalmente: "semanalmente",
    quincenalmente: "quincenalmente",
    mensualmente: "mensualmente",
    cada_2_meses: "cada_2_meses",
    cada_6_meses: "cada_6_meses",
    anualmente: "anualmente",
  };
  return mapping[frecuencia?.toLowerCase()] || "nunca";
};

// 1. Función para obtener todos los eventos de salud
const getEventosSalud = async (req, res) => {
  try {
    const { id_animal, tipo } = req.query;
    let query = "SELECT * FROM evento_salud WHERE 1=1";
    const params = [];
    let paramIndex = 1;

    if (id_animal) {
      query += ` AND id_animal = $${paramIndex++}`;
      params.push(id_animal);
    }

    if (tipo) {
      query += ` AND tipo = $${paramIndex++}`;
      params.push(tipo);
    }

    query += " ORDER BY fecha DESC, creado_en DESC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Error en el servidor" });
  }
};

// 2. Función para obtener eventos de un animal específico
const getEventosByAnimal = async (req, res) => {
  try {
    const { id_animal } = req.params;
    const { tipo } = req.query;
    
    let query = "SELECT * FROM evento_salud WHERE id_animal = $1";
    const params = [id_animal];
    let paramIndex = 2;

    if (tipo) {
      query += ` AND tipo = $${paramIndex++}`;
      params.push(tipo);
    }

    query += " ORDER BY fecha DESC, creado_en DESC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Error en el servidor" });
  }
};

// 3. Función para obtener un evento por ID
const getEventoById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM evento_salud WHERE id_evento = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Error en el servidor" });
  }
};

// 4. Función para crear un nuevo evento de salud
const createEventoSalud = async (req, res) => {
  try {
    const {
      id_animal,
      nombre,
      fecha,
      hora,
      notas,
      foto_url,
      tipo_componente, // Tipo del componente frontend (vacunas, medicina, etc.)
      tipo, // Tipo directo del enum (opcional, si se proporciona tiene prioridad)
      repetir,
      proxima_fecha,
    } = req.body;

    // Validaciones básicas
    if (!id_animal || !nombre || !fecha) {
      return res.status(400).json({
        message: "Faltan campos requeridos: id_animal, nombre, fecha",
      });
    }

    // Verificar que el animal exista
    const animalExists = await pool.query("SELECT id_animal FROM animal WHERE id_animal = $1", [
      id_animal,
    ]);

    if (animalExists.rows.length === 0) {
      return res.status(404).json({ message: "Animal no encontrado" });
    }

    // Mapear tipo de evento
    const tipoEvento = tipo || mapTipoEvento(tipo_componente);

    // Mapear frecuencia
    const frecuenciaMapeada = mapFrecuencia(repetir);

    // Insertar el nuevo evento
    const result = await pool.query(
      `INSERT INTO evento_salud (id_animal, nombre, fecha, hora, notas, foto_url, tipo, repetir, proxima_fecha) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [
        id_animal,
        nombre,
        fecha,
        hora || null,
        notas || null,
        foto_url || null,
        tipoEvento,
        frecuenciaMapeada,
        proxima_fecha || null,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    if (err.code === "23503") {
      res.status(400).json({ message: "Error de referencia: verifique el id_animal" });
    } else if (err.code === "23514") {
      res.status(400).json({ message: "Datos inválidos: verifique las restricciones" });
    } else {
      res.status(500).send({ message: "Error en el servidor" });
    }
  }
};

// 5. Función para actualizar un evento de salud
const updateEventoSalud = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, fecha, hora, notas, foto_url, tipo_componente, tipo, repetir, proxima_fecha } =
      req.body;

    // Verificar que el evento exista
    const existingEvento = await pool.query("SELECT id_evento FROM evento_salud WHERE id_evento = $1", [id]);

    if (existingEvento.rows.length === 0) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    // Construir la consulta dinámicamente
    const campos = [];
    const valores = [];
    let paramIndex = 1;

    if (nombre !== undefined) {
      campos.push(`nombre = $${paramIndex++}`);
      valores.push(nombre);
    }
    if (fecha !== undefined) {
      campos.push(`fecha = $${paramIndex++}`);
      valores.push(fecha);
    }
    if (hora !== undefined) {
      campos.push(`hora = $${paramIndex++}`);
      valores.push(hora);
    }
    if (notas !== undefined) {
      campos.push(`notas = $${paramIndex++}`);
      valores.push(notas);
    }
    if (foto_url !== undefined) {
      campos.push(`foto_url = $${paramIndex++}`);
      valores.push(foto_url);
    }
    if (tipo !== undefined || tipo_componente !== undefined) {
      const tipoEvento = tipo || mapTipoEvento(tipo_componente);
      campos.push(`tipo = $${paramIndex++}`);
      valores.push(tipoEvento);
    }
    if (repetir !== undefined) {
      const frecuenciaMapeada = mapFrecuencia(repetir);
      campos.push(`repetir = $${paramIndex++}`);
      valores.push(frecuenciaMapeada);
    }
    if (proxima_fecha !== undefined) {
      campos.push(`proxima_fecha = $${paramIndex++}`);
      valores.push(proxima_fecha);
    }

    if (campos.length === 0) {
      return res.status(400).json({ message: "No se proporcionaron campos para actualizar" });
    }

    valores.push(id);
    const query = `UPDATE evento_salud SET ${campos.join(", ")} WHERE id_evento = $${paramIndex} RETURNING *`;

    const result = await pool.query(query, valores);

    res.json(result.rows[0]);
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

// 6. Función para eliminar un evento de salud
const deleteEventoSalud = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el evento exista
    const existingEvento = await pool.query("SELECT id_evento FROM evento_salud WHERE id_evento = $1", [id]);

    if (existingEvento.rows.length === 0) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    // Eliminar el evento (las fotos se eliminarán en cascada)
    await pool.query("DELETE FROM evento_salud WHERE id_evento = $1", [id]);

    res.json({ message: "Evento eliminado correctamente" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Error en el servidor" });
  }
};

// Exportar todas las funciones
module.exports = {
  getEventosSalud,
  getEventosByAnimal,
  getEventoById,
  createEventoSalud,
  updateEventoSalud,
  deleteEventoSalud,
};



