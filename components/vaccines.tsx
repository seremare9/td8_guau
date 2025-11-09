"use client";

import { useState, useRef, useEffect } from "react";
import MobileFrame from "./mobile-frame";
import Image from "next/image";
import { ArrowLeft, ChevronDown, Plus, Info, Calendar, Trash2 } from "lucide-react";
import perro from "./images/perro.png";
import lupaIcon from "./images/lupa.svg";
import lineSvg from "./images/line.svg";
import vacunaIcon from "./images/event-icons/vacuna.svg";
import logoEvento from "./images/logo_evento.png";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
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

interface Vaccine {
  id: string;
  tipo: string;
  fecha: string; // Fecha de aplicación o turno (YYYY-MM-DD)
  horario?: string; // Horario del turno (HH:MM)
  veterinario?: string;
  notas?: string;
  proximaDosis: string; // Fecha de próxima dosis (YYYY-MM-DD)
  petName: string;
  esAplicada?: boolean; // true si es una vacuna ya aplicada, false si es un turno pendiente
}

export default function Vaccines({
  userName = "User",
  petData,
  onBack,
  onUpdatePetData,
}: VaccinesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAddVaccine, setShowAddVaccine] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState<Vaccine | null>(null);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [isVaccineApplied, setIsVaccineApplied] = useState(false); // true = vacuna aplicada, false = turno
  const [showAddMenu, setShowAddMenu] = useState(false);
  const addMenuRef = useRef<HTMLDivElement>(null);
  const [vaccineForm, setVaccineForm] = useState({
    tipo: "",
    fecha: "",
    horario: "",
    veterinario: "",
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

  // Cargar vacunas desde localStorage
  useEffect(() => {
    const loadVaccines = () => {
      const vaccinesKey = `vaccines_${pet.name}`;
      const vaccinesStr = localStorage.getItem(vaccinesKey);
      if (vaccinesStr) {
        try {
          const vaccinesData = JSON.parse(vaccinesStr);
          setVaccines(vaccinesData);
        } catch (e) {
          console.error("Error al parsear vacunas:", e);
          setVaccines([]);
        }
      } else {
        setVaccines([]);
      }
    };
    
    loadVaccines();
  }, [pet.name]);

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
      if (addMenuRef.current && !addMenuRef.current.contains(event.target as Node)) {
        setShowAddMenu(false);
      }
    };

    if (isDropdownOpen || showAddMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen, showAddMenu]);

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

  const handleAddVaccine = () => {
    setShowAddVaccine(true);
    setIsVaccineApplied(false); // Por defecto es un turno
  };

  const handleAddAppliedVaccine = () => {
    setShowAddVaccine(true);
    setIsVaccineApplied(true); // Es una vacuna ya aplicada
  };

  const handleBackFromAddVaccine = () => {
    setShowAddVaccine(false);
    setIsVaccineApplied(false);
    setVaccineForm({
      tipo: "",
      fecha: "",
      horario: "",
      veterinario: "",
      notas: "",
    });
  };

  // Función para calcular la próxima dosis (1 año después de la fecha de aplicación)
  const calculateNextDose = (applicationDate: string): string => {
    if (!applicationDate) return "";
    const date = new Date(applicationDate + "T00:00:00");
    date.setFullYear(date.getFullYear() + 1);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSaveVaccine = () => {
    // Calcular automáticamente la próxima dosis (1 año después de la fecha de aplicación)
    const proximaDosis = calculateNextDose(vaccineForm.fecha);
    
    // Crear nueva vacuna
    const newVaccine: Vaccine = {
      id: Date.now().toString(),
      tipo: vaccineForm.tipo,
      fecha: vaccineForm.fecha,
      horario: isVaccineApplied ? undefined : (vaccineForm.horario || undefined), // Solo horario si es turno
      veterinario: vaccineForm.veterinario || undefined,
      notas: vaccineForm.notas || undefined,
      proximaDosis: proximaDosis,
      petName: pet.name,
      esAplicada: isVaccineApplied, // Marcar si es aplicada o turno
    };

    // Guardar en localStorage
    const vaccinesKey = `vaccines_${pet.name}`;
    const existingVaccines = vaccines.length > 0 ? vaccines : [];
    const updatedVaccines = [...existingVaccines, newVaccine];
    localStorage.setItem(vaccinesKey, JSON.stringify(updatedVaccines));
    setVaccines(updatedVaccines);

    // Mostrar el cartel de confirmación solo si es un turno
    if (!isVaccineApplied) {
      setShowSuccessModal(true);
    } else {
      // Si es vacuna aplicada, volver directamente a la lista
      handleBackFromAddVaccine();
    }
  };

  const handleMasTarde = () => {
    // Cerrar el cartel y volver a la pantalla inicial de vacunas
    setShowSuccessModal(false);
    handleBackFromAddVaccine();
  };

  const handleVaccineClick = (vaccine: Vaccine) => {
    // Permitir ver detalles de todas las vacunas (pendientes y completadas)
    setSelectedVaccine(vaccine);
  };

  const handleCloseVaccineDetails = () => {
    setSelectedVaccine(null);
  };

  const handleDeleteVaccine = (vaccineId: string) => {
    // Confirmar eliminación
    if (window.confirm("¿Estás seguro de que querés eliminar este turno?")) {
      const updatedVaccines = vaccines.filter((v) => v.id !== vaccineId);
      setVaccines(updatedVaccines);
      
      // Actualizar localStorage
      const vaccinesKey = `vaccines_${pet.name}`;
      localStorage.setItem(vaccinesKey, JSON.stringify(updatedVaccines));
      
      // Cerrar el modal
      setSelectedVaccine(null);
    }
  };

  // Función para formatear fecha de YYYY-MM-DD a DD.MM.YYYY
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString + "T00:00:00");
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Función para formatear horario de HH:MM a formato legible
  const formatTime = (timeString: string): string => {
    if (!timeString) return "";
    return timeString;
  };

  // Función para obtener el año de una fecha
  const getYear = (dateString: string): number => {
    if (!dateString) return new Date().getFullYear();
    const date = new Date(dateString + "T00:00:00");
    return date.getFullYear();
  };

  // Función para determinar si una vacuna está pendiente
  const isPending = (vaccine: Vaccine): boolean => {
    // Si es una vacuna ya aplicada, nunca está pendiente
    if (vaccine.esAplicada) return false;
    
    // Si es un turno, verificar si la fecha es futura
    if (!vaccine.fecha) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const turnoDate = new Date(vaccine.fecha + "T00:00:00");
    return turnoDate >= today;
  };

  // Función para obtener el nombre completo del tipo de vacuna
  const getVaccineTypeName = (tipo: string): string => {
    const typeMap: { [key: string]: string } = {
      antirrabica: "Antirrábica",
      sextuple: "Séxtuple",
      moquillo: "Moquillo",
      hepatitis: "Hepatitis",
      parvovirus: "Parvovirus",
      leptospirosis: "Leptospirosis",
      bordetella: "Bordetella",
      otra: "Otra",
    };
    return typeMap[tipo] || tipo;
  };

  // Filtrar y agrupar vacunas por año
  const filteredVaccines = vaccines.filter((vaccine) => {
    if (!searchQuery) return true;
    const tipoName = getVaccineTypeName(vaccine.tipo).toLowerCase();
    return tipoName.includes(searchQuery.toLowerCase());
  });

  // Agrupar vacunas por año
  const vaccinesByYear = filteredVaccines.reduce((acc, vaccine) => {
    // Agrupar siempre por la fecha del turno (fecha)
    const year = getYear(vaccine.fecha);
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(vaccine);
    return acc;
  }, {} as { [year: number]: Vaccine[] });

  // Ordenar años de mayor a menor
  const sortedYears = Object.keys(vaccinesByYear)
    .map(Number)
    .sort((a, b) => b - a);

  // Ordenar vacunas dentro de cada año por fecha del turno (más recientes primero)
  sortedYears.forEach((year) => {
    vaccinesByYear[year].sort((a, b) => {
      // Ordenar por fecha del turno
      const dateA = new Date(a.fecha + "T00:00:00");
      const dateB = new Date(b.fecha + "T00:00:00");
      return dateB.getTime() - dateA.getTime();
    });
  });

  // Si estamos en la pantalla de agregar vacuna
  if (showAddVaccine) {
    return (
      <MobileFrame>
        <div className="vaccines-container">
          {/* Header */}
          <div className="vaccines-header">
            <div className="vaccines-header-left">
              <button
                onClick={handleBackFromAddVaccine}
                className="vaccines-back-button"
                aria-label="Volver"
              >
                <ArrowLeft className="vaccines-back-icon" />
              </button>
              <h1 className="vaccines-title">
                {isVaccineApplied ? "Registrar vacuna aplicada" : "Registrar turno"}
              </h1>
            </div>
          </div>

          {/* Line separator */}
          <div className="vaccines-header-line">
            <Image src={lineSvg} alt="Line separator" width={336} height={2} />
          </div>

          {/* Vaccine Icon */}
          <div className="vaccine-form-icon-wrapper">
            <Image src={vacunaIcon} alt="Vacuna" width={84} height={84} />
          </div>

          {/* Form */}
          <div className="vaccine-form-container">
            <div className="vaccine-form-field">
              <label className="vaccine-form-label">Tipo de vacuna</label>
              <Select
                value={vaccineForm.tipo}
                onValueChange={(value) =>
                  setVaccineForm({ ...vaccineForm, tipo: value })
                }
              >
                <SelectTrigger className="vaccine-form-select">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="antirrabica">Antirrábica</SelectItem>
                  <SelectItem value="sextuple">Séxtuple</SelectItem>
                  <SelectItem value="moquillo">Moquillo</SelectItem>
                  <SelectItem value="hepatitis">Hepatitis</SelectItem>
                  <SelectItem value="parvovirus">Parvovirus</SelectItem>
                  <SelectItem value="leptospirosis">Leptospirosis</SelectItem>
                  <SelectItem value="bordetella">Bordetella</SelectItem>
                  <SelectItem value="otra">Otra</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="vaccine-form-field">
              <label className="vaccine-form-label">
                {isVaccineApplied ? "Fecha de aplicación" : "Fecha y horario del turno"}
              </label>
              <div className="vaccine-form-datetime-container">
                <Input
                  type="date"
                  value={vaccineForm.fecha}
                  onChange={(e) =>
                    setVaccineForm({ ...vaccineForm, fecha: e.target.value })
                  }
                  className="vaccine-form-datetime-input"
                />
                {!isVaccineApplied && (
                  <Input
                    type="time"
                    value={vaccineForm.horario}
                    onChange={(e) =>
                      setVaccineForm({ ...vaccineForm, horario: e.target.value })
                    }
                    className="vaccine-form-datetime-input"
                  />
                )}
              </div>
            </div>

            <div className="vaccine-form-field">
              <label className="vaccine-form-label">Veterinario (opcional)</label>
              <Input
                type="text"
                placeholder="Nombre del veterinario"
                value={vaccineForm.veterinario}
                onChange={(e) =>
                  setVaccineForm({ ...vaccineForm, veterinario: e.target.value })
                }
                className="vaccine-form-input"
              />
            </div>

            <div className="vaccine-form-field">
              <label className="vaccine-form-label">Notas (opcional)</label>
              <textarea
                placeholder="Agregar notas adicionales..."
                value={vaccineForm.notas}
                onChange={(e) =>
                  setVaccineForm({ ...vaccineForm, notas: e.target.value })
                }
                className="vaccine-form-textarea"
                rows={4}
              />
            </div>

            {/* Save Button */}
            <div className="vaccine-form-button-section">
              <Button
                onClick={handleSaveVaccine}
                className="vaccine-form-save-button"
                disabled={
                  !vaccineForm.tipo ||
                  !vaccineForm.fecha
                }
              >
                Guardar
              </Button>
            </div>
          </div>

          {/* Success Modal */}
          {showSuccessModal && (
            <div className="vaccine-success-modal-overlay">
              <div className="vaccine-success-modal">
                <div className="vaccine-success-modal-image">
                  <Image src={logoEvento} alt="Perro" width={150} height={150} />
                </div>
                <h2 className="vaccine-success-modal-title">
                ¡Evento guardado!
                </h2>
                <p className="vaccine-success-modal-text">
                  Podés crear un evento para recordarte cuándo aplicar la próxima dosis.
                </p>
                <button
                  onClick={handleMasTarde}
                  className="vaccine-success-modal-button"
                >
                  Más tarde
                </button>
              </div>
            </div>
          )}
        </div>
      </MobileFrame>
    );
  }

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
            <div className="vaccines-add-menu-wrapper" ref={addMenuRef}>
              <button
                className="vaccines-add-button"
                aria-label="Agregar vacuna"
                onClick={() => setShowAddMenu(!showAddMenu)}
              >
                <Plus className="vaccines-add-icon" />
              </button>
              {showAddMenu && (
                <div className="vaccines-add-menu">
                  <button
                    className="vaccines-add-menu-item"
                    onClick={() => {
                      handleAddVaccine();
                      setShowAddMenu(false);
                    }}
                  >
                    <Calendar className="vaccines-add-menu-icon" />
                    <span>Registrar turno</span>
                  </button>
                  <button
                    className="vaccines-add-menu-item"
                    onClick={() => {
                      handleAddAppliedVaccine();
                      setShowAddMenu(false);
                    }}
                  >
                    <Info className="vaccines-add-menu-icon" />
                    <span>Registrar vacuna aplicada</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Information Banner */}
          <div className="vaccines-info-banner">
            <Info className="vaccines-info-icon" />
            <span className="vaccines-info-text">Información sobre vacunas</span>
          </div>
          {/* Line separator */}
        <div className="vaccines-header-line">
          <Image src={lineSvg} alt="Line separator" width={336} height={2} />
        </div>

          {/* Vaccines List by Year */}
          {sortedYears.length > 0 ? (
            sortedYears.map((year) => (
              <div key={year} className="vaccines-year-section">
                <h3 className="vaccines-year-title">{year}</h3>
                <div className="vaccines-list">
                  {vaccinesByYear[year].map((vaccine) => {
                    const pending = isPending(vaccine);
                    const displayDate = vaccine.fecha;
                    return (
                      <div
                        key={vaccine.id}
                        className={`vaccine-card ${pending ? "vaccine-card-pending" : vaccine.esAplicada ? "vaccine-card-applied" : "vaccine-card-completed"}`}
                        onClick={() => handleVaccineClick(vaccine)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="vaccine-card-content">
                          <h4 className="vaccine-card-title">
                            {getVaccineTypeName(vaccine.tipo)}
                          </h4>
                          <div className="vaccine-card-date">
                            <Calendar className="vaccine-card-calendar-icon" />
                            <span>{formatDate(displayDate)}</span>
                            {pending && (
                              <span className="vaccine-card-pending-label">
                                Turno pendiente
                              </span>
                            )}
                            {vaccine.esAplicada && !pending && (
                              <span className="vaccine-card-applied-label">
                                Aplicada
                              </span>
                            )}
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
                <p className="vaccines-empty-text">No tenés vacunas registradas</p>
              </div>
            </div>
          )}
        </div>

        {/* Vaccine Details Modal */}
        {selectedVaccine && (
          <div className="vaccine-details-modal-overlay" onClick={handleCloseVaccineDetails}>
            <div className="vaccine-details-modal" onClick={(e) => e.stopPropagation()}>
              <div className="vaccine-details-header">
                <h2 className="vaccine-details-title">
                  {getVaccineTypeName(selectedVaccine.tipo)}
                </h2>
                <div className="vaccine-details-header-buttons">
                  <button
                    onClick={() => handleDeleteVaccine(selectedVaccine.id)}
                    className="vaccine-details-delete-button"
                    aria-label="Eliminar turno"
                  >
                    <Trash2 className="vaccine-details-delete-icon" />
                  </button>
                  <button
                    onClick={handleCloseVaccineDetails}
                    className="vaccine-details-close-button"
                    aria-label="Cerrar"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="vaccine-details-content">
                <div className="vaccine-details-field">
                  <span className="vaccine-details-label">
                    {selectedVaccine.esAplicada ? "Fecha de aplicación" : "Fecha del turno"}
                  </span>
                  <span className="vaccine-details-value">{formatDate(selectedVaccine.fecha)}</span>
                </div>
                
                {selectedVaccine.horario && (
                  <div className="vaccine-details-field">
                    <span className="vaccine-details-label">Horario</span>
                    <span className="vaccine-details-value">{formatTime(selectedVaccine.horario)}</span>
                  </div>
                )}
                
                {selectedVaccine.veterinario && (
                  <div className="vaccine-details-field">
                    <span className="vaccine-details-label">Veterinario</span>
                    <span className="vaccine-details-value">{selectedVaccine.veterinario}</span>
                  </div>
                )}
                
                {selectedVaccine.notas && (
                  <div className="vaccine-details-field">
                    <span className="vaccine-details-label">Notas</span>
                    <span className="vaccine-details-value vaccine-details-notes">{selectedVaccine.notas}</span>
                  </div>
                )}
                
                {/* Mostrar próxima dosis si la vacuna fue aplicada o el turno ya pasó */}
                {selectedVaccine.proximaDosis && (selectedVaccine.esAplicada || !isPending(selectedVaccine)) && (
                  <div className="vaccine-details-field">
                    <span className="vaccine-details-label">Fecha sugerida para refuerzo</span>
                    <span className="vaccine-details-value">{formatDate(selectedVaccine.proximaDosis)}</span>
                  </div>
                )}
                
                {/* Mostrar si es una vacuna aplicada o un turno */}
                <div className="vaccine-details-field">
                  <span className="vaccine-details-label">Estado</span>
                  <span className="vaccine-details-value">
                    {selectedVaccine.esAplicada ? "Vacuna aplicada" : isPending(selectedVaccine) ? "Turno pendiente" : "Turno completado"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MobileFrame>
  );
}

