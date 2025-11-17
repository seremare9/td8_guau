"use client";

import Image from "next/image";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MobileFrame from "@/components/screens/mobile-frame";

import iconUser from "../images/Icon.png";
import appleLogo from "../images/apple.svg";
import googleLogo from "../images/google.svg";
import facebookLogo from "../images/facebook.svg";
import actionSheetBg from "../images/action-sheet-background.svg";
import "../styles/inicio-styles.css";

interface LoginScreenProps {
  onCreateAccount: () => void;
  onBack?: () => void;
  onLogin: () => void;
  onSocialLogin?: (provider: "google" | "apple" | "facebook", userData: {
    firstName: string;
    lastName: string;
    email: string;
  }) => void;
}

export default function LoginScreen({
  onCreateAccount,
  onLogin,
  onSocialLogin,
}: LoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);

  // Función para manejar el login con proveedores sociales
  const handleSocialLogin = async (provider: "google" | "apple" | "facebook") => {
    try {
      let authUrl = "";
      const redirectUri = typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : "";
      
      if (provider === "google") {
        // Google OAuth
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";
        const scope = "openid profile email";
        authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent&provider=google`;
      } else if (provider === "facebook") {
        // Facebook OAuth
        const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "YOUR_FACEBOOK_APP_ID";
        const scope = "email,public_profile";
        authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=code&provider=facebook`;
      } else if (provider === "apple") {
        // Apple Sign In
        const clientId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || "YOUR_APPLE_CLIENT_ID";
        const scope = "name email";
        authUrl = `https://appleid.apple.com/auth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&response_mode=form_post&provider=apple`;
      }

      // Abrir ventana de autenticación
      const width = 500;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      const popup = window.open(
        authUrl,
        `${provider}Login`,
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,directories=no,status=no`
      );

      // Escuchar mensajes del popup
      const messageListener = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === "OAUTH_SUCCESS") {
          const userData = event.data.userData;
          
          // Guardar datos del usuario en localStorage
          const userDataToSave = {
            firstName: userData.firstName || userData.given_name || "",
            lastName: userData.lastName || userData.family_name || "",
            email: userData.email || "",
            birthDate: "",
            phone: "",
            authProvider: provider,
            imageURL: userData.picture || userData.photo || "",
          };
          
          localStorage.setItem("user_data", JSON.stringify(userDataToSave));
          localStorage.setItem("user_email", userDataToSave.email);
          
          // Llamar al callback
          if (onSocialLogin) {
            onSocialLogin(provider, {
              firstName: userDataToSave.firstName,
              lastName: userDataToSave.lastName,
              email: userDataToSave.email,
            });
          } else {
            onLogin();
          }
          
          window.removeEventListener("message", messageListener);
          if (popup) popup.close();
        } else if (event.data.type === "OAUTH_ERROR") {
          console.error("Error en autenticación:", event.data.error);
          window.removeEventListener("message", messageListener);
          if (popup) popup.close();
        }
      };

      window.addEventListener("message", messageListener);

      // Verificar si el popup fue bloqueado
      if (!popup || popup.closed || typeof popup.closed === "undefined") {
        alert("Por favor, permite las ventanas emergentes para continuar con la autenticación.");
        return;
      }

      // Verificar si el popup se cerró manualmente
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener("message", messageListener);
        }
      }, 1000);
    } catch (error) {
      console.error(`Error al iniciar sesión con ${provider}:`, error);
      alert(`Error al iniciar sesión con ${provider}. Por favor, intenta de nuevo.`);
    }
  };

  return (
    <MobileFrame>
      <div className="login-container" aria-hidden>
        {/* Fondo decorativo inferior: wrapper con height y Image fill para alinear abajo */}
        <div className="login-bg-wrapper">
          <Image src={actionSheetBg} alt="" className="login-bg" />
        </div>

        {/* Icono superior */}
        <div className="login-icon-container">
          <Image src={iconUser} alt="user icon" className="login-icon" />
        </div>

        {/* Títulos */}
        <h1 className="login-title">Iniciar sesión</h1>
        <p className="login-subtitle">
          ¡Bienvenido! Completá tus datos a continuación y empezá
        </p>

        {/* Inputs */}
        <div className="login-inputs">
          <Input placeholder="Email" className="login-input" />
          <div className="relative w-full">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              className="login-input"
            />
            <button
              type="button"
              className="login-eye"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              {showPassword ? (
                <EyeOff className="eye-icon" />
              ) : (
                <Eye className="eye-icon" />
              )}
            </button>
          </div>
        </div>

        {/* Botón principal */}
        <Button onClick={onLogin} className="login-button">
          Iniciar sesión
        </Button>

        {/* Separador */}
        <div className="login-separator">
          <span>O</span>
        </div>

        {/* Botones sociales */}
        <div className="login-social-buttons">
          <Button 
            className="social-btn"
            onClick={() => handleSocialLogin("apple")}
          >
            <Image src={appleLogo} alt="apple" width={18} height={18} />
            <span>Continuar con Apple</span>
          </Button>
          <Button 
            className="social-btn"
            onClick={() => handleSocialLogin("google")}
          >
            <Image src={googleLogo} alt="google" width={18} height={18} />
            <span>Continuar con Google</span>
          </Button>
          <Button 
            className="social-btn"
            onClick={() => handleSocialLogin("facebook")}
          >
            <Image src={facebookLogo} alt="facebook" width={18} height={18} />
            <span>Continuar con Facebook</span>
          </Button>
        </div>

        {/* Enlace crear cuenta (usa onCreateAccount provisto) */}
        <p className="login-footer">
          ¿No tenés una cuenta?{" "}
          <button onClick={onCreateAccount} className="login-link">
            Crear cuenta
          </button>
        </p>
      </div>
    </MobileFrame>
  );
}
