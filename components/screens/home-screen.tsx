"use client";

import { useState, useEffect, useRef } from "react";
import MobileFrame from "./mobile-frame";
// 1. Importar StaticImageData
import Image, { StaticImageData } from "next/image";
import imgIcon from "../images/img-icon.svg";
import perro from "../images/perro.png";
import logoGuau from "../images/logo_guau.png";
import petCardSvg from "../images/pet-card.svg";
import stockImage1 from "../images/stock-images/dog-img1.jpg";
import stockImage2 from "../images/stock-images/dog-img2.jpeg";
import stockImage3 from "../images/stock-images/dog-img3.jpeg";
import lineSvg from "../images/line.svg";
import lupaSvg from "../images/lupa.svg";
import campanaSvg from "../images/campana.svg";
import menuSvg from "../images/menu.svg";
import dividerSvg from "../images/divider.svg";
import elipsesSvg from "../images/elipses.svg";
import vacunaIcon from "../images/event-icons/vacuna.svg";
import medicinaIcon from "../images/event-icons/medicina.svg";
import veterinarioIcon from "../images/event-icons/veterinario.svg";
import otroIcon from "../images/event-icons/otro.svg";
import higieneIcon from "../images/event-icons/higiene.svg";
import antiparasitarioIcon from "../images/event-icons/antiparasitario.svg";
import "../styles/home-screen-styles.css";

// Esta interfaz ya estaba correcta en tu archivo
interface HomeEvent {
  id: string;
  tipo: string;
  fecha: string;
  horario?: string;
  petName: string;
  eventType: string;
}

interface HomeHeaderProps {
  userName: string;
  onOpenMenu?: () => void;
  onBack?: () => void;
}

export const HomeHeader = ({
  userName,
  onOpenMenu,
  onBack,
  onOpenSearch,
}: HomeHeaderProps) => {
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    const loadNotifications = () => {
      const notificationsKey = "notifications";
      const notificationsStr = localStorage.getItem(notificationsKey);
      if (notificationsStr) {
        try {
          const notifications = JSON.parse(notificationsStr);
          const unread = notifications.filter((n: any) => !n.read).length;
          setUnreadNotifications(unread);
        } catch (e) {
          console.error("Error al parsear notificaciones:", e);
        }
      }
    };

    loadNotifications();
    const interval = setInterval(loadNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="home-header">
        <div className="home-header-left">
          <div className="home-logo-container">
            <Image
              src={logoGuau}
              alt="logo guau"
              width={40}
              height={40}
              className="home-logo-image"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "0.75rem",
              }}
            />
          </div>
          <div className="home-greeting">
            <span className="home-greeting-text">Hola, </span>
            <span className="home-greeting-name">{userName}</span>
          </div>
        </div>
        <div className="home-header-icons">
          <button
            onClick={onOpenSearch}
            className="home-icon-button"
            aria-label="Buscar"
            disabled={!onOpenSearch}
          >
            <Image
              src={lupaSvg}
              alt="Buscar"
              width={20}
              height={20}
              className="home-icon"
            />
          </button>
          <Image
            src={dividerSvg}
            alt=""
            width={1}
            height={20}
            className="home-icon-divider"
          />
          <div className="home-notification-wrapper">
            <Image
              src={campanaSvg}
              alt="Notificaciones"
              width={20}
              height={20}
              className="home-icon"
            />
            {unreadNotifications > 0 && (
              <span className="home-notification-badge">
                {unreadNotifications}
              </span>
            )}
          </div>
          <Image
            src={dividerSvg}
            alt=""
            width={1}
            height={20}
            className="home-icon-divider"
          />
          <button
            onClick={onOpenMenu}
            className="home-icon-button"
            aria-label="Abrir menú"
            disabled={!onOpenMenu}
          >
            <Image
              src={menuSvg}
              alt="Menú"
              width={20}
              height={20}
              className="home-icon"
            />
          </button>
        </div>
      </div>

      {/* Line separator */}
      <div className="home-header-line">
        <Image src={lineSvg} alt="Line separator" width={336} height={2} />
      </div>
    </>
  );
}; // <- SE AGREGÓ ESTA LLAVE DE CIERRE

interface HomeScreenProps {
  userName?: string;
  onOpenMenu?: () => void;
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
}

export default function HomeScreen({
  userName = "User",
  onOpenMenu,
  petData,
  onOpenPetProfile,
  onOpenCalendar,
  onOpenSearch,
}: HomeScreenProps) {
  const [allPets, setAllPets] = useState<
    Array<{
      id: number;
      name: string;
      breed: string;
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

  const [events, setEvents] = useState<HomeEvent[]>([]);

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
      const allPetsArray = Array.from(petsMap.values()).map((pet, index) => ({
        id: index + 1,
        name: pet.name,
        breed: pet.breed || "Sin raza especificada",
        image: pet.imageURL || perro,
        fullData: pet,
      }));

      // Si no hay mascotas, agregar la actual como default
      if (allPetsArray.length === 0 && petData) {
        allPetsArray.push({
          id: 1,
          name: petData.name || "Maxi",
          breed: petData.breed || "Border Collie",
          image: petData.imageURL || perro,
          fullData: petData,
        });
      }

      setAllPets(allPetsArray);
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

  // Estado para rastrear qué mascota está visible
  const [activePetIndex, setActivePetIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0); // 0 = completamente en una card, 1 = completamente en la siguiente
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Usar todas las mascotas para el swipe
  const pets = allPets.length > 0 ? allPets : [
    {
      id: 1,
      name: "Maxi",
      breed: "Border Collie",
      image: perro,
      fullData: undefined,
    },
  ];

  // Efecto para actualizar el índice activo cuando cambia el scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || pets.length === 0) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      // Cada card ocupa aproximadamente el ancho del contenedor (con gap)
      const cardWidth = containerWidth;
      const gap = 12; // 0.75rem = 12px
      const totalCardWidth = cardWidth + gap;
      
      // Calcular el índice basado en la posición de scroll
      const exactIndex = scrollLeft / totalCardWidth;
      let newIndex = Math.round(exactIndex);
      
      // Asegurar que el índice esté dentro del rango válido
      newIndex = Math.max(0, Math.min(newIndex, pets.length - 1));
      
      // Calcular el progreso del scroll entre cards (0 = en una card, 1 = en la siguiente)
      const progress = Math.abs(exactIndex - newIndex) * 2; // Multiplicar por 2 para que llegue a 1 más rápido
      const clampedProgress = Math.min(1, progress);
      
      setScrollProgress(clampedProgress);
      
      if (newIndex !== activePetIndex) {
        setActivePetIndex(newIndex);
      }
    };

    container.addEventListener('scroll', handleScroll);
    // Inicializar el índice activo al cargar
    handleScroll();
    
    return () => container.removeEventListener('scroll', handleScroll);
  }, [pets.length, activePetIndex]);

  // Cargar eventos de salud - de la mascota visible actualmente
  useEffect(() => {
    const loadEvents = () => {
      const allEvents: HomeEvent[] = [];

      // Obtener la mascota que está visible actualmente
      const activePet = pets[activePetIndex];
      
      if (activePet && activePet.fullData) {
        const pet = { name: activePet.fullData.name };
        
        // Cargar vacunas
        const vaccinesKey = `vaccines_${pet.name}`;
        const vaccinesStr = localStorage.getItem(vaccinesKey);
        if (vaccinesStr) {
          try {
            const vaccines = JSON.parse(vaccinesStr);
            vaccines.forEach((vaccine: any) => {
              allEvents.push({
                id: vaccine.id,
                tipo: vaccine.tipo,
                fecha: vaccine.fecha,
                horario: vaccine.horario,
                petName: pet.name,
                eventType: "vacuna",
              });
            });
          } catch (e) {
            console.error("Error al parsear vacunas:", e);
          }
        }

        // Cargar higiene
        const higieneKey = `higiene_${pet.name}`;
        const higieneStr = localStorage.getItem(higieneKey);
        if (higieneStr) {
          try {
            const higieneEvents = JSON.parse(higieneStr);
            higieneEvents.forEach((event: any) => {
              allEvents.push({
                id: event.id,
                tipo: event.tipo,
                fecha: event.fecha,
                horario: event.horario,
                petName: pet.name,
                eventType: "higiene",
              });
            });
          } catch (e) {
            console.error("Error al parsear higiene:", e);
          }
        }

        // Cargar medicina
        const medicinaKey = `medicina_${pet.name}`;
        const medicinaStr = localStorage.getItem(medicinaKey);
        if (medicinaStr) {
          try {
            const medicinaEvents = JSON.parse(medicinaStr);
            medicinaEvents.forEach((event: any) => {
              allEvents.push({
                id: event.id,
                tipo: event.tipo,
                fecha: event.fecha,
                horario: event.horario,
                petName: pet.name,
                eventType: "medicina",
              });
            });
          } catch (e) {
            console.error("Error al parsear medicina:", e);
          }
        }

        // Cargar antiparasitario
        const antiparasitarioKey = `antiparasitario_${pet.name}`;
        const antiparasitarioStr = localStorage.getItem(antiparasitarioKey);
        if (antiparasitarioStr) {
          try {
            const antiparasitarioEvents = JSON.parse(antiparasitarioStr);
            antiparasitarioEvents.forEach((event: any) => {
              allEvents.push({
                id: event.id,
                tipo: event.tipo,
                fecha: event.fecha,
                horario: event.horario,
                petName: pet.name,
                eventType: "antiparasitario",
              });
            });
          } catch (e) {
            console.error("Error al parsear antiparasitario:", e);
          }
        }

        // Cargar veterinario
        const veterinarioKey = `veterinario_${pet.name}`;
        const veterinarioStr = localStorage.getItem(veterinarioKey);
        if (veterinarioStr) {
          try {
            const veterinarioEvents = JSON.parse(veterinarioStr);
            veterinarioEvents.forEach((event: any) => {
              allEvents.push({
                id: event.id,
                tipo: event.tipo,
                fecha: event.fecha,
                horario: event.horario,
                petName: pet.name,
                eventType: "veterinario",
              });
            });
          } catch (e) {
            console.error("Error al parsear veterinario:", e);
          }
        }

        // Cargar otro
        const otroKey = `otro_${pet.name}`;
        const otroStr = localStorage.getItem(otroKey);
        if (otroStr) {
          try {
            const otroEvents = JSON.parse(otroStr);
            otroEvents.forEach((event: any) => {
              allEvents.push({
                id: event.id,
                tipo: event.tipo,
                fecha: event.fecha,
                horario: event.horario,
                petName: pet.name,
                eventType: "otro",
              });
            });
          } catch (e) {
            console.error("Error al parsear otro:", e);
          }
        }

        // Cargar otros eventos generales
        const eventsKey = `events_${pet.name}`;
        const eventsStr = localStorage.getItem(eventsKey);
        if (eventsStr) {
          try {
            const petEvents = JSON.parse(eventsStr);
            petEvents.forEach((event: any) => {
              allEvents.push({
                id: event.id,
                tipo: event.tipo,
                fecha: event.fecha,
                horario: event.horario,
                petName: pet.name,
                eventType: event.eventType || "otro",
              });
            });
          } catch (e) {
            console.error("Error al parsear eventos:", e);
          }
        }
      }

      // Filtrar solo eventos futuros y ordenar
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const upcomingEvents = allEvents
        .filter((event) => {
          const eventDate = new Date(
            event.fecha + (event.horario ? `T${event.horario}` : "T00:00")
          );
          return eventDate >= today;
        })
        .sort((a, b) => {
          const dateA = new Date(
            a.fecha + (a.horario ? `T${a.horario}` : "T00:00")
          );
          const dateB = new Date(
            b.fecha + (b.horario ? `T${b.horario}` : "T00:00")
          );
          return dateA.getTime() - dateB.getTime();
        });

      setEvents(upcomingEvents);
    };

    loadEvents();

    // Recargar eventos periódicamente
    const interval = setInterval(loadEvents, 5000);
    return () => clearInterval(interval);
  }, [activePetIndex, pets]);

  const [usefulInfo] = useState([
    {
      id: 1,
      title: "Cuidados básicos",
      subtitle: "Click para leer",
      image: stockImage1,
    },
    {
      id: 2,
      title: "Juguetes ideales para cachorros",
      subtitle: "Click para leer",
      image: stockImage2,
    },
    {
      id: 3,
      title: "Tips para la hora del paseo",
      subtitle: "Click para leer",
      image: stockImage3,
    },
  ]);

  return (
    <MobileFrame>
      <div className="home-container">
        <HomeHeader userName={userName} onOpenMenu={onOpenMenu} onOpenSearch={onOpenSearch} />

        <div className="home-section">
          <div className="home-section-header">
            <h2 className="home-section-title">Mis mascotas</h2>
            <div className="home-section-badge">
              <span>{allPets.length}</span>
            </div>
          </div>
          <div className="home-pets-container">
            <div className="home-pets-scroll-container" ref={scrollContainerRef}>
              {pets.map((pet, index) => {
                // Calcular opacidad y z-index basada en la distancia del índice activo y el progreso del scroll
                const distance = index - activePetIndex;
                let opacity = 1;
                let zIndex = 1;
                let scale = 1;
                let isBehind = false;
                
                // Colores según el índice de la mascota
                const petColors = ["#EE7232", "#F3B38F", "#FFC542"];
                const petColorIndex = index % petColors.length;
                const petColor = petColors[petColorIndex];
                
                if (distance === 0) {
                  // Card activa: opacidad completa, z-index alto
                  opacity = 1;
                  zIndex = 10;
                  scale = 1;
                } else if (distance === 1) {
                  // Card siguiente (derecha): se asoma parcialmente
                  opacity = 1;
                  zIndex = 5;
                  scale = 1;
                  isBehind = false;
                } else if (distance === -1) {
                  // Card anterior (izquierda): oculta o muy atenuada
                  opacity = 0.3;
                  zIndex = 1;
                  scale = 1;
                  isBehind = true;
                } else {
                  // Cards más lejanas: ocultas
                  opacity = 0;
                  zIndex = 0;
                  scale = 1;
                  isBehind = true;
                }
                
                return (
                <div
                  key={pet.id}
                  className="home-pet-card"
                  style={{ 
                    backgroundColor: petColor,
                    opacity: opacity,
                    zIndex: zIndex,
                    cursor: onOpenPetProfile ? "pointer" : "default"
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    if (onOpenPetProfile && pet.fullData) {
                      onOpenPetProfile(pet.fullData);
                    } else if (onOpenPetProfile) {
                      onOpenPetProfile();
                    }
                  }}
                >
                  <div className="home-pet-card-content">
                    <div className="home-pet-info">
                      <h3 className="home-pet-name">{pet.name}</h3>
                      <p className="home-pet-breed">{pet.breed}</p>
                    </div>
                    <div className="home-pet-image-wrapper">
                      <div className="home-pet-image-circle">
                        {typeof pet.image === "string" &&
                        pet.image.startsWith("data:") ? (
                          <img
                            src={pet.image}
                            alt={pet.name}
                            width={120}
                            height={120}
                            className="home-pet-image"
                          />
                        ) : (
                          <Image
                            src={pet.image}
                            alt={pet.name}
                            width={120}
                            height={120}
                            className="home-pet-image"
                          />
                        )}
                      </div>
                    </div>
                    <div className="home-pet-image-elipses">
                      <Image
                        src={elipsesSvg}
                        alt=""
                        width={120}
                        height={120}
                        className="home-elipses-image"
                      />
                    </div>
                  </div>
                  <div className="home-pet-pattern"></div>
                </div>
                );
              })}
            </div>
            <div className="home-pagination">
              {pets.map((_, index) => (
                <div
                  key={index}
                  className={`home-pagination-dot ${
                    index === activePetIndex ? "active" : ""
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Próximos eventos */}
        <div className="home-section">
          <div className="home-section-header">
            <h2 className="home-section-title">Próximos eventos</h2>
            <div className="home-section-badge">
              <span>{events.length}</span>
            </div>
          </div>
          {events.length === 0 ? (
            <div className="home-empty-card">
              <p className="home-empty-text">No tenés eventos registrados</p>
            </div>
          ) : (
            <div className="home-events-container">
              {events.slice(0, 2).map((event) => {
                const eventDate = new Date(
                  event.fecha + (event.horario ? `T${event.horario}` : "T00:00")
                );
                const formatDate = (date: Date): string => {
                  const day = date.getDate().toString().padStart(2, "0");
                  const month = (date.getMonth() + 1)
                    .toString()
                    .padStart(2, "0");
                  const year = date.getFullYear();
                  return `${day}/${month}/${year}`;
                };

                const getEventColor = (eventType: string): string => {
                  const colors: { [key: string]: string } = {
                    vacuna: "#10B981",
                    medicina: "#EC4899",
                    veterinario: "#F59E0B",
                    antiparasitario: "#A855F7",
                    higiene: "#3B82F6",
                    otro: "#6B7280",
                  };
                  return colors[eventType] || "#6B7280";
                };

                const getEventIcon = (eventType: string) => {
                  switch (eventType) {
                    case "vacuna":
                      return vacunaIcon;
                    case "medicina":
                      return medicinaIcon;
                    case "veterinario":
                      return veterinarioIcon;
                    case "higiene":
                      return higieneIcon;
                    case "antiparasitario":
                      return antiparasitarioIcon;
                    default:
                      return otroIcon;
                  }
                };

                // Esta función ya estaba correcta en tu archivo
                const getEventTypeName = (event: HomeEvent): string => {
                  if (event.eventType === "vacuna") {
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
                    return typeMap[event.tipo] || event.tipo;
                  }
                  return event.tipo;
                };

                // 2. Obtener la imagen de la mascota visible actualmente
                const getPetImage = (
                  petName: string
                ): string | StaticImageData => {
                  const activePet = pets[activePetIndex];
                  if (activePet && activePet.fullData && activePet.fullData.name === petName) {
                    return activePet.fullData.imageURL || perro;
                  }
                  // Buscar en todas las mascotas
                  const pet = pets.find(p => p.fullData && p.fullData.name === petName);
                  if (pet && pet.fullData) {
                    return pet.fullData.imageURL || perro;
                  }
                  return perro;
                };

                const petImage = getPetImage(event.petName);

                return (
                  <div 
                    key={event.id} 
                      className="home-event-card"
                      onClick={() => {
                        if (onOpenCalendar) {
                          onOpenCalendar();
                        }
                      }}
                      style={{ cursor: onOpenCalendar ? "pointer" : "default" }}
                    >
                    <div className="home-event-icon">
                      <Image
                        src={getEventIcon(event.eventType)}
                        alt={event.eventType}
                        width={60}
                        height={60}
                      />
                    </div>
                    <div className="home-event-info">
                      <h4 className="home-event-title">
                        {getEventTypeName(event)}
                      </h4>
                      <p className="home-event-date">
                        {formatDate(eventDate)}
                        {event.horario && ` - ${event.horario}hs`}
                      </p>
                    </div>
                    <div className="home-event-pet">
                      {typeof petImage === "string" &&
                      petImage.startsWith("data:") ? (
                        <img
                          src={petImage}
                          alt={event.petName}
                          width={40}
                          height={40}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "50%",
                          }}
                        />
                      ) : (
                        <Image
                          src={petImage}
                          alt={event.petName}
                          width={40}
                          height={40}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "50%",
                          }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
              {events.length > 2 && (
                <button
                  className="home-ver-todos-button"
                  onClick={() => {
                    if (onOpenCalendar) {
                      onOpenCalendar();
                    }
                  }}
                >
                  Ver todos
                </button>
              )}
            </div>
          )}
        </div>

        {/* Información útil */}
        <div className="home-section">
          <div className="home-section-header">
            <h2 className="home-section-title">Información útil</h2>
          </div>
          <div className="home-info-container">
            {usefulInfo.map((info) => (
              <div key={info.id} className="home-info-card">
                <div className="home-info-image-wrapper">
                  <Image
                    src={info.image}
                    alt={info.title}
                    width={60}
                    height={60}
                    className="home-info-image"
                  />
                </div>
                <div className="home-info-content">
                  <h4 className="home-info-title">{info.title}</h4>
                  <p className="home-info-subtitle">{info.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MobileFrame>
  );
}
