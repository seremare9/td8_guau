// Configuración de la API del backend
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

// Función helper para construir URLs completas
export const getApiUrl = (endpoint: string) => {
  // Asegurar que el endpoint empiece con /
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${path}`;
};

