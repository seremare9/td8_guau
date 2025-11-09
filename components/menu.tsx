"use client";

import { useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import MobileFrame from "./mobile-frame";
import {
  X,
  ShoppingBag,
  Users,
  Calendar,
  HelpCircle,
  User,
  Settings,
  Plus,
} from "lucide-react";
import perro from "./images/perro.png";
import imgIcon from "./images/img-icon.svg";
import logoGuau from "./images/logo_guau.png";
import "./styles/menu-styles.css";
import lineSvg from "./images/line.svg";

interface MenuScreenProps {
  userName?: string;
  onClose: () => void;
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
  onOpenPetProfile?: (petData?: {
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
  onOpenCalendar?: () => void;
  onAddNewPet?: () => void;
  onSelectPet?: (petData: {
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
}

export default function MenuScreen({
  userName = "User",
  onClose,
  petData,
  onOpenPetProfile,
  onOpenCalendar,
  onAddNewPet,
  onSelectPet,
}: MenuScreenProps) {
  const [pets, setPets] = useState<
    Array<{
      id: number;
      name: string;
      image: string | StaticImageData;
      fullData?: {
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
      };
    }>
  >([]);

  // Cargar todas las mascotas desde localStorage
  useEffect(() => {
    const loadAllPets = () => {
      const petsMap = new Map<
        string,
        {
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
        }
      >();

      // Buscar todas las claves de mascotas en localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("pet_data_")) {
          const petName = key.replace("pet_data_", "");
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

      // Siempre incluir la mascota actual si existe
      if (petData) {
        petsMap.set(petData.name, petData);
      }

      // Convertir el Map a array con todos los datos
      const allPets = Array.from(petsMap.values()).map((pet, index) => ({
        id: index + 1,
        name: pet.name,
        image: pet.imageURL || perro,
        fullData: pet,
      }));

      // Si no hay mascotas, agregar la actual como default
      if (allPets.length === 0 && petData) {
        allPets.push({
          id: 1,
          name: petData.name || "Maxi",
          image: petData.imageURL || perro,
          fullData: petData,
        });
      }

      setPets(allPets);
    };

    loadAllPets();

    // Escuchar cambios en localStorage
    const handleStorageChange = () => {
      loadAllPets();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("customStorageChange", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("customStorageChange", handleStorageChange);
    };
  }, [petData]);

  return (
    <MobileFrame>
      <div className="menu-container menu-slide-in">
        {/* Header */}
        <div className="menu-header">
          <div className="menu-header-left">
            <div className="menu-dog-icon">
              <Image
                src={logoGuau}
                alt="logo guau"
                width={40}
                height={40}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "0.75rem",
                }}
              />
            </div>
            <div className="menu-greeting">
              <span className="menu-greeting-text">Hola, </span>
              <span className="menu-greeting-name">{userName}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="menu-close-button"
            aria-label="Cerrar menú"
          >
            <X className="menu-close-icon" />
          </button>
        </div>
        {/* Line separator */}
        <div className="home-header-line">
          <Image src={lineSvg} alt="Line separator" width={336} height={2} />
        </div>

        {/* Mis mascotas */}
        <div className="menu-section">
          <h2 className="menu-section-title">Mis mascotas</h2>
          <div className="menu-pets-container">
            {pets.map((pet) => {
              const isSelected = petData && pet.fullData && petData.name === pet.fullData.name;
              return (
                <div
                  key={pet.id}
                  className={`menu-pet-item ${isSelected ? "menu-pet-item-selected" : ""}`}
                  onClick={() => {
                    if (pet.fullData && onSelectPet) {
                      // Solo actualizar la mascota seleccionada, no abrir el perfil
                      onSelectPet(pet.fullData);
                    }
                  }}
                  style={{ cursor: onSelectPet ? "pointer" : "default" }}
                >
                <div className={`menu-pet-circle ${isSelected ? "menu-pet-circle-selected" : "menu-pet-circle-unselected"}`}>
                  {typeof pet.image === "string" &&
                  pet.image.startsWith("data:") ? (
                    // Si es base64, usar img normal
                    <img
                      src={pet.image}
                      alt={pet.name}
                      width={64}
                      height={64}
                      className="menu-pet-image"
                    />
                  ) : (
                    // Si es una URL normal, usar Image de Next.js
                    <Image
                      src={pet.image}
                      alt={pet.name}
                      width={64}
                      height={64}
                      className="menu-pet-image"
                    />
                  )}
                </div>
                <span className={`menu-pet-name ${isSelected ? "menu-pet-name-selected" : ""}`}>{pet.name}</span>
              </div>
            );
            })}
            <div
              className="menu-pet-item"
              onClick={onAddNewPet}
              style={{ cursor: onAddNewPet ? "pointer" : "default" }}
            >
              <div className="menu-pet-circle menu-pet-new">
                <Plus className="menu-pet-plus-icon" />
              </div>
              <span className="menu-pet-name menu-pet-name-new">Nueva</span>
            </div>
          </div>
        </div>
        {/* Line separator */}
        <div className="home-header-line">
          <Image src={lineSvg} alt="Line separator" width={336} height={2} />
        </div>

        {/* Menu Items */}
        <div className="menu-items">
          <button className="menu-item">
            <ShoppingBag className="menu-item-icon" />
            <span className="menu-item-text">Tienda Guau</span>
          </button>
          <button className="menu-item">
            <Users className="menu-item-icon" />
            <span className="menu-item-text">Contactos</span>
          </button>
          <button className="menu-item" onClick={onOpenCalendar}>
            <Calendar className="menu-item-icon" />
            <span className="menu-item-text">Calendario</span>
          </button>
          <button className="menu-item">
            <HelpCircle className="menu-item-icon" />
            <span className="menu-item-text">Preguntas frecuentes</span>
          </button>
        </div>

        {/* Line separator */}
        <div className="home-header-line">
          <Image src={lineSvg} alt="Line separator" width={336} height={2} />
        </div>

        {/* Bottom Menu Items */}
        <div className="menu-items">
          <button className="menu-item">
            <User className="menu-item-icon" />
            <span className="menu-item-text">Mi cuenta</span>
          </button>
          <button className="menu-item">
            <Settings className="menu-item-icon" />
            <span className="menu-item-text">Configuración</span>
          </button>
        </div>
      </div>
    </MobileFrame>
  );
}
