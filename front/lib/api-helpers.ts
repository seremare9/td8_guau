// Funciones helper para mapear datos entre el formato del frontend y el formato de la API

import { Animal, EventoSalud } from './api';

// Mapear Animal de la API al formato usado en el frontend
export function mapAnimalToFrontend(animal: Animal): {
  id: number;
  id_animal: number; // ID real de la base de datos
  name: string;
  breed: string;
  image: string;
  fullData: {
    name: string;
    breed: string;
    imageURL?: string;
    sex?: string;
    gender?: string;
    weight?: string;
    birthday?: string;
    approximateAge?: string;
    photos?: string[];
    appearance?: string;
    id_animal?: number; // Guardar el ID real también en fullData
  };
} {
  return {
    id: animal.id_animal + 10000, // Sumar 10000 para distinguir IDs reales de índices
    id_animal: animal.id_animal, // ID real de la base de datos
    name: animal.nombre,
    breed: animal.raza_nombre || 'Sin raza especificada',
    image: animal.foto_url || '',
    fullData: {
      name: animal.nombre,
      breed: animal.raza_nombre || 'Sin raza especificada',
      imageURL: animal.foto_url,
      sex: animal.sexo,
      gender: animal.sexo,
      birthday: animal.fecha_nacimiento,
      approximateAge: animal.edad?.toString(),
      appearance: animal.color,
      id_animal: animal.id_animal, // Guardar el ID real
    },
  };
}

// Mapear datos del frontend a Animal para la API
export function mapFrontendToAnimal(data: {
  nombre: string;
  raza_nombre: string;
  edad?: number;
  sexo: string;
  fecha_nacimiento?: string;
  color?: string;
  tamaño: string;
  foto_url?: string;
  estado?: string;
  id_dueño?: number;
}): Parameters<typeof import('./api').animalApi.create>[0] {
  return {
    nombre: data.nombre,
    raza_nombre: data.raza_nombre,
    edad: data.edad,
    sexo: data.sexo,
    fecha_nacimiento: data.fecha_nacimiento,
    color: data.color,
    tamaño: data.tamaño,
    foto_url: data.foto_url,
    estado: data.estado,
    id_dueño: data.id_dueño,
  };
}

// Mapear EventoSalud de la API al formato usado en el frontend
export function mapEventoToFrontend(evento: EventoSalud, petName: string): {
  id: string;
  tipo: string;
  fecha: string;
  horario?: string;
  petName: string;
  eventType: string;
} {
  // Mapear tipos de eventos
  const tipoMap: Record<string, string> = {
    vacunacion: 'vacuna',
    higiene: 'higiene',
    medicina: 'medicina',
    antiparasitario: 'antiparasitario',
    veterinario: 'veterinario',
    otro: 'otro',
  };

  const eventType = tipoMap[evento.tipo] || evento.tipo;

  return {
    id: evento.id_evento.toString(),
    tipo: evento.nombre,
    fecha: evento.fecha,
    petName,
    eventType,
  };
}

// Mapear datos del frontend a EventoSalud para la API
export function mapFrontendToEvento(data: {
  id_animal: number;
  tipo: string;
  nombre: string;
  fecha: string;
  descripcion?: string;
  veterinario?: string;
  costo?: number;
  proxima_fecha?: string;
  es_recurrente?: boolean;
  frecuencia_dias?: number;
  es_aplicada?: boolean;
}): Parameters<typeof import('./api').eventoSaludApi.create>[0] {
  return {
    id_animal: data.id_animal,
    tipo: data.tipo,
    nombre: data.nombre,
    fecha: data.fecha,
    descripcion: data.descripcion,
    veterinario: data.veterinario,
    costo: data.costo,
    proxima_fecha: data.proxima_fecha,
    es_recurrente: data.es_recurrente,
    frecuencia_dias: data.frecuencia_dias,
    es_aplicada: data.es_aplicada,
  };
}

