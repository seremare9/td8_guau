"use client";

import { useState, useRef } from "react";
import MobileFrame from "./mobile-frame";
import Image from "next/image";
import { ArrowLeft, ChevronDown, Pencil, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import perro from "./images/perro.png";
import "./styles/pet-profile-styles.css";

interface PetProfileProps {
  userName?: string;
  petData?: { 
    name: string; 
    breed: string; 
    imageURL?: string;
    sex?: string;
    gender?: string;
    weight?: string;
    birthday?: string;
    approximateAge?: string;
  } | null;
  onBack: () => void;
}

export default function PetProfile({
  userName = "User",
  petData,
  onBack,
}: PetProfileProps) {
  const [activeTab, setActiveTab] = useState<"sobre" | "salud" | "nutricion">("sobre");
  const [photos, setPhotos] = useState<string[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Función para convertir gender a tamaño legible
  const getSizeLabel = (gender?: string) => {
    if (gender === "small") return "Chico";
    if (gender === "medium") return "Mediano";
    if (gender === "large") return "Grande";
    return "Mediano"; // default
  };

  // Función para convertir sex a formato legible
  const getSexLabel = (sex?: string) => {
    if (sex === "macho") return "Macho";
    if (sex === "hembra") return "Hembra";
    return "Macho"; // default
  };

  const pet = {
    name: petData?.name || "Maxi",
    breed: petData?.breed || "Border Collie",
    image: petData?.imageURL || perro,
    sex: getSexLabel(petData?.sex),
    size: getSizeLabel(petData?.gender),
    weight: petData?.weight ? `${petData.weight} kg` : "0,0 kg",
    age: petData?.birthday || petData?.approximateAge || "",
    appearance: "Brown-Dark-White mix, with light eyebrows shape and a heart shaped patch on left paw.",
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const promises = fileArray.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(promises).then((newPhotos) => {
        setPhotos((prev) => {
          const updated = [...prev, ...newPhotos];
          // Si es la primera foto, establecer el índice en 0
          if (prev.length === 0) {
            setCurrentPhotoIndex(0);
          }
          return updated;
        });
      });
    }
    // Reset input para permitir seleccionar la misma imagen nuevamente
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddPhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handlePhotoDotClick = (index: number) => {
    setCurrentPhotoIndex(index);
  };

  return (
    <MobileFrame>
      <div className="pet-profile-container">
        {/* Header */}
        <div className="pet-profile-header">
          <button onClick={onBack} className="pet-profile-back-button" aria-label="Volver">
            <ArrowLeft className="pet-profile-back-icon" />
          </button>
          <h1 className="pet-profile-title">Perfil de mascota</h1>
          <div className="pet-profile-selector">
            <div className="pet-profile-selector-content">
              <div className="pet-profile-selector-image">
                {typeof pet.image === 'string' && pet.image.startsWith('data:') ? (
                  <img
                    src={pet.image}
                    alt={pet.name}
                    width={24}
                    height={24}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                  />
                ) : (
                  <Image
                    src={pet.image}
                    alt={pet.name}
                    width={24}
                    height={24}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                  />
                )}
              </div>
              <span className="pet-profile-selector-name">{pet.name}</span>
              <ChevronDown className="pet-profile-selector-chevron" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="pet-profile-tabs">
          <button
            onClick={() => setActiveTab("sobre")}
            className={`pet-profile-tab ${activeTab === "sobre" ? "active" : ""}`}
          >
            Sobre
          </button>
          <button
            onClick={() => setActiveTab("salud")}
            className={`pet-profile-tab ${activeTab === "salud" ? "active" : ""}`}
          >
            Salud
          </button>
          <button
            onClick={() => setActiveTab("nutricion")}
            className={`pet-profile-tab ${activeTab === "nutricion" ? "active" : ""}`}
          >
            Nutrición
          </button>
        </div>

        {/* Content */}
        <div className="pet-profile-content">
          {/* Pet Image */}
          <div className="pet-profile-image-container">
            <div className="pet-profile-image-circle">
              {typeof pet.image === 'string' && pet.image.startsWith('data:') ? (
                <img
                  src={pet.image}
                  alt={pet.name}
                  width={150}
                  height={150}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                />
              ) : (
                <Image
                  src={pet.image}
                  alt={pet.name}
                  width={150}
                  height={150}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                />
              )}
            </div>
          </div>

          {/* Pet Name and Breed */}
          <div className="pet-profile-name-section">
            <div className="pet-profile-name-wrapper">
              <h2 className="pet-profile-name">{pet.name}</h2>
              <button className="pet-profile-edit-icon" aria-label="Editar nombre">
                <Pencil className="pet-profile-pencil-icon" />
              </button>
            </div>
            <p className="pet-profile-breed">{pet.breed}</p>
          </div>

          {/* Appearance Section */}
          <div className="pet-profile-section">
            <h3 className="pet-profile-section-title">Apariencia y rasgos distintivos</h3>
            <p className="pet-profile-appearance-text">{pet.appearance}</p>
            
            <div className="pet-profile-details">
              <div className="pet-profile-detail-item">
                <span className="pet-profile-detail-label">Sexo</span>
                <span className="pet-profile-detail-value">{pet.sex}</span>
              </div>
              <div className="pet-profile-detail-item">
                <span className="pet-profile-detail-label">Tamaño</span>
                <span className="pet-profile-detail-value">{pet.size}</span>
              </div>
              <div className="pet-profile-detail-item">
                <span className="pet-profile-detail-label">Peso</span>
                <span className="pet-profile-detail-value">{pet.weight}</span>
              </div>
              {pet.age && (
                <div className="pet-profile-detail-item">
                  <span className="pet-profile-detail-label">
                    {petData?.birthday ? "Cumpleaños" : "Edad"}
                  </span>
                  <span className="pet-profile-detail-value">{pet.age}</span>
                </div>
              )}
            </div>
          </div>

          {/* Photos Section */}
          <div className="pet-profile-section">
            <h3 className="pet-profile-section-title">Fotos</h3>
            
            {/* Input de archivo oculto */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              onChange={handleImageChange}
              style={{ display: "none" }}
            />

            {photos.length === 0 ? (
              <div className="pet-profile-photos-placeholder" onClick={handleAddPhotoClick}>
                <Plus className="pet-profile-photos-plus" />
                <p className="pet-profile-photos-empty">No hay fotos aún</p>
                <p className="pet-profile-photos-hint">Toca para agregar la primera foto</p>
                <button className="pet-profile-add-photo-button" onClick={(e) => { e.stopPropagation(); handleAddPhotoClick(); }}>
                  Agregar foto
                </button>
              </div>
            ) : (
              <div className="pet-profile-photos-carousel">
                <div className="pet-profile-photos-carousel-container">
                  {photos.map((photo, index) => (
                    <div
                      key={index}
                      className={`pet-profile-photo-slide ${index === currentPhotoIndex ? 'active' : ''}`}
                      style={{ transform: `translateX(-${currentPhotoIndex * 100}%)` }}
                    >
                      {photo.startsWith('data:') ? (
                        <img
                          src={photo}
                          alt={`Foto ${index + 1} de ${pet.name}`}
                          className="pet-profile-photo-image"
                        />
                      ) : (
                        <Image
                          src={photo}
                          alt={`Foto ${index + 1} de ${pet.name}`}
                          width={400}
                          height={300}
                          className="pet-profile-photo-image"
                        />
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Navegación del carrusel */}
                {photos.length > 1 && (
                  <>
                    <button
                      className="pet-profile-carousel-button pet-profile-carousel-button-prev"
                      onClick={handlePrevPhoto}
                      aria-label="Foto anterior"
                    >
                      <ChevronLeft className="pet-profile-carousel-icon" />
                    </button>
                    <button
                      className="pet-profile-carousel-button pet-profile-carousel-button-next"
                      onClick={handleNextPhoto}
                      aria-label="Foto siguiente"
                    >
                      <ChevronRight className="pet-profile-carousel-icon" />
                    </button>
                    
                    {/* Indicadores de puntos */}
                    <div className="pet-profile-carousel-dots">
                      {photos.map((_, index) => (
                        <button
                          key={index}
                          className={`pet-profile-carousel-dot ${index === currentPhotoIndex ? 'active' : ''}`}
                          onClick={() => handlePhotoDotClick(index)}
                          aria-label={`Ir a foto ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
                
                {/* Botón para agregar más fotos */}
                <button
                  className="pet-profile-add-more-photos-button"
                  onClick={handleAddPhotoClick}
                >
                  <Plus className="pet-profile-add-more-icon" />
                  <span>Agregar más fotos</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MobileFrame>
  );
}

