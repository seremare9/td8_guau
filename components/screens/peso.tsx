"use client";

import { useState, useRef, useEffect } from "react";
import MobileFrame from "./mobile-frame";
import Image from "next/image";
import { ArrowLeft, ChevronDown, Plus, Info, Calendar, Trash2 } from "lucide-react";
import perro from "../images/perro.png";
import lupaIcon from "../images/lupa.svg";
import lineSvg from "../images/line.svg";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import "../styles/vaccines-styles.css";

interface PesoProps {
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

interface PesoRecord {
  id: string;
  peso: string; // Peso en kilos
  fecha: string; // Fecha del registro (YYYY-MM-DD)
  petName: string;
  notas?: string;
}

export default function Peso({
  userName = "User",
  petData,
  onBack,
  onUpdatePetData,
}: PesoProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PesoRecord | null>(null);
  const [records, setRecords] = useState<PesoRecord[]>([]);
  const addMenuRef = useRef<HTMLDivElement>(null);
  const [recordForm, setRecordForm] = useState({
    peso: "",
    fecha: "",
    notas: "",
  });
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

  useEffect(() => {
    const loadRecords = () => {
      const recordsKey = `peso_${pet.name}`;
      const recordsStr = localStorage.getItem(recordsKey);
      if (recordsStr) {
        try {
          const recordsData = JSON.parse(recordsStr);
          setRecords(recordsData);
        } catch (e) {
          console.error("Error al parsear registros:", e);
          setRecords([]);
        }
      } else {
        setRecords([]);
      }
    };
    
    loadRecords();
  }, [pet.name]);

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

  const handleAddRecord = () => {
    setShowAddRecord(true);
  };

  const handleBackFromAddRecord = () => {
    setShowAddRecord(false);
    setRecordForm({
      peso: "",
      fecha: "",
      notas: "",
    });
  };

  const handleSaveRecord = () => {
    const newRecord: PesoRecord = {
      id: Date.now().toString(),
      peso: recordForm.peso,
      fecha: recordForm.fecha,
      notas: recordForm.notas || undefined,
      petName: pet.name,
    };

    const recordsKey = `peso_${pet.name}`;
    const existingRecords = records.length > 0 ? records : [];
    const updatedRecords = [...existingRecords, newRecord];
    localStorage.setItem(recordsKey, JSON.stringify(updatedRecords));
    setRecords(updatedRecords);

    // Actualizar el peso más reciente en petData
    if (onUpdatePetData && petData) {
      const updatedPetData = { ...petData, weight: `${recordForm.peso} kg` };
      onUpdatePetData(updatedPetData);
      
      // Guardar también en localStorage
      const petDataKey = `pet_data_${pet.name}`;
      localStorage.setItem(petDataKey, JSON.stringify(updatedPetData));
    }

    handleBackFromAddRecord();
  };

  const handleRecordClick = (record: PesoRecord) => {
    setSelectedRecord(record);
  };

  const handleCloseRecordDetails = () => {
    setSelectedRecord(null);
  };

  const handleDeleteRecord = (recordId: string) => {
    if (window.confirm("¿Estás seguro de que querés eliminar este registro?")) {
      const updatedRecords = records.filter((r) => r.id !== recordId);
      setRecords(updatedRecords);
      
      const recordsKey = `peso_${pet.name}`;
      localStorage.setItem(recordsKey, JSON.stringify(updatedRecords));
      
      // Si se eliminó el registro más reciente, actualizar el peso en petData
      if (updatedRecords.length > 0) {
        const sortedRecords = [...updatedRecords].sort((a, b) => {
          const dateA = new Date(a.fecha + "T00:00:00");
          const dateB = new Date(b.fecha + "T00:00:00");
          return dateB.getTime() - dateA.getTime();
        });
        const mostRecent = sortedRecords[0];
        if (onUpdatePetData && petData) {
          const updatedPetData = { ...petData, weight: `${mostRecent.peso} kg` };
          onUpdatePetData(updatedPetData);
          const petDataKey = `pet_data_${pet.name}`;
          localStorage.setItem(petDataKey, JSON.stringify(updatedPetData));
        }
      } else {
        // Si no hay registros, limpiar el peso
        if (onUpdatePetData && petData) {
          const updatedPetData = { ...petData, weight: undefined };
          onUpdatePetData(updatedPetData);
          const petDataKey = `pet_data_${pet.name}`;
          localStorage.setItem(petDataKey, JSON.stringify(updatedPetData));
        }
      }
      
      setSelectedRecord(null);
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString + "T00:00:00");
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const getYear = (dateString: string): number => {
    if (!dateString) return new Date().getFullYear();
    const date = new Date(dateString + "T00:00:00");
    return date.getFullYear();
  };

  const filteredRecords = records.filter((record) => {
    if (!searchQuery) return true;
    return record.peso.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const recordsByYear = filteredRecords.reduce((acc, record) => {
    const year = getYear(record.fecha);
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(record);
    return acc;
  }, {} as { [year: number]: PesoRecord[] });

  const sortedYears = Object.keys(recordsByYear)
    .map(Number)
    .sort((a, b) => b - a);

  sortedYears.forEach((year) => {
    recordsByYear[year].sort((a, b) => {
      const dateA = new Date(a.fecha + "T00:00:00");
      const dateB = new Date(b.fecha + "T00:00:00");
      return dateB.getTime() - dateA.getTime();
    });
  });

  if (showAddRecord) {
    return (
      <MobileFrame>
        <div className="vaccines-container">
          <div className="vaccines-header">
            <div className="vaccines-header-left">
              <button
                onClick={handleBackFromAddRecord}
                className="vaccines-back-button"
                aria-label="Volver"
              >
                <ArrowLeft className="vaccines-back-icon" />
              </button>
              <h1 className="vaccines-title">Registrar peso</h1>
            </div>
          </div>

          <div className="vaccines-header-line">
            <Image src={lineSvg} alt="Line separator" width={336} height={2} />
          </div>

          <div className="vaccine-form-container">
            <div className="vaccine-form-field">
              <label className="vaccine-form-label">Peso (kg)</label>
              <Input
                type="number"
                step="0.1"
                placeholder="Ej: 15.5"
                value={recordForm.peso}
                onChange={(e) =>
                  setRecordForm({ ...recordForm, peso: e.target.value })
                }
                className="vaccine-form-input"
              />
            </div>

            <div className="vaccine-form-field">
              <label className="vaccine-form-label">Fecha</label>
              <Input
                type="date"
                value={recordForm.fecha}
                onChange={(e) =>
                  setRecordForm({ ...recordForm, fecha: e.target.value })
                }
                className="vaccine-form-input"
              />
            </div>

            <div className="vaccine-form-field">
              <label className="vaccine-form-label">Notas (opcional)</label>
              <textarea
                placeholder="Agregar notas adicionales..."
                value={recordForm.notas}
                onChange={(e) =>
                  setRecordForm({ ...recordForm, notas: e.target.value })
                }
                className="vaccine-form-textarea"
                rows={4}
              />
            </div>

            <div className="vaccine-form-button-section">
              <Button
                onClick={handleSaveRecord}
                className="vaccine-form-save-button"
                disabled={
                  !recordForm.peso ||
                  !recordForm.fecha
                }
              >
                Guardar
              </Button>
            </div>
          </div>
        </div>
      </MobileFrame>
    );
  }

  return (
    <MobileFrame>
      <div className="vaccines-container">
        <div className="vaccines-header">
          <div className="vaccines-header-left">
            <button onClick={onBack} className="vaccines-back-button" aria-label="Volver">
              <ArrowLeft className="vaccines-back-icon" />
            </button>
            <h1 className="vaccines-title">Peso</h1>
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
        
        <div className="vaccines-header-line">
          <Image src={lineSvg} alt="Line separator" width={336} height={2} />
        </div>

        <div className="vaccines-content">
          <div className="vaccines-search-section">
            <div className="vaccines-search-container">
              <div className="vaccines-search-icon-wrapper">
                <Image src={lupaIcon} alt="Buscar" width={20} height={20} />
              </div>
              <input
                type="text"
                className="vaccines-search-input"
                placeholder="Buscar por peso"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="vaccines-add-menu-wrapper" ref={addMenuRef}>
              <button
                className="vaccines-add-button"
                aria-label="Agregar registro"
                onClick={handleAddRecord}
              >
                <Plus className="vaccines-add-icon" />
              </button>
            </div>
          </div>

          <div className="vaccines-info-banner">
            <Info className="vaccines-info-icon" />
            <span className="vaccines-info-text">Historial de peso</span>
          </div>
          <div className="vaccines-header-line">
            <Image src={lineSvg} alt="Line separator" width={336} height={2} />
          </div>

          {sortedYears.length > 0 ? (
            sortedYears.map((year) => (
              <div key={year} className="vaccines-year-section">
                <h3 className="vaccines-year-title">{year}</h3>
                <div className="vaccines-list">
                  {recordsByYear[year].map((record) => {
                    return (
                      <div
                        key={record.id}
                        className="vaccine-card vaccine-card-applied"
                        onClick={() => handleRecordClick(record)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="vaccine-card-content">
                          <h4 className="vaccine-card-title">
                            {record.peso} kg
                          </h4>
                          <div className="vaccine-card-date">
                            <Calendar className="vaccine-card-calendar-icon" />
                            <span>{formatDate(record.fecha)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="vaccines-year-section">
              <h3 className="vaccines-year-title">{new Date().getFullYear()}</h3>
              <div className="vaccines-empty-state">
                <p className="vaccines-empty-text">No tenés registros de peso</p>
              </div>
            </div>
          )}
        </div>

        {selectedRecord && (
          <div className="vaccine-details-modal-overlay" onClick={handleCloseRecordDetails}>
            <div className="vaccine-details-modal" onClick={(e) => e.stopPropagation()}>
              <div className="vaccine-details-header">
                <h2 className="vaccine-details-title">
                  {selectedRecord.peso} kg
                </h2>
                <div className="vaccine-details-header-buttons">
                  <button
                    onClick={() => handleDeleteRecord(selectedRecord.id)}
                    className="vaccine-details-delete-button"
                    aria-label="Eliminar registro"
                  >
                    <Trash2 className="vaccine-details-delete-icon" />
                  </button>
                  <button
                    onClick={handleCloseRecordDetails}
                    className="vaccine-details-close-button"
                    aria-label="Cerrar"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="vaccine-details-content">
                <div className="vaccine-details-field">
                  <span className="vaccine-details-label">Fecha</span>
                  <span className="vaccine-details-value">{formatDate(selectedRecord.fecha)}</span>
                </div>
                
                {selectedRecord.notas && (
                  <div className="vaccine-details-field">
                    <span className="vaccine-details-label">Notas</span>
                    <span className="vaccine-details-value vaccine-details-notes">{selectedRecord.notas}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </MobileFrame>
  );
}

