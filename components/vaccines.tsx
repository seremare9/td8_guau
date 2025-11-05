"use client";

import { useState, useRef, useEffect } from "react";
import MobileFrame from "./mobile-frame";
import Image from "next/image";
import { ArrowLeft, ChevronDown, Plus, Info } from "lucide-react";
import perro from "./images/perro.png";
import lupaIcon from "./images/lupa.svg";
import lineSvg from "./images/line.svg";
import "./styles/vaccines-styles.css";

interface VaccinesProps {
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
}

export default function Vaccines({
  userName = "User",
  petData,
  onBack,
  onUpdatePetData,
}: VaccinesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pet = {
    name: petData?.name || "Maxi",
    image: petData?.imageURL || perro,
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
      
      if (petData) {
        petsMap.set(petData.name, petData);
      }
      
      const pets = Array.from(petsMap.values());
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

  return (
    <MobileFrame>
      <div className="vaccines-container">
        {/* Header */}
        <div className="vaccines-header">
          <div className="vaccines-header-left">
            <button onClick={onBack} className="vaccines-back-button" aria-label="Volver">
              <ArrowLeft className="vaccines-back-icon" />
            </button>
            <h1 className="vaccines-title">Vacunas</h1>
          </div>
          <div className="vaccines-header-right">
            <div className="vaccines-selector-wrapper" ref={dropdownRef}>
              <div 
                className="vaccines-selector"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="vaccines-selector-content">
                  <div className="vaccines-selector-image">
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
                  <span className="vaccines-selector-name">{pet.name}</span>
                  <ChevronDown className={`vaccines-selector-chevron ${isDropdownOpen ? 'open' : ''}`} />
                </div>
              </div>
              {/* Menú desplegable */}
              {isDropdownOpen && (
                <div className="vaccines-dropdown">
                  {allPets.map((petOption, index) => (
                    <div
                      key={index}
                      className={`vaccines-dropdown-item ${petOption.name === pet.name ? 'active' : ''}`}
                      onClick={() => handlePetSelect(petOption)}
                    >
                      <div className="vaccines-dropdown-item-image">
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
                      <span className="vaccines-dropdown-item-name">{petOption.name}</span>
                      {petOption.name === pet.name && (
                        <span className="vaccines-dropdown-item-check">✓</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Line separator */}
        <div className="vaccines-header-line">
          <Image src={lineSvg} alt="Line separator" width={336} height={2} />
        </div>

        {/* Content */}
        <div className="vaccines-content">
          {/* Search and Add Button */}
          <div className="vaccines-search-section">
            <div className="vaccines-search-container">
              <div className="vaccines-search-icon-wrapper">
                <Image src={lupaIcon} alt="Buscar" width={20} height={20} />
              </div>
              <input
                type="text"
                className="vaccines-search-input"
                placeholder="Buscar por tipo"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="vaccines-add-button" aria-label="Agregar vacuna">
              <Plus className="vaccines-add-icon" />
            </button>
          </div>

          {/* Information Banner */}
          <div className="vaccines-info-banner">
            <Info className="vaccines-info-icon" />
            <span className="vaccines-info-text">Información sobre vacunas</span>
          </div>

          {/* Year Section */}
          <div className="vaccines-year-section">
            <h3 className="vaccines-year-title">2025</h3>
            <div className="vaccines-empty-state">
              <p className="vaccines-empty-text">No tenés vacunas registradas</p>
            </div>
          </div>
        </div>
      </div>
    </MobileFrame>
  );
}

