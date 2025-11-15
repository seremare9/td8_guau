"use client";

import { useState, useRef, useEffect } from "react";
import MobileFrame from "./mobile-frame";
import Image from "next/image";
import { ArrowLeft, ChevronDown, Plus, Info, Calendar, Trash2 } from "lucide-react";
import perro from "../images/perro.png";
import lupaIcon from "../images/lupa.svg";
import lineSvg from "../images/line.svg";
import higieneIcon from "../images/event-icons/higiene.svg";
import logoEvento from "../images/logo_evento.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import "../styles/vaccines-styles.css";

interface HigieneProps {
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

interface HigieneEvent {
  id: string;
  tipo: string;
  fecha: string;
  horario?: string;
  veterinario?: string;
  notas?: string;
  petName: string;
  esAplicada?: boolean;
}

export default function Higiene({
  userName = "User",
  petData,
  onBack,
  onUpdatePetData,
}: HigieneProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<HigieneEvent | null>(null);
  const [events, setEvents] = useState<HigieneEvent[]>([]);
  const [isEventApplied, setIsEventApplied] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const addMenuRef = useRef<HTMLDivElement>(null);
  const [eventForm, setEventForm] = useState({
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

  useEffect(() => {
    const loadEvents = () => {
      const eventsKey = `higiene_${pet.name}`;
      const eventsStr = localStorage.getItem(eventsKey);
      if (eventsStr) {
        try {
          const eventsData = JSON.parse(eventsStr);
          setEvents(eventsData);
        } catch (e) {
          console.error("Error al parsear eventos:", e);
          setEvents([]);
        }
      } else {
        setEvents([]);
      }
    };
    
    loadEvents();
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

  const handleAddEvent = () => {
    setShowAddEvent(true);
    setIsEventApplied(false);
  };

  const handleAddAppliedEvent = () => {
    setShowAddEvent(true);
    setIsEventApplied(true);
  };

  const handleBackFromAddEvent = () => {
    setShowAddEvent(false);
    setIsEventApplied(false);
    setEventForm({
      tipo: "",
      fecha: "",
      horario: "",
      veterinario: "",
      notas: "",
    });
  };

  const handleSaveEvent = () => {
    const newEvent: HigieneEvent = {
      id: Date.now().toString(),
      tipo: eventForm.tipo,
      fecha: eventForm.fecha,
      horario: isEventApplied ? undefined : (eventForm.horario || undefined),
      veterinario: eventForm.veterinario || undefined,
      notas: eventForm.notas || undefined,
      petName: pet.name,
      esAplicada: isEventApplied,
    };

    const eventsKey = `higiene_${pet.name}`;
    const existingEvents = events.length > 0 ? events : [];
    const updatedEvents = [...existingEvents, newEvent];
    localStorage.setItem(eventsKey, JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
    
    // Notificar a otros componentes del cambio
    window.dispatchEvent(new Event("customStorageChange"));

    if (!isEventApplied) {
      setShowSuccessModal(true);
    } else {
      handleBackFromAddEvent();
    }
  };

  const handleMasTarde = () => {
    setShowSuccessModal(false);
    handleBackFromAddEvent();
  };

  const handleEventClick = (event: HigieneEvent) => {
    setSelectedEvent(event);
  };

  const handleCloseEventDetails = () => {
    setSelectedEvent(null);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (window.confirm("¿Estás seguro de que querés eliminar este evento?")) {
      const updatedEvents = events.filter((e) => e.id !== eventId);
      setEvents(updatedEvents);
      
      const eventsKey = `higiene_${pet.name}`;
      localStorage.setItem(eventsKey, JSON.stringify(updatedEvents));
      
      // Notificar a otros componentes del cambio
      window.dispatchEvent(new Event("customStorageChange"));
      
      setSelectedEvent(null);
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

  const formatTime = (timeString: string): string => {
    if (!timeString) return "";
    return timeString;
  };

  const getYear = (dateString: string): number => {
    if (!dateString) return new Date().getFullYear();
    const date = new Date(dateString + "T00:00:00");
    return date.getFullYear();
  };

  const isPending = (event: HigieneEvent): boolean => {
    if (event.esAplicada) return false;
    if (!event.fecha) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(event.fecha + "T00:00:00");
    return eventDate >= today;
  };

  const filteredEvents = events.filter((event) => {
    if (!searchQuery) return true;
    return event.tipo.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const eventsByYear = filteredEvents.reduce((acc, event) => {
    const year = getYear(event.fecha);
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(event);
    return acc;
  }, {} as { [year: number]: HigieneEvent[] });

  const sortedYears = Object.keys(eventsByYear)
    .map(Number)
    .sort((a, b) => b - a);

  sortedYears.forEach((year) => {
    eventsByYear[year].sort((a, b) => {
      const dateA = new Date(a.fecha + "T00:00:00");
      const dateB = new Date(b.fecha + "T00:00:00");
      return dateB.getTime() - dateA.getTime();
    });
  });

  if (showAddEvent) {
    return (
      <MobileFrame>
        <div className="vaccines-container">
          <div className="vaccines-header">
            <div className="vaccines-header-left">
              <button
                onClick={handleBackFromAddEvent}
                className="vaccines-back-button"
                aria-label="Volver"
              >
                <ArrowLeft className="vaccines-back-icon" />
              </button>
              <h1 className="vaccines-title">
                {isEventApplied ? "Registrar evento aplicado" : "Registrar turno"}
              </h1>
            </div>
          </div>

          <div className="vaccines-header-line">
            <Image src={lineSvg} alt="Line separator" width={336} height={2} />
          </div>

          <div className="vaccine-form-icon-wrapper">
            <Image src={higieneIcon} alt="Higiene" width={84} height={84} />
          </div>

          <div className="vaccine-form-container">
            <div className="vaccine-form-field">
              <label className="vaccine-form-label">Tipo de higiene</label>
              <Input
                type="text"
                placeholder="Ej: Baño, Corte de uñas, etc."
                value={eventForm.tipo}
                onChange={(e) =>
                  setEventForm({ ...eventForm, tipo: e.target.value })
                }
                className="vaccine-form-input"
              />
            </div>

            <div className="vaccine-form-field">
              <label className="vaccine-form-label">
                {isEventApplied ? "Fecha del evento" : "Fecha y horario del turno"}
              </label>
              <div className="vaccine-form-datetime-container">
                <Input
                  type="date"
                  value={eventForm.fecha}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, fecha: e.target.value })
                  }
                  className="vaccine-form-datetime-input"
                />
                {!isEventApplied && (
                  <Input
                    type="time"
                    value={eventForm.horario}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, horario: e.target.value })
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
                value={eventForm.veterinario}
                onChange={(e) =>
                  setEventForm({ ...eventForm, veterinario: e.target.value })
                }
                className="vaccine-form-input"
              />
            </div>

            <div className="vaccine-form-field">
              <label className="vaccine-form-label">Notas (opcional)</label>
              <textarea
                placeholder="Agregar notas adicionales..."
                value={eventForm.notas}
                onChange={(e) =>
                  setEventForm({ ...eventForm, notas: e.target.value })
                }
                className="vaccine-form-textarea"
                rows={4}
              />
            </div>

            <div className="vaccine-form-button-section">
              <Button
                onClick={handleSaveEvent}
                className="vaccine-form-save-button"
                disabled={
                  !eventForm.tipo ||
                  !eventForm.fecha
                }
              >
                Guardar
              </Button>
            </div>
          </div>

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
                  Podés crear un evento para recordarte cuándo realizar el próximo evento.
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
        <div className="vaccines-header">
          <div className="vaccines-header-left">
            <button onClick={onBack} className="vaccines-back-button" aria-label="Volver">
              <ArrowLeft className="vaccines-back-icon" />
            </button>
            <h1 className="vaccines-title">Higiene</h1>
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
                placeholder="Buscar por tipo"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="vaccines-add-menu-wrapper" ref={addMenuRef}>
              <button
                className="vaccines-add-button"
                aria-label="Agregar evento"
                onClick={() => setShowAddMenu(!showAddMenu)}
              >
                <Plus className="vaccines-add-icon" />
              </button>
              {showAddMenu && (
                <div className="vaccines-add-menu">
                  <button
                    className="vaccines-add-menu-item"
                    onClick={() => {
                      handleAddEvent();
                      setShowAddMenu(false);
                    }}
                  >
                    <Calendar className="vaccines-add-menu-icon" />
                    <span>Registrar turno</span>
                  </button>
                  <button
                    className="vaccines-add-menu-item"
                    onClick={() => {
                      handleAddAppliedEvent();
                      setShowAddMenu(false);
                    }}
                  >
                    <Info className="vaccines-add-menu-icon" />
                    <span>Registrar evento aplicado</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="vaccines-info-banner">
            <Info className="vaccines-info-icon" />
            <span className="vaccines-info-text">Información sobre higiene</span>
          </div>
          <div className="vaccines-header-line">
            <Image src={lineSvg} alt="Line separator" width={336} height={2} />
          </div>

          {sortedYears.length > 0 ? (
            sortedYears.map((year) => (
              <div key={year} className="vaccines-year-section">
                <h3 className="vaccines-year-title">{year}</h3>
                <div className="vaccines-list">
                  {eventsByYear[year].map((event) => {
                    const pending = isPending(event);
                    return (
                      <div
                        key={event.id}
                        className={`vaccine-card ${pending ? "vaccine-card-pending" : event.esAplicada ? "vaccine-card-applied" : "vaccine-card-completed"}`}
                        onClick={() => handleEventClick(event)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="vaccine-card-content">
                          <h4 className="vaccine-card-title">
                            {event.tipo}
                          </h4>
                          <div className="vaccine-card-date">
                            <Calendar className="vaccine-card-calendar-icon" />
                            <span>{formatDate(event.fecha)}</span>
                            {pending && (
                              <span className="vaccine-card-pending-label">
                                Turno pendiente
                              </span>
                            )}
                            {event.esAplicada && !pending && (
                              <span className="vaccine-card-applied-label">
                                Aplicado
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
                <p className="vaccines-empty-text">No tenés eventos registrados</p>
              </div>
            </div>
          )}
        </div>

        {selectedEvent && (
          <div className="vaccine-details-modal-overlay" onClick={handleCloseEventDetails}>
            <div className="vaccine-details-modal" onClick={(e) => e.stopPropagation()}>
              <div className="vaccine-details-header">
                <h2 className="vaccine-details-title">
                  {selectedEvent.tipo}
                </h2>
                <div className="vaccine-details-header-buttons">
                  <button
                    onClick={() => handleDeleteEvent(selectedEvent.id)}
                    className="vaccine-details-delete-button"
                    aria-label="Eliminar evento"
                  >
                    <Trash2 className="vaccine-details-delete-icon" />
                  </button>
                  <button
                    onClick={handleCloseEventDetails}
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
                    {selectedEvent.esAplicada ? "Fecha del evento" : "Fecha del turno"}
                  </span>
                  <span className="vaccine-details-value">{formatDate(selectedEvent.fecha)}</span>
                </div>
                
                {selectedEvent.horario && (
                  <div className="vaccine-details-field">
                    <span className="vaccine-details-label">Horario</span>
                    <span className="vaccine-details-value">{formatTime(selectedEvent.horario)}</span>
                  </div>
                )}
                
                {selectedEvent.veterinario && (
                  <div className="vaccine-details-field">
                    <span className="vaccine-details-label">Veterinario</span>
                    <span className="vaccine-details-value">{selectedEvent.veterinario}</span>
                  </div>
                )}
                
                {selectedEvent.notas && (
                  <div className="vaccine-details-field">
                    <span className="vaccine-details-label">Notas</span>
                    <span className="vaccine-details-value vaccine-details-notes">{selectedEvent.notas}</span>
                  </div>
                )}
                
                <div className="vaccine-details-field">
                  <span className="vaccine-details-label">Estado</span>
                  <span className="vaccine-details-value">
                    {selectedEvent.esAplicada ? "Evento aplicado" : isPending(selectedEvent) ? "Turno pendiente" : "Turno completado"}
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

