"use client";

import { useState, useRef, useEffect } from "react";
import MobileFrame from "./mobile-frame";
import Image from "next/image";
import { ArrowLeft, ChevronDown, Pencil, Plus, ChevronLeft, ChevronRight, Trash2, X, Scale } from "lucide-react";
import perro from "../images/perro.png";
import "../styles/pet-profile-styles.css";
import lineSvg from "../images/line.svg";
import petEditInfoIcon from "../images/pet-edit-info.svg";
import vacunaIcon from "../images/event-icons/vacuna.svg";
import medicinaIcon from "../images/event-icons/medicina.svg";
import veterinarioIcon from "../images/event-icons/veterinario.svg";
import otroIcon from "../images/event-icons/otro.svg";
import higieneIcon from "../images/event-icons/higiene.svg";
import antiparasitarioIcon from "../images/event-icons/antiparasitario.svg";

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
    appearance?: string;
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
    appearance?: string;
  }) => void;
  onOpenVaccines?: () => void;
  onOpenHigiene?: () => void;
  onOpenMedicina?: () => void;
  onOpenAntiparasitario?: () => void;
  onOpenVeterinario?: () => void;
  onOpenOtro?: () => void;
  onOpenPeso?: () => void;
  initialTab?: "sobre" | "salud" | "nutricion";
}

export default function PetProfile({
  userName = "User",
  petData,
  onBack,
  onUpdatePetData,
  onOpenVaccines,
  onOpenHigiene,
  onOpenMedicina,
  onOpenAntiparasitario,
  onOpenVeterinario,
  onOpenOtro,
  onOpenPeso,
  initialTab = "sobre",
}: PetProfileProps) {
  const [activeTab, setActiveTab] = useState<"sobre" | "salud" | "nutricion">(initialTab);

  // Actualizar el tab cuando cambie initialTab
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isEditingAppearance, setIsEditingAppearance] = useState(false);
  const [appearanceText, setAppearanceText] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [allPets, setAllPets] = useState<Array<{
    name: string;
    breed: string;
    imageURL?: string;
    sex?: string;
    gender?: string;
    weight?: string;
    birthday?: string;
    approximateAge?: string;
    photos?: string[];
    appearance?: string;
  }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Función para obtener la clave de localStorage para las fotos
  const getStorageKey = () => {
    const petName = petData?.name || "default";
    return `pet_photos_${petName}`;
  };

  // Cargar todas las mascotas desde localStorage
  useEffect(() => {
    const loadAllPets = () => {
      const petsMap = new Map<string, {
        name: string;
        breed: string;
        imageURL?: string;
        sex?: string;
        gender?: string;
        weight?: string;
        birthday?: string;
        approximateAge?: string;
        photos?: string[];
        appearance?: string;
      }>();
      
      // Buscar todas las claves de mascotas en localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('pet_data_')) {
          const petName = key.replace('pet_data_', '');
          const petDataStr = localStorage.getItem(key);
          
          if (petDataStr) {
            try {
              const petDataObj = JSON.parse(petDataStr);
              if (petDataObj.name && !petsMap.has(petDataObj.name)) {
                petsMap.set(petDataObj.name, petDataObj);
              }
            } catch (e) {
              console.error("Error al parsear datos de mascota:", e);
            }
          }
        }
      }
      
      // Buscar mascotas por fotos también
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('pet_photos_')) {
          const petName = key.replace('pet_photos_', '');
          if (!petsMap.has(petName)) {
            // Si hay fotos pero no datos completos, crear entrada básica
            petsMap.set(petName, {
              name: petName,
              breed: "Sin raza especificada",
            });
          }
        }
      }
      
      // Siempre incluir la mascota actual si existe
      if (petData) {
        petsMap.set(petData.name, petData);
      }
      
      // Convertir el Map a array
      const pets = Array.from(petsMap.values());
      
      // Si no hay ninguna mascota, agregar la actual como default
      if (pets.length === 0 && petData) {
        pets.push(petData);
      }
      
      setAllPets(pets);
    };
    
    loadAllPets();
  }, [petData]);

  // Cerrar menú cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Función para cambiar de mascota
  const handlePetSelect = (selectedPet: {
    name: string;
    breed: string;
    imageURL?: string;
    sex?: string;
    gender?: string;
    weight?: string;
    birthday?: string;
    approximateAge?: string;
    photos?: string[];
    appearance?: string;
  }) => {
    if (onUpdatePetData) {
      onUpdatePetData(selectedPet);
    }
    setIsDropdownOpen(false);
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

  // Inicializar appearanceText cuando petData cambia
  useEffect(() => {
    if (petData?.appearance) {
      setAppearanceText(petData.appearance);
    } else {
      setAppearanceText("Agregá una descripción de tu mascota");
    }
  }, [petData?.appearance]);

  // Función para obtener el peso más reciente desde los registros
  const getLatestWeight = (): string => {
    const petName = petData?.name || "Maxi";
    const recordsKey = `peso_${petName}`;
    const recordsStr = localStorage.getItem(recordsKey);
    if (recordsStr) {
      try {
        const records = JSON.parse(recordsStr);
        if (records.length > 0) {
          // Ordenar por fecha (más reciente primero)
          const sortedRecords = [...records].sort((a, b) => {
            const dateA = new Date(a.fecha + "T00:00:00");
            const dateB = new Date(b.fecha + "T00:00:00");
            return dateB.getTime() - dateA.getTime();
          });
          return `${sortedRecords[0].peso} kg`;
        }
      } catch (e) {
        console.error("Error al parsear registros de peso:", e);
      }
    }
    // Si no hay registros, usar el peso de petData o un valor por defecto
    return petData?.weight ? `${petData.weight} kg` : "0,0 kg";
  };

  const pet = {
    name: petData?.name || "Maxi",
    breed: petData?.breed || "Border Collie",
    image: petData?.imageURL || perro,
    sex: getSexLabel(petData?.sex),
    size: getSizeLabel(petData?.gender),
    weight: getLatestWeight(),
    age: getAgeDisplay(),
    appearance: petData?.appearance || "Brown-Dark-White mix, with light eyebrows shape and a heart shaped patch on left paw.",
  };

  // Función para guardar la apariencia
  const handleSaveAppearance = () => {
    if (onUpdatePetData && petData) {
      const updatedPetData = { ...petData, appearance: appearanceText };
      onUpdatePetData(updatedPetData);
      
      // Guardar también en localStorage
      const storageKey = `pet_data_${petData.name || "default"}`;
      const existingData = localStorage.getItem(storageKey);
      if (existingData) {
        try {
          const parsedData = JSON.parse(existingData);
          parsedData.appearance = appearanceText;
          localStorage.setItem(storageKey, JSON.stringify(parsedData));
        } catch (e) {
          console.error("Error al guardar apariencia en localStorage:", e);
        }
      }
    }
    setIsEditingAppearance(false);
  };

  // Función para cancelar edición
  const handleCancelEdit = () => {
    // Restaurar el texto original
    if (petData?.appearance) {
      setAppearanceText(petData.appearance);
    } else {
      setAppearanceText("Brown-Dark-White mix, with light eyebrows shape and a heart shaped patch on left paw.");
    }
    setIsEditingAppearance(false);
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

  // Función para manejar el cambio de la foto principal de la mascota
  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result as string;
        // Actualizar petData con la nueva imagen
        if (onUpdatePetData && petData) {
          const updatedPetData = { ...petData, imageURL: imageDataUrl };
          onUpdatePetData(updatedPetData);
          
          // Guardar también en localStorage
          const storageKey = `pet_data_${petData.name || "default"}`;
          const existingData = localStorage.getItem(storageKey);
          if (existingData) {
            try {
              const parsedData = JSON.parse(existingData);
              parsedData.imageURL = imageDataUrl;
              localStorage.setItem(storageKey, JSON.stringify(parsedData));
            } catch (e) {
              console.error("Error al guardar imagen en localStorage:", e);
            }
          } else {
            // Si no hay datos previos, crear un nuevo objeto
            const newData = { ...petData, imageURL: imageDataUrl };
            localStorage.setItem(storageKey, JSON.stringify(newData));
          }
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset input para permitir seleccionar la misma imagen nuevamente
    if (profileImageInputRef.current) {
      profileImageInputRef.current.value = '';
    }
  };

  // Función para abrir el selector de imagen de perfil
  const handleEditProfileImageClick = () => {
    profileImageInputRef.current?.click();
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

  const handleDeletePhoto = (index: number, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    if (photos.length === 0) return;
    
    const newPhotos = photos.filter((_, i) => i !== index);
    
    // Cerrar modal si estaba abierto
    if (selectedPhotoIndex === index) {
      setSelectedPhotoIndex(null);
    }
    
    // Ajustar el índice actual si es necesario
    let newIndex = currentPhotoIndex;
    if (newPhotos.length === 0) {
      // Si no quedan fotos, resetear el índice
      newIndex = 0;
    } else if (currentPhotoIndex >= newPhotos.length) {
      // Si el índice actual es mayor que la cantidad de fotos restantes, ajustar
      newIndex = newPhotos.length - 1;
    } else if (index < currentPhotoIndex) {
      // Si eliminamos una foto antes de la actual, ajustar el índice
      newIndex = currentPhotoIndex - 1;
    }
    
    setCurrentPhotoIndex(newIndex);
    savePhotos(newPhotos);
  };

  return (
    <MobileFrame>
      <div className="pet-profile-container">
        {/* Header */}
        <div className="pet-profile-header">
          <div className="pet-profile-header-left">
          <button onClick={onBack} className="pet-profile-back-button" aria-label="Volver">
            <ArrowLeft className="pet-profile-back-icon" />
          </button>
          <h1 className="pet-profile-title">Perfil de mascota</h1>
          </div>
          <div className="pet-profile-header-right">
          <div className="pet-profile-selector-wrapper" ref={dropdownRef}>
            <div 
              className="pet-profile-selector"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
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
                <ChevronDown className={`pet-profile-selector-chevron ${isDropdownOpen ? 'open' : ''}`} />
              </div>
            </div>
            {/* Menú desplegable */}
            {isDropdownOpen && (
              <div className="pet-profile-dropdown">
                {allPets.map((petOption, index) => (
                  <div
                    key={index}
                    className={`pet-profile-dropdown-item ${petOption.name === pet.name ? 'active' : ''}`}
                    onClick={() => handlePetSelect(petOption)}
                  >
                    <div className="pet-profile-dropdown-item-image">
                      {petOption.imageURL && (typeof petOption.imageURL === 'string' && petOption.imageURL.startsWith('data:') ? (
                        <img
                          src={petOption.imageURL}
                          alt={petOption.name}
                          width={32}
                          height={32}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                        />
                      ) : (
                        <Image
                          src={petOption.imageURL || perro}
                          alt={petOption.name}
                          width={32}
                          height={32}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                        />
                      ))}
                    </div>
                    <span className="pet-profile-dropdown-item-name">{petOption.name}</span>
                    {petOption.name === pet.name && (
                      <span className="pet-profile-dropdown-item-check">✓</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          </div>
        </div>
        {/* Line separator */}
    <div className="pet-profile-header-line">
      <Image src={lineSvg} alt="Line separator" width={336} height={2} />
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
          {activeTab === "sobre" && (
            <>
          {/* Pet Image */}
          <div className="pet-profile-image-container">
            <div className="pet-profile-image-wrapper">
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
              {/* Botón de editar foto - posicionado debajo de la imagen */}
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

          {/* Pet Name and Breed */}
          <div className="pet-profile-name-section">
            <div className="pet-profile-name-wrapper">
              <h2 className="pet-profile-name">{pet.name}</h2>
            </div>
            <p className="pet-profile-breed">{pet.breed}</p>
          </div>

          {/* Appearance Section */}
          <div className="pet-profile-section">
            <div className="pet-profile-section-title-wrapper">
              <h3 className="pet-profile-section-title">Apariencia y rasgos distintivos</h3>
              {!isEditingAppearance && (
                <button
                  className="pet-profile-edit-appearance-button"
                  onClick={() => setIsEditingAppearance(true)}
                  aria-label="Editar apariencia"
                >
                  <Image src={petEditInfoIcon} alt="Editar" width={38} height={38} />
                </button>
              )}
            </div>
            {isEditingAppearance ? (
              <div className="pet-profile-appearance-edit">
                <textarea
                  className="pet-profile-appearance-textarea"
                  value={appearanceText}
                  onChange={(e) => setAppearanceText(e.target.value)}
                  placeholder="Describe la apariencia y rasgos distintivos de tu mascota..."
                  rows={4}
                />
                <div className="pet-profile-appearance-actions">
                  <button
                    className="pet-profile-save-button"
                    onClick={handleSaveAppearance}
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
              <p className="pet-profile-appearance-text">{appearanceText || pet.appearance}</p>
            )}
            
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
              <>
                <div className="pet-profile-photos-grid">
                  {photos.map((photo, index) => (
                    <div
                      key={index}
                      className="pet-profile-photo-thumbnail"
                      onClick={() => setSelectedPhotoIndex(index)}
                    >
                      {photo.startsWith('data:') ? (
                        <img
                          src={photo}
                          alt={`Foto ${index + 1} de ${pet.name}`}
                          className="pet-profile-thumbnail-image"
                        />
                      ) : (
                        <Image
                          src={photo}
                          alt={`Foto ${index + 1} de ${pet.name}`}
                          width={100}
                          height={100}
                          className="pet-profile-thumbnail-image"
                        />
                      )}
                      <button
                        className="pet-profile-thumbnail-delete-button"
                        onClick={(e) => handleDeletePhoto(index, e)}
                        aria-label={`Eliminar foto ${index + 1}`}
                      >
                        <Trash2 className="pet-profile-thumbnail-delete-icon" />
                      </button>
                    </div>
                  ))}
                </div>
                
                {/* Botón para agregar más fotos */}
                <button
                  className="pet-profile-add-more-photos-button"
                  onClick={handleAddPhotoClick}
                >
                  <Plus className="pet-profile-add-more-icon" />
                  <span>Agregar más fotos</span>
                </button>
              </>
            )}
            
            {/* Modal para vista ampliada */}
            {selectedPhotoIndex !== null && (
              <div 
                className="pet-profile-photo-modal"
                onClick={() => setSelectedPhotoIndex(null)}
              >
                <div 
                  className="pet-profile-photo-modal-content"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="pet-profile-photo-modal-close"
                    onClick={() => setSelectedPhotoIndex(null)}
                    aria-label="Cerrar"
                  >
                    <X className="pet-profile-photo-modal-close-icon" />
                  </button>
                  {photos[selectedPhotoIndex] && (
                    <>
                      {photos[selectedPhotoIndex].startsWith('data:') ? (
                        <img
                          src={photos[selectedPhotoIndex]}
                          alt={`Foto ${selectedPhotoIndex + 1} de ${pet.name}`}
                          className="pet-profile-photo-modal-image"
                        />
                      ) : (
                        <Image
                          src={photos[selectedPhotoIndex]}
                          alt={`Foto ${selectedPhotoIndex + 1} de ${pet.name}`}
                          width={800}
                          height={600}
                          className="pet-profile-photo-modal-image"
                        />
                      )}
                      {/* Navegación en el modal */}
                      {photos.length > 1 && (
                        <>
                          <button
                            className="pet-profile-photo-modal-nav pet-profile-photo-modal-prev"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPhotoIndex((selectedPhotoIndex - 1 + photos.length) % photos.length);
                            }}
                            aria-label="Foto anterior"
                          >
                            <ChevronLeft className="pet-profile-photo-modal-nav-icon" />
                          </button>
                          <button
                            className="pet-profile-photo-modal-nav pet-profile-photo-modal-next"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPhotoIndex((selectedPhotoIndex + 1) % photos.length);
                            }}
                            aria-label="Foto siguiente"
                          >
                            <ChevronRight className="pet-profile-photo-modal-nav-icon" />
                          </button>
                        </>
                      )}
                      {/* Botón de eliminar en el modal */}
                      <button
                        className="pet-profile-photo-modal-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePhoto(selectedPhotoIndex, e);
                        }}
                        aria-label="Eliminar foto"
                      >
                        <Trash2 className="pet-profile-photo-modal-delete-icon" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          </>
          )}

          {activeTab === "salud" && (
            <div className="pet-profile-health-section">
              <div className="pet-profile-health-card" onClick={onOpenVaccines || (() => {})}>
                <div className="pet-profile-health-icon-wrapper pet-profile-health-vacuna">
                  <Image src={vacunaIcon} alt="Vacunas" width={54} height={54} />
                </div>
                <span className="pet-profile-health-text">Vacunas</span>
              </div>
              <div className="pet-profile-health-card" onClick={onOpenHigiene || (() => {})}>
                <div className="pet-profile-health-icon-wrapper pet-profile-health-higiene">
                  <Image src={higieneIcon} alt="Higiene" width={54} height={54} />
                </div>
                <span className="pet-profile-health-text">Higiene</span>
              </div>
              <div className="pet-profile-health-card" onClick={onOpenMedicina || (() => {})}>
                <div className="pet-profile-health-icon-wrapper pet-profile-health-medicina">
                  <Image src={medicinaIcon} alt="Medicina" width={54} height={54} />
                </div>
                <span className="pet-profile-health-text">Medicina</span>
              </div>
              <div className="pet-profile-health-card" onClick={onOpenAntiparasitario || (() => {})}>
                <div className="pet-profile-health-icon-wrapper pet-profile-health-antiparasitario">
                  <Image src={antiparasitarioIcon} alt="Anti parasitario" width={54} height={54} />
                </div>
                <span className="pet-profile-health-text">Anti parasitario</span>
              </div>
              <div className="pet-profile-health-card" onClick={onOpenVeterinario || (() => {})}>
                <div className="pet-profile-health-icon-wrapper pet-profile-health-veterinario">
                  <Image src={veterinarioIcon} alt="Visita al veterinario" width={54} height={54} />
                </div>
                <span className="pet-profile-health-text">Visita al veterinario</span>
              </div>
              <div className="pet-profile-health-card" onClick={onOpenPeso || (() => {})}>
                <div className="pet-profile-health-icon-wrapper pet-profile-health-peso">
                  <Scale className="pet-profile-health-peso-icon" width={54} height={54} />
                </div>
                <span className="pet-profile-health-text">Peso</span>
              </div>
              <div className="pet-profile-health-card" onClick={onOpenOtro || (() => {})}>
                <div className="pet-profile-health-icon-wrapper pet-profile-health-otro">
                  <Image src={otroIcon} alt="Otro" width={54} height={54} />
                </div>
                <span className="pet-profile-health-text">Otro</span>
              </div>
            </div>
          )}

          {activeTab === "nutricion" && (
            <div className="pet-profile-nutricion-section">
              <div className="pet-profile-nutricion-placeholder">
                <p className="pet-profile-nutricion-text">Próximamente</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MobileFrame>
  );
}

