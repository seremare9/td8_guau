// Hook personalizado para facilitar el uso de la API
import { useState, useCallback } from 'react';
import { api } from '@/lib/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await apiCall();
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Hook específico para animales
export function useAnimales() {
  const apiState = useApi<any[]>();

  const cargarAnimales = useCallback(async (id_dueño?: number) => {
    if (id_dueño) {
      return apiState.execute(() => api.animal.getByDueño(id_dueño));
    }
    return apiState.execute(() => api.animal.getAll());
  }, [apiState]);

  const crearAnimal = useCallback(async (data: Parameters<typeof api.animal.create>[0]) => {
    return apiState.execute(() => api.animal.create(data));
  }, [apiState]);

  const actualizarAnimal = useCallback(async (id: number, data: Parameters<typeof api.animal.update>[1]) => {
    return apiState.execute(() => api.animal.update(id, data));
  }, [apiState]);

  const eliminarAnimal = useCallback(async (id: number) => {
    return apiState.execute(() => api.animal.delete(id));
  }, [apiState]);

  return {
    animales: apiState.data,
    loading: apiState.loading,
    error: apiState.error,
    cargarAnimales,
    crearAnimal,
    actualizarAnimal,
    eliminarAnimal,
    reset: apiState.reset,
  };
}

// Hook específico para eventos de salud
export function useEventosSalud() {
  const apiState = useApi<any[]>();

  const cargarEventos = useCallback(async (id_animal: number, tipo?: string) => {
    return apiState.execute(() => api.eventoSalud.getByAnimal(id_animal, tipo));
  }, [apiState]);

  const crearEvento = useCallback(async (data: Parameters<typeof api.eventoSalud.create>[0]) => {
    return apiState.execute(() => api.eventoSalud.create(data));
  }, [apiState]);

  const actualizarEvento = useCallback(async (id: number, data: Parameters<typeof api.eventoSalud.update>[1]) => {
    return apiState.execute(() => api.eventoSalud.update(id, data));
  }, [apiState]);

  const eliminarEvento = useCallback(async (id: number) => {
    return apiState.execute(() => api.eventoSalud.delete(id));
  }, [apiState]);

  return {
    eventos: apiState.data,
    loading: apiState.loading,
    error: apiState.error,
    cargarEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento,
    reset: apiState.reset,
  };
}

// Hook específico para pesos
export function usePesos() {
  const apiState = useApi<any[]>();

  const cargarPesos = useCallback(async (id_animal: number) => {
    return apiState.execute(() => api.peso.getByAnimal(id_animal));
  }, [apiState]);

  const obtenerUltimoPeso = useCallback(async (id_animal: number) => {
    return apiState.execute(() => api.peso.getUltimoByAnimal(id_animal));
  }, [apiState]);

  const crearPeso = useCallback(async (data: Parameters<typeof api.peso.create>[0]) => {
    return apiState.execute(() => api.peso.create(data));
  }, [apiState]);

  const actualizarPeso = useCallback(async (id: number, data: Parameters<typeof api.peso.update>[1]) => {
    return apiState.execute(() => api.peso.update(id, data));
  }, [apiState]);

  const eliminarPeso = useCallback(async (id: number) => {
    return apiState.execute(() => api.peso.delete(id));
  }, [apiState]);

  return {
    pesos: apiState.data,
    loading: apiState.loading,
    error: apiState.error,
    cargarPesos,
    obtenerUltimoPeso,
    crearPeso,
    actualizarPeso,
    eliminarPeso,
    reset: apiState.reset,
  };
}

