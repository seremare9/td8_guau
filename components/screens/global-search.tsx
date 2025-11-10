"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, X, Calendar, Scale } from "lucide-react";
import perro from "../images/perro.png";
import vacunaIcon from "../images/event-icons/vacuna.svg";
import higieneIcon from "../images/event-icons/higiene.svg";
import medicinaIcon from "../images/event-icons/medicina.svg";
import antiparasitarioIcon from "../images/event-icons/antiparasitario.svg";
import veterinarioIcon from "../images/event-icons/veterinario.svg";
import otroIcon from "../images/event-icons/otro.svg";
import "../styles/global-search-styles.css";

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToPet?: (petData: {
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
  onNavigateToEvent?: (eventType: string, petName: string) => void;
}

interface SearchResult {
  type: "pet" | "event";
  id: string;
  title: string;
  subtitle?: string;
  petName: string;
  eventType?: string;
  date?: string;
  icon?: string;
}

export default function GlobalSearch({
  isOpen,
  onClose,
  onNavigateToPet,
  onNavigateToEvent,
}: GlobalSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setResults([]);
      return;
    }

    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const searchResults: SearchResult[] = [];

    // Buscar mascotas
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("pet_data_")) {
        const petDataStr = localStorage.getItem(key);
        if (petDataStr) {
          try {
            const petData = JSON.parse(petDataStr);
            const petName = petData.name?.toLowerCase() || "";
            const breed = petData.breed?.toLowerCase() || "";
            
            if (petName.includes(query) || breed.includes(query)) {
              searchResults.push({
                type: "pet",
                id: `pet_${petData.name}`,
                title: petData.name,
                subtitle: petData.breed,
                petName: petData.name,
              });
            }
          } catch (e) {
            console.error("Error al parsear datos de mascota:", e);
          }
        }
      }
    }

    // Buscar eventos de todas las categorías
    const eventTypes = [
      { key: "vaccines", name: "Vacunas", icon: vacunaIcon },
      { key: "higiene", name: "Higiene", icon: higieneIcon },
      { key: "medicina", name: "Medicina", icon: medicinaIcon },
      { key: "antiparasitario", name: "Antiparasitario", icon: antiparasitarioIcon },
      { key: "veterinario", name: "Visita al veterinario", icon: veterinarioIcon },
      { key: "otro", name: "Otro", icon: otroIcon },
      { key: "peso", name: "Peso", icon: "" },
    ];

    // Buscar eventos de todas las categorías
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        // Buscar eventos con formato: tipo_petName (ej: vaccines_Maxi, higiene_Maxi)
        for (const eventTypeInfo of eventTypes) {
          if (key.startsWith(`${eventTypeInfo.key}_`)) {
            const petName = key.replace(`${eventTypeInfo.key}_`, "");
            const eventsStr = localStorage.getItem(key);
            if (eventsStr) {
              try {
                const events = JSON.parse(eventsStr);
                if (Array.isArray(events)) {
                  events.forEach((event: any) => {
                    const eventText = (event.tipo || event.peso || "").toLowerCase();
                    const notas = (event.notas || "").toLowerCase();
                    const veterinario = (event.veterinario || "").toLowerCase();
                    
                    if (
                      eventText.includes(query) ||
                      notas.includes(query) ||
                      veterinario.includes(query) ||
                      petName.toLowerCase().includes(query)
                    ) {
                      const displayTitle = event.tipo || (event.peso ? `${event.peso} kg` : "Evento");
                      searchResults.push({
                        type: "event",
                        id: `event_${event.id || Date.now()}_${Math.random()}`,
                        title: displayTitle,
                        subtitle: `${eventTypeInfo.name} - ${petName}`,
                        petName: petName,
                        eventType: eventTypeInfo.key,
                        date: event.fecha,
                        icon: eventTypeInfo.icon,
                      });
                    }
                  });
                }
              } catch (e) {
                console.error("Error al parsear eventos:", e);
              }
            }
          }
        }
      }
    }

    // Ordenar resultados: mascotas primero, luego eventos
    searchResults.sort((a, b) => {
      if (a.type === "pet" && b.type === "event") return -1;
      if (a.type === "event" && b.type === "pet") return 1;
      return a.title.localeCompare(b.title);
    });

    setResults(searchResults);
  }, [searchQuery, isOpen]);

  const handleResultClick = (result: SearchResult) => {
    if (result.type === "pet") {
      // Buscar los datos completos de la mascota
      const petDataKey = `pet_data_${result.petName}`;
      const petDataStr = localStorage.getItem(petDataKey);
      if (petDataStr) {
        try {
          const petData = JSON.parse(petDataStr);
          if (onNavigateToPet) {
            onNavigateToPet(petData);
          }
        } catch (e) {
          console.error("Error al parsear datos de mascota:", e);
        }
      }
    } else if (result.type === "event" && result.eventType) {
      if (onNavigateToEvent) {
        onNavigateToEvent(result.eventType, result.petName);
      }
    }
    onClose();
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString + "T00:00:00");
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  if (!isOpen) return null;

  return (
    <div className="global-search-overlay" onClick={onClose}>
      <div className="global-search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="global-search-header">
          <div className="global-search-input-container">
            <Search className="global-search-icon" />
            <input
              type="text"
              className="global-search-input"
              placeholder="Buscar en toda la app..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button
                className="global-search-clear"
                onClick={() => setSearchQuery("")}
                aria-label="Limpiar búsqueda"
              >
                <X className="global-search-clear-icon" />
              </button>
            )}
          </div>
          <button
            className="global-search-close"
            onClick={onClose}
            aria-label="Cerrar búsqueda"
          >
            <X className="global-search-close-icon" />
          </button>
        </div>

        <div className="global-search-results">
          {searchQuery.trim() && results.length === 0 ? (
            <div className="global-search-empty">
              <p className="global-search-empty-text">No se encontraron resultados</p>
            </div>
          ) : searchQuery.trim() && results.length > 0 ? (
            <div className="global-search-results-list">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="global-search-result-item"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="global-search-result-icon">
                    {result.type === "pet" ? (
                      <div className="global-search-result-pet-image">
                        {result.petName && (() => {
                          const petDataKey = `pet_data_${result.petName}`;
                          const petDataStr = localStorage.getItem(petDataKey);
                          if (petDataStr) {
                            try {
                              const petData = JSON.parse(petDataStr);
                              if (petData.imageURL && typeof petData.imageURL === 'string' && petData.imageURL.startsWith('data:')) {
                                return (
                                  <img
                                    src={petData.imageURL}
                                    alt={result.title}
                                    width={40}
                                    height={40}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                                  />
                                );
                              }
                            } catch (e) {
                              // Ignorar errores
                            }
                          }
                          return (
                            <Image
                              src={perro}
                              alt={result.title}
                              width={40}
                              height={40}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                            />
                          );
                        })()}
                      </div>
                    ) : result.eventType === "peso" ? (
                      <Scale className="global-search-result-event-icon" />
                    ) : result.icon ? (
                      <Image
                        src={result.icon}
                        alt={result.title}
                        width={40}
                        height={40}
                      />
                    ) : (
                      <Calendar className="global-search-result-event-icon" />
                    )}
                  </div>
                  <div className="global-search-result-content">
                    <h3 className="global-search-result-title">{result.title}</h3>
                    {result.subtitle && (
                      <p className="global-search-result-subtitle">{result.subtitle}</p>
                    )}
                    {result.date && (
                      <p className="global-search-result-date">{formatDate(result.date)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="global-search-empty">
              <p className="global-search-empty-text">Escribí para buscar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

