"use client";

// PANTALLA "CREAR CUENTA"

import { useState } from "react";
import Image from "next/image";
import MobileFrame from "./mobile-frame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Eye, EyeOff, Calendar } from "lucide-react";
import appleLogo from "./images/apple.svg";
import googleLogo from "./images/google.svg";
import facebookLogo from "./images/facebook.svg";
import "./styles/register-screen-styles.css";

interface RegisterScreenProps {
  onBack: () => void;
  onRegister: (name: string) => void;
}

export default function RegisterScreen({
  onBack,
  onRegister,
}: RegisterScreenProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthDate: "",
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Función de registro que podemos usar en el onClick
  const handleRegister = () => {
    // Aquí puedes agregar validación de datos antes de navegar
    if (acceptTerms) {
      onRegister(formData.firstName);
    }
  };

  return (
    <MobileFrame>
      <div className="register-container">
        <div className="register-layout">
          {/* Header */}
          <div className="register-header">
            <button onClick={onBack} className="register-back-button">
              <ArrowLeft className="register-back-icon" />
            </button>
            <h1 className="register-title">Crear cuenta</h1>
          </div>

          {/* Form */}
          <div className="register-form-container">
            <div className="register-form-fields">
              <div className="register-name-grid">
                <Input
                  placeholder="Nombre"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  className="register-input"
                />
                <Input
                  placeholder="Apellido"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  className="register-input"
                />
              </div>

              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="register-input-full"
              />

              <div className="register-input-container">
                <Input
                  type="date"
                  placeholder="Fecha de nacimiento"
                  value={formData.birthDate}
                  onChange={(e) =>
                    handleInputChange("birthDate", e.target.value)
                  }
                  className="register-input-with-icon"
                />
              </div>

              <Input
                type="tel"
                placeholder="Teléfono"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="register-input-full"
              />

              <div className="register-input-container">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className="register-input-with-icon"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="register-password-toggle"
                >
                  {showPassword ? (
                    <EyeOff className="register-icon" />
                  ) : (
                    <Eye className="register-icon" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="register-terms-container">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="register-checkbox"
              />
              <label htmlFor="terms" className="register-terms-label">
                Acepto los términos y condiciones
              </label>
            </div>

            {/* Create Account Button */}
            <Button
              disabled={!acceptTerms}
              onClick={handleRegister}
              className="login-button"
            >
              Crear cuenta
            </Button>

            <div className="register-divider">
              <span>O</span>
            </div>

            {/* Social Login Buttons */}
            <div className="register-social-buttons">
              <Button variant="outline" className="register-social-button">
                <Image src={appleLogo} alt="apple" width={18} height={18} />
                <span className="register-social-text">
                  Continuar con Apple
                </span>
              </Button>

              <Button variant="outline" className="register-social-button">
                <Image src={googleLogo} alt="google" width={18} height={18} />
                <span className="register-social-text">
                  Continuar con Google
                </span>
              </Button>

              <Button variant="outline" className="register-social-button">
                <Image
                  src={facebookLogo}
                  alt="facebook"
                  width={18}
                  height={18}
                />
                <span className="register-social-text">
                  Continuar con Facebook
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MobileFrame>
  );
}
