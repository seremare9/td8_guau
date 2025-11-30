"use client";

import { useState } from "react";
import Image from "next/image";
import MobileFrame from "./mobile-frame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Eye, EyeOff, Calendar } from "lucide-react";
import appleLogo from "../images/apple.svg";
import googleLogo from "../images/google.svg";
import facebookLogo from "../images/facebook.svg";
import { api } from "@/lib/api";
import "../styles/register-screen-styles.css";

interface RegisterScreenProps {
  onBack: () => void;
  onRegister: (name: string) => void;
  onSocialRegister?: (provider: "google" | "apple" | "facebook", userData: {
    firstName: string;
    lastName: string;
    email: string;
  }) => void;
}

export default function RegisterScreen({
  onBack,
  onRegister,
  onSocialRegister,
}: RegisterScreenProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthDate: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
    email?: string;
    firstName?: string;
    phone?: string;
  }>({});

  // Función para manejar el registro con Google, Facebook y Apple
  const handleSocialRegister = async (provider: "google" | "apple" | "facebook") => {
    try {
      let authUrl = "";
      const redirectUri = typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : "";
      
      if (provider === "google") {
        // Google
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";
        const scope = "openid profile email";
        authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent&provider=google`;
      } else if (provider === "facebook") {
        // Facebook 
        const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "YOUR_FACEBOOK_APP_ID";
        const scope = "email,public_profile";
        authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=code&provider=facebook`;
      } else if (provider === "apple") {
        // Apple 
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
        `${provider}Register`,
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,directories=no,status=no`
      );

      // Escuchar mensajes del popup
      const messageListener = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === "OAUTH_SUCCESS") {
          const userData = event.data.userData;
          
          try {
            // Crear el dueño en la API
            const nombreCompleto = `${userData.firstName || userData.given_name || ""} ${userData.lastName || userData.family_name || ""}`.trim();
            // Obtener el tipo de padre desde localStorage o usar valor por defecto
            const userTypeFromStorage = localStorage.getItem("user_type") || "ya conozco bien a mi perro";
            const nuevoDueño = await api.dueño.create({
              nombre: nombreCompleto || userData.firstName || userData.given_name || "Usuario",
              correo: userData.email || "",
              contraseña: "", // Los OAuth no requieren contraseña
              tipo_padre: userTypeFromStorage,
              foto_url: userData.picture || userData.photo || "",
            });

            // Guardar datos del usuario en localStorage incluyendo el id_dueño
            const userDataToSave = {
              id_dueño: nuevoDueño.id_dueño,
              firstName: userData.firstName || userData.given_name || "",
              lastName: userData.lastName || userData.family_name || "",
              nombre: nuevoDueño.nombre,
              email: userData.email || "",
              birthDate: "",
              phone: "",
              authProvider: provider,
              imageURL: userData.picture || userData.photo || "",
            };
            
            localStorage.setItem("user_data", JSON.stringify(userDataToSave));
            localStorage.setItem("user_email", userDataToSave.email);
          } catch (error) {
            console.error("Error al crear cuenta con OAuth:", error);
            // Si falla la API, guardar solo en localStorage como fallback
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
          }
          
          // Llamar al callback
          if (onSocialRegister) {
            onSocialRegister(provider, {
              firstName: userData.firstName || userData.given_name || "",
              lastName: userData.lastName || userData.family_name || "",
              email: userData.email || "",
            });
          } else {
            onRegister(userData.firstName || userData.given_name || "");
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
      console.error(`Error al registrarse con ${provider}:`, error);
      alert(`Error al registrarse con ${provider}. Por favor, intenta de nuevo.`);
    }
  };

  const handleInputChange = (field: string, value: string) => {

    if (field === "birthDate") {
      console.log("Fecha recibida del input:", value);
      setFormData((prev) => {
        const newData = { ...prev, [field]: value };
        console.log("Fecha guardada en estado:", newData.birthDate);
        return newData;
      });
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }

    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Validar contraseña: mínimo 8 caracteres, alfanumérica
  const validatePassword = (password: string): string | undefined => {
    if (password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres";
    }
    if (!/^[a-zA-Z0-9]+$/.test(password)) {
      return "La contraseña debe ser alfanumérica (solo letras y números)";
    }
    return undefined;
  };

  // Validar que las contraseñas coincidan
  const validateConfirmPassword = (password: string, confirmPassword: string): string | undefined => {
    if (password !== confirmPassword) {
      return "Las contraseñas no coinciden";
    }
    return undefined;
  };


  const handleRegister = async () => {
    // Validar campos obligatorios
    const newErrors: typeof errors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "El nombre es obligatorio";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es obligatorio";
    }
    
    // Validar contraseña
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }
    
    // Validar confirmación de contraseña
    const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);
    if (confirmPasswordError) {
      newErrors.confirmPassword = confirmPasswordError;
    }
    
    // Si hay errores, mostrarlos y no continuar
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Si todo está bien y acepta términos, proceder
    if (acceptTerms) {
      try {
        // LIMPIAR TODOS LOS DATOS DE LA CUENTA ANTERIOR ANTES DE CREAR NUEVA
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (
            key.startsWith("pet_data_") || 
            key.startsWith("vaccines_") || 
            key.startsWith("higiene_") || 
            key.startsWith("medicina_") || 
            key.startsWith("antiparasitario_") || 
            key.startsWith("veterinario_") || 
            key.startsWith("otro_") || 
            key.startsWith("peso_") ||
            key.startsWith("pet_photos_") ||
            key.startsWith("notifications_") ||
            key === "pets_order" ||
            key === "event_reminders"
          )) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => {
          if (key) {
            localStorage.removeItem(key);
          }
        });
        
        // Crear el dueño en la API
        const nombreCompleto = `${formData.firstName} ${formData.lastName}`.trim();
        // Obtener el tipo de padre desde localStorage o usar valor por defecto
        const userTypeFromStorage = localStorage.getItem("user_type") || "ya conozco bien a mi perro";
        const nuevoDueño = await api.dueño.create({
          nombre: nombreCompleto || formData.firstName,
          correo: formData.email,
          contraseña: formData.password,
          tipo_padre: userTypeFromStorage,
        });

        // Guardar todos los datos del usuario en localStorage incluyendo el id_dueño
        console.log("Fecha antes de guardar en localStorage:", formData.birthDate);
        const userData = {
          id_dueño: nuevoDueño.id_dueño,
          firstName: formData.firstName,
          lastName: formData.lastName,
          nombre: nuevoDueño.nombre,
          email: formData.email,
          birthDate: formData.birthDate, 
          phone: formData.phone,
        };
        console.log("Fecha guardada en localStorage:", userData.birthDate);
        localStorage.setItem("user_data", JSON.stringify(userData));
        
        
        if (formData.email) {
          localStorage.setItem("user_email", formData.email);
        }
        onRegister(formData.firstName);
      } catch (error) {
        console.error("Error al crear cuenta:", error);
        // Si falla la API, guardar solo en localStorage como fallback
        const userData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          birthDate: formData.birthDate,
          phone: formData.phone,
        };
        localStorage.setItem("user_data", JSON.stringify(userData));
        if (formData.email) {
          localStorage.setItem("user_email", formData.email);
        }
        onRegister(formData.firstName);
      }
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
                <div className="register-field-wrapper">
                  <Input
                    placeholder="Nombre *"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    className={`register-input ${errors.firstName ? "register-input-error" : ""}`}
                  />
                  {errors.firstName && (
                    <span className="register-error-message">{errors.firstName}</span>
                  )}
                </div>
                <div className="register-field-wrapper">
                  <Input
                    placeholder="Apellido"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className="register-input"
                  />
                </div>
              </div>

              <div className="register-field-wrapper">
                <Input
                  type="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`register-input-full ${errors.email ? "register-input-error" : ""}`}
                />
                {errors.email && (
                  <span className="register-error-message">{errors.email}</span>
                )}
              </div>

              <div className="register-field-wrapper">
                <label 
                  htmlFor="birthDate"
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    color: '#39434F',
                    fontWeight: '500',
                  }}
                >
                  Fecha de nacimiento
                </label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate || ""}
                  onChange={(e) => {
                    const dateValue = e.target.value;
                    // Asegurarse de que el valor se guarde exactamente como lo devuelve el input
                    handleInputChange("birthDate", dateValue);
                  }}
                  className="register-input-full"
                />
              </div>

              <div className="register-field-wrapper">
                <Input
                  type="tel"
                  placeholder="Teléfono *"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={`register-input-full ${errors.phone ? "register-input-error" : ""}`}
                />
                {errors.phone && (
                  <span className="register-error-message">{errors.phone}</span>
                )}
              </div>

              <div className="register-field-wrapper">
                <div className="register-input-container">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña *"
                    value={formData.password}
                    onChange={(e) => {
                      handleInputChange("password", e.target.value);
                      // Validar en tiempo real
                      if (formData.confirmPassword) {
                        const confirmError = validateConfirmPassword(e.target.value, formData.confirmPassword);
                        setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
                      }
                    }}
                    className={`register-input-with-icon ${errors.password ? "register-input-error" : ""}`}
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
                {errors.password && (
                  <span className="register-error-message">{errors.password}</span>
                )}
                <span className="register-password-hint">
                  La contraseña debe tener al menos 8 caracteres y ser alfanumérica
                </span>
              </div>

              <div className="register-field-wrapper">
                <div className="register-input-container">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repetir contraseña *"
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      handleInputChange("confirmPassword", e.target.value);
                      // Validar en tiempo real
                      const confirmError = validateConfirmPassword(formData.password, e.target.value);
                      setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
                    }}
                    className={`register-input-with-icon ${errors.confirmPassword ? "register-input-error" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="register-password-toggle"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="register-icon" />
                    ) : (
                      <Eye className="register-icon" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="register-error-message">{errors.confirmPassword}</span>
                )}
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
              <Button 
                variant="outline" 
                className="register-social-button"
                onClick={() => handleSocialRegister("apple")}
              >
                <Image src={appleLogo} alt="apple" width={18} height={18} />
                <span className="register-social-text">
                  Continuar con Apple
                </span>
              </Button>

              <Button 
                variant="outline" 
                className="register-social-button"
                onClick={() => handleSocialRegister("google")}
              >
                <Image src={googleLogo} alt="google" width={18} height={18} />
                <span className="register-social-text">
                  Continuar con Google
                </span>
              </Button>

              <Button 
                variant="outline" 
                className="register-social-button"
                onClick={() => handleSocialRegister("facebook")}
              >
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
