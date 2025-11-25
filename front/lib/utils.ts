import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Comprime y redimensiona una imagen antes de convertirla a base64
 * @param file - Archivo de imagen a comprimir
 * @param maxWidth - Ancho máximo (default: 1920px)
 * @param maxHeight - Alto máximo (default: 1920px)
 * @param quality - Calidad de compresión JPEG (0-1, default: 0.8)
 * @returns Promise con la imagen comprimida en base64
 */
export function compressImage(
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1920,
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img') as HTMLImageElement;
      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo la proporción
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          } else {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        // Crear canvas para redimensionar y comprimir
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('No se pudo obtener el contexto del canvas'));
          return;
        }

        // Dibujar la imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convertir a base64 con compresión
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.onerror = reject;
      if (e.target?.result) {
        img.src = e.target.result as string;
      } else {
        reject(new Error('No se pudo leer el archivo'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
