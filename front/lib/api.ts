// Cliente API para comunicarse con el backend
import { getApiUrl } from './api-config';

// Tipos para las respuestas de la API
export interface Dueño {
  id_dueño: number;
  nombre: string;
  correo: string;
  creado_en?: string;
  tipo_padre: string;
  foto_url?: string;
  notificaciones_activas?: boolean;
}

export interface Animal {
  id_animal: number;
  id_raza: number;
  nombre: string;
  edad?: number;
  sexo: string;
  fecha_nacimiento?: string;
  color?: string;
  tamaño: string;
  foto_url?: string;
  estado?: string;
  raza_nombre?: string;
  es_principal?: boolean;
  desde?: string;
}

export interface EventoSalud {
  id_evento: number;
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
}

export interface Peso {
  id_peso: number;
  id_animal: number;
  peso: number;
  fecha: string;
  notas?: string;
}

// Función helper para hacer peticiones
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = getApiUrl(endpoint);
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error en la petición' }));
    throw new Error(error.message || `Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// ========== API de Dueños ==========

export const dueñoApi = {
  // Obtener todos los dueños
  getAll: async (): Promise<Dueño[]> => {
    return fetchApi<Dueño[]>('/api/dueno');
  },

  // Obtener un dueño por ID
  getById: async (id: number): Promise<Dueño> => {
    return fetchApi<Dueño>(`/api/dueno/${id}`);
  },

  // Crear un nuevo dueño
  create: async (data: {
    nombre: string;
    correo: string;
    contraseña: string;
    tipo_padre: string;
    foto_url?: string;
    notificaciones_activas?: boolean;
  }): Promise<Dueño> => {
    return fetchApi<Dueño>('/api/dueno', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Actualizar un dueño
  update: async (id: number, data: Partial<{
    nombre: string;
    correo: string;
    contraseña: string;
    tipo_padre: string;
    foto_url: string;
    notificaciones_activas: boolean;
  }>): Promise<Dueño> => {
    return fetchApi<Dueño>(`/api/dueno/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Eliminar un dueño
  delete: async (id: number): Promise<{ message: string }> => {
    return fetchApi<{ message: string }>(`/api/dueno/${id}`, {
      method: 'DELETE',
    });
  },
};

// ========== API de Animales ==========

export const animalApi = {
  // Obtener todos los animales
  getAll: async (): Promise<Animal[]> => {
    return fetchApi<Animal[]>('/api/animal');
  },

  // Obtener animales de un dueño específico
  getByDueño: async (id_dueño: number): Promise<Animal[]> => {
    return fetchApi<Animal[]>(`/api/animal/dueno/${id_dueño}`);
  },

  // Obtener un animal por ID
  getById: async (id: number): Promise<Animal> => {
    return fetchApi<Animal>(`/api/animal/${id}`);
  },

  // Crear un nuevo animal
  create: async (data: {
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
  }): Promise<Animal> => {
    return fetchApi<Animal>('/api/animal', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Actualizar un animal
  update: async (id: number, data: Partial<{
    nombre: string;
    raza_nombre: string;
    edad: number;
    sexo: string;
    fecha_nacimiento: string;
    color: string;
    tamaño: string;
    foto_url: string;
    estado: string;
  }>): Promise<Animal> => {
    return fetchApi<Animal>(`/api/animal/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Eliminar un animal
  delete: async (id: number): Promise<{ message: string }> => {
    return fetchApi<{ message: string }>(`/api/animal/${id}`, {
      method: 'DELETE',
    });
  },
};

// ========== API de Eventos de Salud ==========

export const eventoSaludApi = {
  // Obtener todos los eventos (opcional: con filtros)
  getAll: async (filters?: {
    id_animal?: number;
    tipo?: string;
  }): Promise<EventoSalud[]> => {
    const params = new URLSearchParams();
    if (filters?.id_animal) params.append('id_animal', filters.id_animal.toString());
    if (filters?.tipo) params.append('tipo', filters.tipo);
    
    const query = params.toString();
    const endpoint = query ? `/api/evento-salud?${query}` : '/api/evento-salud';
    return fetchApi<EventoSalud[]>(endpoint);
  },

  // Obtener eventos de un animal específico
  getByAnimal: async (id_animal: number, tipo?: string): Promise<EventoSalud[]> => {
    const endpoint = tipo 
      ? `/api/evento-salud/animal/${id_animal}?tipo=${tipo}`
      : `/api/evento-salud/animal/${id_animal}`;
    return fetchApi<EventoSalud[]>(endpoint);
  },

  // Obtener un evento por ID
  getById: async (id: number): Promise<EventoSalud> => {
    return fetchApi<EventoSalud>(`/api/evento-salud/${id}`);
  },

  // Crear un nuevo evento
  create: async (data: {
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
  }): Promise<EventoSalud> => {
    return fetchApi<EventoSalud>('/api/evento-salud', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Actualizar un evento
  update: async (id: number, data: Partial<{
    id_animal: number;
    tipo: string;
    nombre: string;
    fecha: string;
    descripcion: string;
    veterinario: string;
    costo: number;
    proxima_fecha: string;
    es_recurrente: boolean;
    frecuencia_dias: number;
    es_aplicada: boolean;
  }>): Promise<EventoSalud> => {
    return fetchApi<EventoSalud>(`/api/evento-salud/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Eliminar un evento
  delete: async (id: number): Promise<{ message: string }> => {
    return fetchApi<{ message: string }>(`/api/evento-salud/${id}`, {
      method: 'DELETE',
    });
  },
};

// ========== API de Pesos ==========

export const pesoApi = {
  // Obtener todos los registros de peso (opcional: filtro por animal)
  getAll: async (id_animal?: number): Promise<Peso[]> => {
    const endpoint = id_animal 
      ? `/api/peso?id_animal=${id_animal}`
      : '/api/peso';
    return fetchApi<Peso[]>(endpoint);
  },

  // Obtener registros de peso de un animal
  getByAnimal: async (id_animal: number): Promise<Peso[]> => {
    return fetchApi<Peso[]>(`/api/peso/animal/${id_animal}`);
  },

  // Obtener el último peso registrado de un animal
  getUltimoByAnimal: async (id_animal: number): Promise<Peso> => {
    return fetchApi<Peso>(`/api/peso/animal/${id_animal}/ultimo`);
  },

  // Obtener un registro de peso por ID
  getById: async (id: number): Promise<Peso> => {
    return fetchApi<Peso>(`/api/peso/${id}`);
  },

  // Crear un nuevo registro de peso
  create: async (data: {
    id_animal: number;
    peso: number;
    fecha: string;
    notas?: string;
  }): Promise<Peso> => {
    return fetchApi<Peso>('/api/peso', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Actualizar un registro de peso
  update: async (id: number, data: Partial<{
    id_animal: number;
    peso: number;
    fecha: string;
    notas: string;
  }>): Promise<Peso> => {
    return fetchApi<Peso>(`/api/peso/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Eliminar un registro de peso
  delete: async (id: number): Promise<{ message: string }> => {
    return fetchApi<{ message: string }>(`/api/peso/${id}`, {
      method: 'DELETE',
    });
  },
};

// Exportar todas las APIs juntas
export const api = {
  dueño: dueñoApi,
  animal: animalApi,
  eventoSalud: eventoSaludApi,
  peso: pesoApi,
};

