"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function AuthCallback() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const provider = searchParams.get("provider") || "google";
    const success = searchParams.get("success");
    const dataParam = searchParams.get("data");

    if (error) {
      // Enviar error a la ventana principal
      if (window.opener) {
        window.opener.postMessage(
          {
            type: "OAUTH_ERROR",
            error: error,
          },
          window.location.origin
        );
      }
      window.close();
      return;
    }

    if (success === "true" && dataParam) {
      // Los datos ya fueron procesados en el backend
      try {
        const userData = JSON.parse(decodeURIComponent(dataParam));
        
        if (window.opener) {
          window.opener.postMessage(
            {
              type: "OAUTH_SUCCESS",
              userData: userData,
            },
            window.location.origin
          );
        }
        window.close();
        return;
      } catch (e) {
        console.error("Error parseando datos:", e);
        if (window.opener) {
          window.opener.postMessage(
            {
              type: "OAUTH_ERROR",
              error: "Error al procesar los datos",
            },
            window.location.origin
          );
        }
        window.close();
        return;
      }
    }

    if (code) {
      // Redirigir al backend para intercambiar código por token
      window.location.href = `/api/auth/callback?code=${code}&provider=${provider}`;
    }
  }, [searchParams]);

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh",
      fontFamily: "system-ui, sans-serif"
    }}>
      <p>Procesando autenticación...</p>
    </div>
  );
}

