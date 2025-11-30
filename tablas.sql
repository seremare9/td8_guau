-- Tipos enumerados (dominios del diagrama)

CREATE TYPE tamaño_animal AS ENUM ('chico','mediano','grande');

CREATE TYPE sexo_animal   AS ENUM ('macho','hembra');

CREATE TYPE tipo_evento   AS ENUM ('medicina','vacunacion','visita_veterinario','sintomas','antiparasitario','otro');

CREATE TYPE frecuencia    AS ENUM ('nunca','diario','semanalmente','quincenalmente','mensualmente','cada_2_meses','cada_6_meses','anualmente');

CREATE TYPE tipo_padre AS ENUM ('acabo de tener un perro', 'ya conozco bien a mi perro', 'futuro padre de perro');

CREATE TABLE raza (
  id_raza BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL UNIQUE
);

CREATE TABLE dueño (
  id_dueño BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(150) NOT NULL UNIQUE,
  contraseña VARCHAR(200) NOT NULL, -- idealmente hash
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now(),
  tipo_padre tipo_padre NOT NULL,
  foto_url TEXT, -- Opcional: foto de perfil del dueño
  notificaciones_activas BOOLEAN DEFAULT TRUE, -- Si el dueño quiere recibir notificaciones
  CONSTRAINT chk_email_valido CHECK (correo ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_dueño_correo ON dueño(correo);

CREATE TABLE animal (
  id_animal BIGSERIAL PRIMARY KEY,
  id_raza BIGINT NOT NULL REFERENCES raza(id_raza),
  nombre VARCHAR(100) NOT NULL,
  edad INT,
  sexo sexo_animal NOT NULL,
  fecha_nacimiento  DATE,
  color VARCHAR(60),
  tamaño tamaño_animal NOT NULL,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now(),
  foto_url TEXT, -- Foto principal del animal
  estado VARCHAR(20) DEFAULT 'activo', -- 'activo', 'fallecido', 'perdido', etc.
  CONSTRAINT chk_edad_no_negativa CHECK (edad IS NULL OR edad >= 0),
  CONSTRAINT chk_fn_future CHECK (fecha_nacimiento IS NULL OR fecha_nacimiento <= CURRENT_DATE)
);

CREATE INDEX idx_animal_raza ON animal(id_raza);
CREATE INDEX idx_animal_nombre ON animal(nombre);

-- =========================
-- Relación M:N DUEÑO <-> ANIMAL  (cuida)
-- =========================
CREATE TABLE dueño_animal (
  id_dueño   BIGINT NOT NULL REFERENCES dueño(id_dueño)   ON DELETE CASCADE,
  id_animal  BIGINT NOT NULL REFERENCES animal(id_animal) ON DELETE CASCADE,
  es_principal BOOLEAN NOT NULL DEFAULT FALSE,  -- por si un animal tiene varios cuidadores
  desde DATE,
  PRIMARY KEY (id_dueño, id_animal)
);

CREATE INDEX idx_dueño_animal_dueño ON dueño_animal(id_dueño);
CREATE INDEX idx_dueño_animal_animal ON dueño_animal(id_animal);
CREATE INDEX idx_dueño_animal_principal ON dueño_animal(id_animal, es_principal) WHERE es_principal = TRUE;

CREATE TABLE peso (
  id_peso     BIGSERIAL PRIMARY KEY,
  id_animal   BIGINT NOT NULL REFERENCES animal(id_animal) ON DELETE CASCADE,
  kg          NUMERIC(5,2) NOT NULL, -- Permite decimales (ej: 12.35)
  fecha       DATE         NOT NULL DEFAULT CURRENT_DATE,
  creado_en   TIMESTAMPTZ  NOT NULL DEFAULT now(),
  CONSTRAINT chk_peso_positivo CHECK (kg > 0)
);

CREATE INDEX idx_peso_animal_fecha ON peso(id_animal, fecha DESC);

CREATE TABLE evento_salud (
  id_evento    BIGSERIAL PRIMARY KEY,
  id_animal    BIGINT NOT NULL REFERENCES animal(id_animal) ON DELETE CASCADE,
  nombre       VARCHAR(150) NOT NULL,           -- título corto del evento
  fecha        DATE         NOT NULL,
  hora         TIME,                             -- opcional
  notas        TEXT,
  foto_url     TEXT,                             -- "agregar foto" (ruta/URL)
  tipo         tipo_evento  NOT NULL,            -- medicina, vacunacion, etc.
  repetir      frecuencia    NOT NULL DEFAULT 'nunca',
  proxima_fecha DATE,                            -- Fecha calculada para el próximo evento (si aplica)
  creado_en    TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX idx_evento_animal_fecha ON evento_salud(id_animal, fecha DESC);
CREATE INDEX idx_evento_tipo ON evento_salud(tipo);
CREATE INDEX idx_evento_proxima_fecha ON evento_salud(proxima_fecha) WHERE proxima_fecha IS NOT NULL;



CREATE TABLE animal_foto (
  id_foto BIGSERIAL PRIMARY KEY,
  id_animal BIGINT NOT NULL REFERENCES animal(id_animal) ON DELETE CASCADE,
  foto_url TEXT NOT NULL,
  es_principal BOOLEAN DEFAULT FALSE,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_animal_foto_animal ON animal_foto(id_animal);

