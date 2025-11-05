"use client";

import { useState, useRef, useEffect } from "react";
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
    photos?: string[];
  } | null;
  onBack: () => void;
  onUpdatePetData?: (petData: { 
    name: string; 
    breed: string; 
    imageURL?: string;
    sex?: string;
    gender?: string;
    weight?: string;
    birthday?: string;
    approximateAge?: string;
    photos?: string[];
  }) => void;
}

export default function PetProfile({
  userName = "User",
  petData,
  onBack,
  onUpdatePetData,
}: PetProfileProps) {
  const [activeTab, setActiveTab] = useState<"sobre" | "salud" | "nutricion">("sobre");
  const [photos, setPhotos] = useState<string[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Función para obtener la clave de localStorage para las fotos
  const getStorageKey = () => {
    const petName = petData?.name || "default";
    return `pet_photos_${petName}`;
  };

  // Cargar fotos guardadas al montar el componente o cuando cambia petData
  useEffect(() => {
    if (petData?.photos && petData.photos.length > 0) {
      setPhotos(petData.photos);
    } else {
      // Intentar cargar desde localStorage como respaldo
      const storageKey = getStorageKey();
      const savedPhotos = localStorage.getItem(storageKey);
      if (savedPhotos) {
        try {
          const parsedPhotos = JSON.parse(savedPhotos);
          if (Array.isArray(parsedPhotos) && parsedPhotos.length > 0) {
            setPhotos(parsedPhotos);
            // Sincronizar con petData si es posible
            if (onUpdatePetData && petData) {
              onUpdatePetData({ ...petData, photos: parsedPhotos });
            }
          }
        } catch (e) {
          console.error("Error al cargar fotos desde localStorage:", e);
        }
      } else {
        // Si no hay fotos guardadas, limpiar el estado
        setPhotos([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [petData?.name, petData?.photos]); // Ejecutar cuando cambia el nombre o las fotos de la mascota

  // Función para guardar fotos
  const savePhotos = (newPhotos: string[]) => {
    setPhotos(newPhotos);
    
    // Guardar en localStorage
    const storageKey = getStorageKey();
    localStorage.setItem(storageKey, JSON.stringify(newPhotos));
    
    // Actualizar petData en el componente padre
    if (onUpdatePetData && petData) {
      onUpdatePetData({ ...petData, photos: newPhotos });
    }
  };

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

  // Función para obtener la edad del perro
  const getAgeDisplay = () => {
    if (petData?.birthday) {
      // Si hay fecha de cumpleaños, calcular edad
      // Formato esperado: "15 de Enero de 2025"
      const birthdayMatch = petData.birthday.match(/(\d+)\s+de\s+(\w+)\s+de\s+(\d+)/);
      if (birthdayMatch) {
        const day = parseInt(birthdayMatch[1]);
        const monthName = birthdayMatch[2];
        const year = parseInt(birthdayMatch[3]);
        
        const monthsMap: { [key: string]: number } = {
          "Enero": 0, "Febrero": 1, "Marzo": 2, "Abril": 3,
          "Mayo": 4, "Junio": 5, "Julio": 6, "Agosto": 7,
          "Septiembre": 8, "Octubre": 9, "Noviembre": 10, "Diciembre": 11
        };
        
        const month = monthsMap[monthName];
        if (month !== undefined) {
          const birthday = new Date(year, month, day);
          const today = new Date();
          let years = today.getFullYear() - birthday.getFullYear();
          let months = today.getMonth() - birthday.getMonth();
          
          if (months < 0) {
            years--;
            months += 12;
          } else if (months === 0 && today.getDate() < birthday.getDate()) {
            years--;
            months = 11;
          }
          
          if (years === 0) {
            return months === 1 ? "1 mes" : `${months} meses`;
          } else if (years === 1 && months === 0) {
            return "1 año";
          } else if (years === 1) {
            return months === 1 ? "1 año y 1 mes" : `1 año y ${months} meses`;
          } else {
            return months === 0 ? `${years} años` : `${years} años y ${months} meses`;
          }
        }
      }
      // Si no se puede parsear, mostrar la fecha de cumpleaños
      return petData.birthday;
    } else if (petData?.approximateAge) {
      return petData.approximateAge;
    }
    return "No especificada";
  };

  const pet = {
    name: petData?.name || "Maxi",
    breed: petData?.breed || "Border Collie",
    image: petData?.imageURL || perro,
    sex: getSexLabel(petData?.sex),
    size: getSizeLabel(petData?.gender),
    weight: petData?.weight ? `${petData.weight} kg` : "0,0 kg",
    age: getAgeDisplay(),
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
        const updatedPhotos = [...photos, ...newPhotos];
        savePhotos(updatedPhotos);
        // Si es la primera foto, establecer el índice en 0
        if (photos.length === 0) {
          setCurrentPhotoIndex(0);
        }
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
              <div className="pet-profile-detail-divider"></div>
              <div className="pet-profile-detail-item">
                <span className="pet-profile-detail-label">Tamaño</span>
                <span className="pet-profile-detail-value">{pet.size}</span>
              </div>
              <div className="pet-profile-detail-divider"></div>
              <div className="pet-profile-detail-item">
                <span className="pet-profile-detail-label">Peso</span>
                <span className="pet-profile-detail-value">{pet.weight}</span>
              </div>
              <div className="pet-profile-detail-divider"></div>
              <div className="pet-profile-detail-item">
                <span className="pet-profile-detail-label">Edad</span>
                <span className="pet-profile-detail-value">{pet.age}</span>
              </div>
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

