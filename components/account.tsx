"use client";

import { useState, useRef, useEffect } from "react";
import MobileFrame from "./mobile-frame";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import "./styles/pet-profile-styles.css";
import lineSvg from "./images/line.svg";
import petEditInfoIcon from "./images/pet-edit-info.svg";
import imgIcon from "./images/img-icon.svg";

interface AccountProps {
  userName?: string;
  onBack: () => void;
  onUpdateUserData?: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    birthDate: string;
    phone: string;
    imageURL?: string;
  }) => void;
}

export default function Account({
  userName = "User",
  onBack,
  onUpdateUserData,
}: AccountProps) {
  const [userData, setUserData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    birthDate: string;
    phone: string;
    imageURL?: string;
  }>({
    firstName: "",
    lastName: "",
    email: "",
    birthDate: "",
    phone: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthDate: "",
    phone: "",
  });
  const profileImageInputRef = useRef<HTMLInputElement>(null);

  // Cargar datos del usuario desde localStorage
  useEffect(() => {
    const loadUserData = () => {
      const storedData = localStorage.getItem("user_data");
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          setUserData({
            firstName: parsed.firstName || "",
            lastName: parsed.lastName || "",
            email: parsed.email || "",
            birthDate: parsed.birthDate || "",
            phone: parsed.phone || "",
            imageURL: parsed.imageURL,
          });
        } catch (e) {
          console.error("Error cargando datos del usuario:", e);
        }
      }
    };
    loadUserData();
  }, []);

  // Función para formatear la fecha de nacimiento
  const formatBirthDate = (dateString: string): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateString;
    }
  };

  // Función para manejar el cambio de la foto de perfil
  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result as string;
        const updatedData = { ...userData, imageURL: imageDataUrl };
        setUserData(updatedData);
        
        // Guardar en localStorage
        localStorage.setItem("user_data", JSON.stringify(updatedData));
        
        if (onUpdateUserData) {
          onUpdateUserData(updatedData);
        }
      };
      reader.readAsDataURL(file);
    }
    if (profileImageInputRef.current) {
      profileImageInputRef.current.value = '';
    }
  };

  // Función para abrir el selector de imagen de perfil
  const handleEditProfileImageClick = () => {
    profileImageInputRef.current?.click();
  };

  // Función para iniciar edición de todos los campos
  const handleStartEdit = () => {
    setIsEditing(true);
    setEditValues({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      birthDate: userData.birthDate,
      phone: userData.phone,
    });
  };

  // Función para guardar todos los cambios
  const handleSave = () => {
    const updatedData = {
      ...userData,
      ...editValues,
    };
    setUserData(updatedData);
    setIsEditing(false);
    
    // Guardar en localStorage
    localStorage.setItem("user_data", JSON.stringify(updatedData));
    
    if (onUpdateUserData) {
      onUpdateUserData(updatedData);
    }
  };

  // Función para cancelar edición
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditValues({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      birthDate: userData.birthDate,
      phone: userData.phone,
    });
  };

  const displayName = `${userData.firstName} ${userData.lastName}`.trim() || userName;

  return (
    <MobileFrame>
      <div className="pet-profile-container">
        {/* Header */}
        <div className="pet-profile-header">
          <div className="pet-profile-header-left">
            <button onClick={onBack} className="pet-profile-back-button" aria-label="Volver">
              <ArrowLeft className="pet-profile-back-icon" />
            </button>
            <h1 className="pet-profile-title">Mi cuenta</h1>
          </div>
        </div>
        
        {/* Line separator */}
        <div className="pet-profile-header-line">
          <Image src={lineSvg} alt="Line separator" width={336} height={2} />
        </div>

        {/* Content */}
        <div className="pet-profile-content">
          {/* User Image */}
          <div className="pet-profile-image-container">
            <div className="pet-profile-image-wrapper">
              <div className="pet-profile-image-circle">
                {userData.imageURL ? (
                  <img
                    src={userData.imageURL}
                    alt={displayName}
                    width={150}
                    height={150}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                  />
                ) : (
                  <div style={{ 
                    width: '100%', 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: '#E5E7EB',
                    borderRadius: '50%',
                    color: '#6B7280',
                    fontSize: '3rem',
                    fontWeight: 'bold'
                  }}>
                    {userData.firstName?.[0]?.toUpperCase() || userName[0]?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              {/* Botón de editar foto */}
              <button 
                className="pet-profile-edit-image-button" 
                aria-label="Cambiar foto de perfil"
                onClick={handleEditProfileImageClick}
              >
                <Image src={petEditInfoIcon} alt="Cambiar foto" width={38} height={38} />
              </button>
            </div>
            {/* Input oculto para cambiar la foto de perfil */}
            <input
              type="file"
              ref={profileImageInputRef}
              accept="image/*"
              onChange={handleProfileImageChange}
              style={{ display: "none" }}
            />
          </div>

          {/* User Name */}
          <div className="pet-profile-name-section">
            <div className="pet-profile-name-wrapper">
              <h2 className="pet-profile-name">{displayName}</h2>
            </div>
          </div>

          {/* User Details Section */}
          <div className="pet-profile-section">
            <div className="pet-profile-section-title-wrapper">
              <h3 className="pet-profile-section-title">Información personal</h3>
              {!isEditing && (
                <button
                  className="pet-profile-edit-appearance-button"
                  onClick={handleStartEdit}
                  aria-label="Editar información"
                >
                  <Image src={petEditInfoIcon} alt="Editar" width={38} height={38} />
                </button>
              )}
            </div>
            
            {isEditing ? (
              <div className="pet-profile-appearance-edit">
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", color: "#39434F" }}>
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={editValues.firstName}
                      onChange={(e) => setEditValues({ ...editValues, firstName: e.target.value })}
                      placeholder="Ingresá tu nombre"
                      className="pet-profile-appearance-textarea"
                      style={{ height: "auto", padding: "0.75rem" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", color: "#39434F" }}>
                      Apellido
                    </label>
                    <input
                      type="text"
                      value={editValues.lastName}
                      onChange={(e) => setEditValues({ ...editValues, lastName: e.target.value })}
                      placeholder="Ingresá tu apellido"
                      className="pet-profile-appearance-textarea"
                      style={{ height: "auto", padding: "0.75rem" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", color: "#39434F" }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={editValues.email}
                      onChange={(e) => setEditValues({ ...editValues, email: e.target.value })}
                      placeholder="tu@email.com"
                      className="pet-profile-appearance-textarea"
                      style={{ height: "auto", padding: "0.75rem" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", color: "#39434F" }}>
                      Fecha de nacimiento
                    </label>
                    <input
                      type="date"
                      value={editValues.birthDate}
                      onChange={(e) => setEditValues({ ...editValues, birthDate: e.target.value })}
                      className="pet-profile-appearance-textarea"
                      style={{ height: "auto", padding: "0.75rem" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", color: "#39434F" }}>
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={editValues.phone}
                      onChange={(e) => setEditValues({ ...editValues, phone: e.target.value })}
                      placeholder="+54 9 11 1234-5678"
                      className="pet-profile-appearance-textarea"
                      style={{ height: "auto", padding: "0.75rem" }}
                    />
                  </div>
                </div>
                <div className="pet-profile-appearance-actions">
                  <button
                    className="pet-profile-save-button"
                    onClick={handleSave}
                  >
                    Guardar
                  </button>
                  <button
                    className="pet-profile-cancel-button"
                    onClick={handleCancelEdit}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="pet-profile-details">
                <div className="pet-profile-detail-item">
                  <span className="pet-profile-detail-label">Nombre</span>
                  <span className="pet-profile-detail-value">
                    {userData.firstName || <span style={{ color: "#9CA3AF" }}>Ingresá tu nombre</span>}
                  </span>
                </div>
                <div className="pet-profile-detail-divider"></div>
                <div className="pet-profile-detail-item">
                  <span className="pet-profile-detail-label">Apellido</span>
                  <span className="pet-profile-detail-value">
                    {userData.lastName || <span style={{ color: "#9CA3AF" }}>Ingresá tu apellido</span>}
                  </span>
                </div>
                <div className="pet-profile-detail-divider"></div>
                <div className="pet-profile-detail-item">
                  <span className="pet-profile-detail-label">Email</span>
                  <span className="pet-profile-detail-value">
                    {userData.email || <span style={{ color: "#9CA3AF" }}>tu@email.com</span>}
                  </span>
                </div>
                <div className="pet-profile-detail-divider"></div>
                <div className="pet-profile-detail-item">
                  <span className="pet-profile-detail-label">Fecha de nacimiento</span>
                  <span className="pet-profile-detail-value">
                    {userData.birthDate ? formatBirthDate(userData.birthDate) : <span style={{ color: "#9CA3AF" }}>DD/MM/AAAA</span>}
                  </span>
                </div>
                <div className="pet-profile-detail-divider"></div>
                <div className="pet-profile-detail-item">
                  <span className="pet-profile-detail-label">Teléfono</span>
                  <span className="pet-profile-detail-value">
                    {userData.phone || <span style={{ color: "#9CA3AF" }}>+54 9 11 1234-5678</span>}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MobileFrame>
  );
}
