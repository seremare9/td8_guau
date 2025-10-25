"use client";

import Image from "next/image";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MobileFrame from "./mobile-frame";

import iconUser from "./images/Icon.png";
import appleLogo from "./images/apple.png";
import googleLogo from "./images/google.png";
import facebookLogo from "./images/facebook.png";
import actionSheetBg from "./images/action-sheet-background.svg";
import "./inicio-styles.css";

interface LoginScreenProps {
  onCreateAccount: () => void;
  onBack?: () => void;
}

export default function LoginScreen({ onCreateAccount }: LoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);

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
        <Button className="login-button">Iniciar sesión</Button>

        {/* Separador */}
        <div className="login-separator">
          <span>O</span>
        </div>

        {/* Botones sociales */}
        <div className="login-social-buttons">
          <Button className="social-btn">
            <Image src={appleLogo} alt="apple" width={18} height={18} />
            <span>Continuar con Apple</span>
          </Button>
          <Button className="social-btn">
            <Image src={googleLogo} alt="google" width={18} height={18} />
            <span>Continuar con Google</span>
          </Button>
          <Button className="social-btn">
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
