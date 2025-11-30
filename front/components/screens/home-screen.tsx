"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import MobileFrame from "./mobile-frame";
import Image, { StaticImageData } from "next/image";
import imgIcon from "../images/img-icon.svg";
import perro from "../images/default-pet-pic.png";
import logoGuau from "../images/guau_logo.svg";
import petCardSvg from "../images/pet-card.svg";

import stockImage1 from "../images/stock-images/dog-img1.jpg";
import stockImage2 from "../images/stock-images/dog-img2.jpeg";
import stockImage3 from "../images/stock-images/dog-img3.jpeg";
import stockImage4 from "../images/stock-images/dog-img4.jpg";
import stockImage5 from "../images/stock-images/dog-img5.jpeg";
import stockImage6 from "../images/stock-images/dog-img6.jpg";
import stockImage7 from "../images/stock-images/dog-img7.jpg";
import stockImage8 from "../images/stock-images/dog-img8.jpeg";
import stockImage9 from "../images/stock-images/dog-img9.jpg";
import stockImage10 from "../images/stock-images/dog-img10.jpg";
import lineSvg from "../images/line.svg";
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
import { api } from "@/lib/api";
import { mapAnimalToFrontend, mapEventoToFrontend } from "@/lib/api-helpers";
import "../styles/home-screen-styles.css";

interface HomeEvent {
  id: string;
  tipo: string;
  fecha: string;
  horario?: string;
  petName: string;
  eventType: string;
  esAplicada?: boolean;
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

      <div className="home-header-line">
        <Image src={lineSvg} alt="Line separator" width={336} height={2} />
      </div>
    </>
  );
}; 

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
}: HomeScreenProps) {
  const [allPets, setAllPets] = useState<
    Array<{
      id: number;
      id_animal?: number; 
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
        id_animal?: number; 
      };
    }>
  >([]);

  const [events, setEvents] = useState<HomeEvent[]>([]);
  const [loadingPets, setLoadingPets] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Obtener ID del dueño desde localStorage
  const getDueñoId = (): number | null => {
    try {
      const userDataStr = localStorage.getItem('user_data');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        return userData.id_dueño || null;
      }
    } catch (e) {
      console.error("Error al obtener ID del dueño:", e);
    }
    return null;
  };

  // Cargar todas las mascotas desde la API o localStorage como fallback
  useEffect(() => {
    const loadAllPets = async () => {
      const id_dueño = getDueñoId();
      
      // Intentar cargar desde la API si tenemos un ID de dueño
      if (id_dueño) {
        try {
          setLoadingPets(true);
          setApiError(null);
          const animales = await api.animal.getByDueño(id_dueño);
          
          // Mapear animales de la API al formato del frontend
          // Usar id_animal real (sumar 10000 para distinguirlo de índices de localStorage)
          const petsArray = animales.map((animal) => {
            const mapped = mapAnimalToFrontend(animal);
            return {
              ...mapped,
              id: animal.id_animal + 10000, 
              image: mapped.image || perro,
            };
          });

          // Filtrar mascotas que no existen en localStorage (fueron eliminadas localmente)
          // Esto asegura que las mascotas eliminadas no aparezcan
          // También verificar pets_order para asegurarse de que la mascota no fue eliminada
          const petsOrderKey = "pets_order";
          const petsOrderStr = localStorage.getItem(petsOrderKey);
          let petsOrder: string[] = [];
          if (petsOrderStr) {
            try {
              petsOrder = JSON.parse(petsOrderStr);
            } catch (e) {
              console.error("Error al parsear orden de mascotas:", e);
            }
          }

          const validPetsArray = petsArray.filter((pet) => {
            if (!pet.fullData || !pet.fullData.name) return false;
            const petDataStr = localStorage.getItem(`pet_data_${pet.fullData.name}`);
            // Solo incluir si existe en localStorage Y está en pets_order (no fue eliminada)
            return petDataStr !== null && (petsOrder.length === 0 || petsOrder.includes(pet.fullData.name));
          });

          // Si hay mascotas desde la API, usarlas
          if (validPetsArray.length > 0) {
            setAllPets(validPetsArray);
            setLoadingPets(false);
            return;
          } else if (petsArray.length > 0 && validPetsArray.length === 0) {
            // Si había mascotas en la API pero ninguna válida en localStorage,
            // significa que fueron eliminadas, usar el fallback
            setLoadingPets(false);
            // Continuar con el fallback a localStorage
          } else {
            setAllPets([]);
            setLoadingPets(false);
            return;
          }
        } catch (error) {
          console.error("Error al cargar mascotas desde la API:", error);
          setApiError(error instanceof Error ? error.message : "Error al conectar con el servidor");
          // Continuar con el fallback a localStorage
        }
      }

      // Fallback: cargar desde localStorage
      setLoadingPets(false);
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

      if (petData) {
        petsMap.set(petData.name, petData);
      }

      const petsOrderKey = "pets_order";
      let petsOrder: string[] = [];
      const petsOrderStr = localStorage.getItem(petsOrderKey);
      if (petsOrderStr) {
        try {
          petsOrder = JSON.parse(petsOrderStr);
        } catch (e) {
          console.error("Error al parsear orden de mascotas:", e);
        }
      }

      if (petsOrder.length === 0) {
        petsOrder = Array.from(petsMap.keys());
        localStorage.setItem(petsOrderKey, JSON.stringify(petsOrder));
      }

      const allPetNames = Array.from(petsMap.keys());
      allPetNames.forEach((petName) => {
        if (!petsOrder.includes(petName)) {
          petsOrder.push(petName);
        }
      });

      petsOrder = petsOrder.filter((petName) => petsMap.has(petName));
      localStorage.setItem(petsOrderKey, JSON.stringify(petsOrder));

      const allPetsArray = petsOrder
        .map((petName) => {
          const pet = petsMap.get(petName);
          if (!pet) return null;
          return {
            id: petsOrder.indexOf(petName) + 1,
            name: pet.name,
            breed: pet.breed || "Sin raza especificada",
            image: pet.imageURL || perro,
            fullData: pet,
          };
        })
        .filter((pet) => pet !== null) as Array<{
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
      }>;

      setAllPets(allPetsArray);
    };

    loadAllPets();
    const handleStorageChange = () => {
      loadAllPets();
    };

    const handlePetDeleted = () => {
      loadAllPets();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("customStorageChange", handleStorageChange);
    window.addEventListener("petDeleted", handlePetDeleted);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("customStorageChange", handleStorageChange);
      window.removeEventListener("petDeleted", handlePetDeleted);
    };
  }, [petData]);

  const [activePetIndex, setActivePetIndex] = useState(0);
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [activeInfoIndex, setActiveInfoIndex] = useState(0);
  const eventsScrollRef = useRef<HTMLDivElement>(null);
  const infoScrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0); 
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // No mostrar mascota por defecto - solo mostrar las mascotas que realmente existen
  const pets = allPets;

  // Efecto para actualizar el índice activo cuando cambia el scroll de pets
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || pets.length === 0) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const cardWidth = containerWidth;
      const gap = 12; 
      const totalCardWidth = cardWidth + gap;
      
      // Calcular el índice basado en la posición de scroll
      const exactIndex = scrollLeft / totalCardWidth;
      let newIndex = Math.round(exactIndex);
      // Asegurar que el índice esté dentro del rango válido
      newIndex = Math.max(0, Math.min(newIndex, pets.length - 1));
      // Calcular el progreso del scroll entre cards (0 = en una card, 1 = en la siguiente)
      const progress = Math.abs(exactIndex - newIndex) * 2; 
      const clampedProgress = Math.min(1, progress);
      
      setScrollProgress(clampedProgress);
  
      if (newIndex !== activePetIndex) {
        setActivePetIndex(newIndex);
      }
    };

    container.addEventListener('scroll', handleScroll);

    handleScroll();
    
    return () => container.removeEventListener('scroll', handleScroll);
  }, [pets.length, activePetIndex]);

  // Efecto para actualizar el índice activo cuando cambia el scroll de eventos
  useEffect(() => {
    const container = eventsScrollRef.current;
    if (!container || events.length === 0) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const cardWidth = containerWidth - 24; 
      const gap = 12; 
      const scrollPadding = 24; 
      const totalCardWidth = cardWidth + gap;
      const adjustedScrollLeft = Math.max(0, scrollLeft - scrollPadding);
      const exactIndex = adjustedScrollLeft / totalCardWidth;
      const roundedIndex = Math.round(exactIndex);
      const clampedIndex = Math.max(0, Math.min(roundedIndex, events.length - 1));
      
      if (clampedIndex !== activeEventIndex) {
        setActiveEventIndex(clampedIndex);
      }
    };

    container.addEventListener("scroll", handleScroll);
    handleScroll(); 

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [events.length, activeEventIndex]);

  // Cargar eventos de salud de la mascota visible actualmente
  useEffect(() => {
    const loadEvents = async () => {
      const allEvents: HomeEvent[] = [];

      // Obtener la mascota que está visible actualmente
      // Verificar que haya mascotas antes de acceder
      if (pets.length === 0) return;
      
      const activePet = pets[activePetIndex];
      
      if (activePet && activePet.fullData) {
        const pet = { name: activePet.fullData.name };
        
        // Intentar cargar eventos desde la API si tenemos el ID del animal
        const petId = activePet.fullData?.id_animal || 
                     (activePet.id && activePet.id > 10000 ? activePet.id - 10000 : null);

        if (petId) {
          try {
            const eventos = await api.eventoSalud.getByAnimal(petId);
            eventos.forEach((evento) => {
              const mapped = mapEventoToFrontend(evento, pet.name);
              allEvents.push(mapped);
            });
          } catch (error) {
            console.error("Error al cargar eventos desde la API:", error);
            // Continuar con el fallback a localStorage
          }
        }

        // Siempre cargar desde localStorage también para incluir eventos nuevos creados localmente
        // Esto asegura que los eventos creados desde las pantallas de salud o el calendario se muestren
        // Vacunas
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
                  esAplicada: vaccine.esAplicada !== undefined ? vaccine.esAplicada : false,
                });
              });
            } catch (e) {
              console.error("Error al parsear vacunas:", e);
            }
          }

          // Higiene
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
                  esAplicada: event.esAplicada !== undefined ? event.esAplicada : false,
                });
              });
            } catch (e) {
              console.error("Error al parsear higiene:", e);
            }
          }

          // Medicina
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
                  esAplicada: event.esAplicada !== undefined ? event.esAplicada : false,
                });
              });
            } catch (e) {
              console.error("Error al parsear medicina:", e);
            }
          }

          // Aantiparasitario
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
                  esAplicada: event.esAplicada !== undefined ? event.esAplicada : false,
                });
              });
            } catch (e) {
              console.error("Error al parsear antiparasitario:", e);
            }
          }

          // Veterinario
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
                  esAplicada: event.esAplicada !== undefined ? event.esAplicada : false,
                });
              });
            } catch (e) {
              console.error("Error al parsear veterinario:", e);
            }
          }

          // Otro
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
                  esAplicada: event.esAplicada !== undefined ? event.esAplicada : false,
                });
              });
            } catch (e) {
              console.error("Error al parsear otro:", e);
            }
          }

          // Otros eventos generales
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
                  esAplicada: event.esAplicada !== undefined ? event.esAplicada : false,
                });
              });
            } catch (e) {
              console.error("Error al parsear eventos:", e);
            }
          }
      }

      // Filtrar eventos duplicados (pueden estar tanto en la API como en localStorage)
      const uniqueEvents = allEvents.filter((event, index, self) => {
        if (event.id) {
          return index === self.findIndex((e) => e.id === event.id);
        }
        return index === self.findIndex((e) => 
          e.fecha === event.fecha && 
          e.tipo === event.tipo && 
          e.petName === event.petName &&
          e.horario === event.horario
        );
      });

      // Filtrar solo eventos pendientes 
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const isPending = (event: HomeEvent): boolean => {
        if (event.esAplicada) return false;
        // Verificar si la fecha es hoy o futura
        try {
          let dateOnly = event.fecha;
          if (event.fecha.includes('T')) {
            dateOnly = event.fecha.split('T')[0];
          }
          const eventDate = new Date(dateOnly + "T00:00:00");
          if (isNaN(eventDate.getTime())) return false;
          return eventDate >= today;
        } catch (e) {
          console.error("Error al verificar si está pendiente:", e);
          return false;
        }
      };

      const pendingEvents = uniqueEvents
        .filter(isPending)
        .sort((a, b) => {
          const dateA = new Date(
            a.fecha + (a.horario ? `T${a.horario}` : "T00:00")
          );
          const dateB = new Date(
            b.fecha + (b.horario ? `T${b.horario}` : "T00:00")
          );
          return dateA.getTime() - dateB.getTime();
        });

      setEvents(pendingEvents);
    };

    loadEvents();

    // Escuchar cambios en localStorage para recargar eventos
    const handleStorageChange = () => {
      loadEvents();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("customStorageChange", handleStorageChange);

    // Recargar eventos periódicamente
    const interval = setInterval(loadEvents, 5000);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("customStorageChange", handleStorageChange);
    };
  }, [activePetIndex, pets, allPets]);

  // Todas las cards de información útil
  const allUsefulInfo = [
    {
      id: 1,
      title: "3 trucos fáciles para enseñarle a tu perro",
      subtitle: "Click para leer",
      image: stockImage1,
    },
    {
      id: 2,
      title: "Cuidados básicos",
      subtitle: "Click para leer",
      image: stockImage2,
    },
    {
      id: 3,
      title: "Tips para la hora del paseo",
      subtitle: "Click para leer",
      image: stockImage3,
    },
    {
      id: 4,
      title: "¿Cuántas veces al día debo pasear a mi perro?",
      subtitle: "Click para leer",
      image: stockImage4,
    },
    {
      id: 5,
      title: "5 señales de que tu perro es feliz",
      subtitle: "Click para leer",
      image: stockImage5,
    },
    {
      id: 6,
      title: "Juguetes ideales para cachorros",
      subtitle: "Click para leer",
      image: stockImage6,
    },
    {
      id: 7,
      title: "Cuántas horas al día suele dormir un perro según su edad",
      subtitle: "Click para leer",
      image: stockImage7,
    },
    {
      id: 8,
      title: "Qué tipo de alimento es mejor para tu perro según su raza",
      subtitle: "Click para leer",
      image: stockImage8,
    },
    {
      id: 9,
      title: "Tips para mejorar la convivencia entre perros",
      subtitle: "Click para leer",
      image: stockImage9,
    },
    {
      id: 10,
      title: "Cómo mantener a tu perro saludable y feliz",
      subtitle: "Click para leer",
      image: stockImage10,
    },
  ];

  // Estado para rastrear la experiencia del usuario
  const [userExperience, setUserExperience] = useState<boolean | null>(null);
  const [userType, setUserType] = useState<string | null>(null);

  // Cargar la experiencia del usuario desde localStorage
  useEffect(() => {
    const loadUserInfo = () => {
      const userTypeStr = localStorage.getItem("user_type");
      const userExperienceStr = localStorage.getItem("user_experience");
      
      setUserType(userTypeStr);
      
      if (userExperienceStr !== null) {
        try {
          const hasExperience = JSON.parse(userExperienceStr);
          setUserExperience(hasExperience);
        } catch (e) {
          console.error("Error al parsear experiencia del usuario:", e);
          setUserExperience(null);
        }
      } else {
        setUserExperience(null);
      }
    };

    loadUserInfo();

    // Escuchar cambios en localStorage
    const handleStorageChange = () => {
      loadUserInfo();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("customStorageChange", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("customStorageChange", handleStorageChange);
    };
  }, []);

  // Función para determinar si la mascota activa es cachorro (menor a 1 año)
  const isPuppy = useMemo(() => {
    // Verificar que haya mascotas antes de acceder
    if (pets.length === 0) return false;
    
    const activePet = pets[activePetIndex];
    if (!activePet?.fullData) return false;

    const petData = activePet.fullData;

    // Si tiene fecha de cumpleaños, calcular la edad
    if (petData.birthday) {
      try {
        let birthdayDate: Date | null = null;

      // Formato
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
            birthdayDate = new Date(year, month, day);
          }
        } else {
          birthdayDate = new Date(petData.birthday);
        }

        if (birthdayDate && !isNaN(birthdayDate.getTime())) {
          const today = new Date();
          let years = today.getFullYear() - birthdayDate.getFullYear();
          let months = today.getMonth() - birthdayDate.getMonth();
          
          if (months < 0) {
            years--;
            months += 12;
          } else if (months === 0 && today.getDate() < birthdayDate.getDate()) {
            years--;
            months = 11;
          }
          
          return years < 1;
        }
      } catch (e) {
        console.error("Error al calcular edad desde birthday:", e);
      }
    }

    if (petData.approximateAge) {
      const ageStr = petData.approximateAge.toLowerCase();
      
      const mesesMatch = ageStr.match(/(\d+)\s*mes(es)?/);
      if (mesesMatch) {
        const meses = parseInt(mesesMatch[1]);
        return meses < 12;
      }
      
      if (ageStr.includes("menos de 1 año") || ageStr.includes("menos de un año")) {
        return true;
      }
      
      const añosMatch = ageStr.match(/(\d+)\s*año(s)?/);
      if (añosMatch) {
        const años = parseInt(añosMatch[1]);
        return años < 1;
      }
    }

    return false;
  }, [pets, activePetIndex]);

  // Filtrar las cards según la experiencia del usuario y si es cachorro
  const usefulInfo = useMemo(() => {
    // Array para recolectar todos los IDs de cards que aplican
    const applicableCardIds: number[] = [5, 7, 10];
    
    // Verificar si el usuario NO tiene experiencia
    // Condición: (eligió "acabo de adoptar un perro" o "futuro padre de perro") Y (indicó "no, soy padre primerizo")
    const isNewUserWithoutExperience = 
      (userType === "acabo de tener un perro" || userType === "futuro padre de perro") &&
      userExperience === false;
    
    if (isNewUserWithoutExperience) {
      applicableCardIds.push(...[2, 3, 4, 8]);
    } else {
      applicableCardIds.push(...[1]);
    }
    
    if (isPuppy) {
      applicableCardIds.push(...[6]);
    }
    
    if (allPets.length >= 2) {
      applicableCardIds.push(...[9]);
    }
    
    // Si hay cards aplicables, filtrar y mostrar solo esas
    // Si no hay condiciones que aplicar, mostrar todas las cards
    if (applicableCardIds.length > 0) {
      // Eliminar duplicados 
      const uniqueCardIds = Array.from(new Set(applicableCardIds));
      return allUsefulInfo.filter(info => uniqueCardIds.includes(info.id));
    }
    
    // Para todos los demás casos, mostrar todas las cards
    return allUsefulInfo;
  }, [userType, userExperience, isPuppy, allPets.length]);

  // Efecto para actualizar el índice activo cuando cambia el scroll de información útil
  useEffect(() => {
    const container = infoScrollRef.current;
    if (!container || usefulInfo.length === 0) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const cardWidth = containerWidth - 24; 
      const gap = 12; 
      const scrollPadding = 24; 
      const totalCardWidth = cardWidth + gap;
      const adjustedScrollLeft = Math.max(0, scrollLeft - scrollPadding);
      const exactIndex = adjustedScrollLeft / totalCardWidth;
      const roundedIndex = Math.round(exactIndex);
      const clampedIndex = Math.max(0, Math.min(roundedIndex, usefulInfo.length - 1));
      
      if (clampedIndex !== activeInfoIndex) {
        setActiveInfoIndex(clampedIndex);
      }
    };

    container.addEventListener("scroll", handleScroll);
    handleScroll(); 

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [usefulInfo.length, activeInfoIndex]);

  return (
    <MobileFrame>
      <div className="home-container">
        <HomeHeader userName={userName} onOpenMenu={onOpenMenu} />

        <div className="home-section">
          <div className="home-section-header">
            <h2 className="home-section-title">Mis mascotas</h2>
            <div className="home-section-badge">
              <span>{allPets.length}</span>
            </div>
          </div>
          <div className="home-pets-container">
            <div className="home-pets-scroll-container" ref={scrollContainerRef}>
              {pets.length === 0 ? (
                <div style={{ 
                  padding: '2rem', 
                  textAlign: 'center', 
                  color: '#6B7280',
                  fontSize: '14px',
                  width: '100%'
                }}>
                  No hay mascotas registradas. Agregá una desde el menú.
                </div>
              ) : (
                pets.map((pet, index) => {
                const distance = index - activePetIndex;
                let opacity = 1;
                let zIndex = 1;
                let scale = 1;
                let isBehind = false;
                
                const petColors = ["#EE7232", "#F3B38F", "#FFC542"];
                const petColorIndex = index % petColors.length;
                const petColor = petColors[petColorIndex];
                
                if (distance === 0) {
                  // Card activa
                  opacity = 1;
                  zIndex = 10;
                  scale = 1;
                } else if (distance === 1) {
                  // Card siguiente (derecha): se asoma
                  opacity = 1;
                  zIndex = 5;
                  scale = 1;
                  isBehind = false;
                } else if (distance === -1) {
                  // Card anterior (izquierda): oculta
                  opacity = 0.3;
                  zIndex = 1;
                  scale = 1;
                  isBehind = true;
                } else if (distance > 1) {
                  // Cards más lejanas a la derecha: ocultas
                  opacity = 0;
                  zIndex = 0;
                  scale = 1;
                  isBehind = true;
                } else {
                  // Cards más lejanas a la izquierda: ocultas
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
                      <p className="home-pet-click-text">Click para ver perfil</p>
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
              })
              )}
            </div>
            <div className="home-pagination">
              {pets.length > 0 && pets.map((_, index) => (
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
            <>
              <div className="home-events-container" ref={eventsScrollRef}>
                {events.map((event) => {
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

                // Obtener la imagen de la mascota visible actualmente
                const getPetImage = (
                  petName: string
                ): string | StaticImageData => {
                  // Verificar que haya mascotas antes de acceder
                  if (pets.length > 0 && activePetIndex < pets.length) {
                    const activePet = pets[activePetIndex];
                    if (activePet && activePet.fullData && activePet.fullData.name === petName) {
                      return activePet.fullData.imageURL || perro;
                    }
                  }
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
              </div>
              {events.length > 1 && (
                <div className="home-pagination">
                  {events.map((_, index) => (
                    <div
                      key={index}
                      className={`home-pagination-dot ${
                        index === activeEventIndex ? "active" : ""
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          )}
          {events.length > 3 && (
            <button
              className="home-ver-todos-text-button"
              onClick={() => {
                if (onOpenCalendar) {
                  onOpenCalendar();
                }
              }}
            >
              Ver en calendario
            </button>
          )}
        </div>

        {/* Información útil */}
        <div className="home-section">
          <div className="home-section-header">
            <h2 className="home-section-title">Información útil</h2>
          </div>
          <div className="home-info-container" ref={infoScrollRef}>
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
          {usefulInfo.length > 1 && (
            <div className="home-pagination">
              {usefulInfo.map((_, index) => (
                <div
                  key={index}
                  className={`home-pagination-dot ${
                    index === activeInfoIndex ? "active" : ""
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </MobileFrame>
  );
}
