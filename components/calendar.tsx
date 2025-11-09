"use client";

import { useState, useEffect } from "react";
import MobileFrame from "./mobile-frame";
import Image, { StaticImageData } from "next/image"; // Importar StaticImageData
import { ArrowLeft, ChevronLeft, ChevronRight, X, Plus } from "lucide-react";
import perro from "./images/perro.png";
import lineSvg from "./images/line.svg";
import vacunaIcon from "./images/event-icons/vacuna.svg";
import medicinaIcon from "./images/event-icons/medicina.svg";
import veterinarioIcon from "./images/event-icons/veterinario.svg";
import otroIcon from "./images/event-icons/otro.svg";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import "./styles/calendar-styles.css";

interface CalendarProps {
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
}

interface HealthEvent {
  id: string;
  tipo: string;
  fecha: string; // YYYY-MM-DD
  horario?: string; // HH:MM
  petName: string;
  eventType:
    | "vacuna"
    | "medicina"
    | "veterinario"
    | "antiparasitario"
    | "higiene"
    | "otro";
  esAplicada?: boolean;
}

const monthNames = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const dayNames = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

export default function Calendar({
  userName = "User",
  petData,
  onBack,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<HealthEvent[]>([]);
  const [allPets, setAllPets] = useState<
    Array<{
      name: string;
      imageURL?: string;
    }>
  >([]);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [eventForm, setEventForm] = useState({
    tipo: "",
    horario: "",
    petName: "",
    eventType: "otro" as HealthEvent["eventType"],
    reminderEnabled: false,
    reminderTime: "",
  });

  const pet = {
    name: petData?.name || "Maxi",
    image: petData?.imageURL || perro,
  };

  // Cargar todas las mascotas
  useEffect(() => {
    const loadAllPets = () => {
      const petsMap = new Map<string, { name: string; imageURL?: string }>();

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("pet_data_")) {
          const petName = key.replace("pet_data_", "");
          const petDataStr = localStorage.getItem(key);

          if (petDataStr) {
            try {
              const petDataObj = JSON.parse(petDataStr);
              if (petDataObj.name && !petsMap.has(petDataObj.name)) {
                petsMap.set(petDataObj.name, {
                  name: petDataObj.name,
                  imageURL: petDataObj.imageURL,
                });
              }
            } catch (e) {
              console.error("Error al parsear datos de mascota:", e);
            }
          }
        }
      }

      if (petData) {
        petsMap.set(petData.name, {
          name: petData.name,
          imageURL: petData.imageURL,
        });
      }

      setAllPets(Array.from(petsMap.values()));
    };

    loadAllPets();
  }, [petData]);

  // Cargar eventos de salud
  useEffect(() => {
    const loadEvents = () => {
      const allEvents: HealthEvent[] = [];

      // Cargar eventos de todas las mascotas
      allPets.forEach((pet) => {
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
                esAplicada: vaccine.esAplicada,
              });
            });
          } catch (e) {
            console.error("Error al parsear vacunas:", e);
          }
        }

        // Cargar otros eventos
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
      });

      // Ordenar eventos por fecha
      allEvents.sort((a, b) => {
        const dateA = new Date(
          a.fecha + (a.horario ? `T${a.horario}` : "T00:00")
        );
        const dateB = new Date(
          b.fecha + (b.horario ? `T${b.horario}` : "T00:00")
        );
        return dateA.getTime() - dateB.getTime();
      });

      setEvents(allEvents);
    };

    if (allPets.length > 0) {
      loadEvents();
    }

    // Escuchar cambios en localStorage
    const handleStorageChange = () => {
      loadEvents();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("customStorageChange", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("customStorageChange", handleStorageChange);
    };
  }, [allPets]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    // Ajustar para que lunes = 0, martes = 1, etc. (en lugar de domingo = 0)
    let startingDayOfWeek = firstDay.getDay() - 1;
    if (startingDayOfWeek < 0) startingDayOfWeek = 6; // Si es domingo, convertirlo a 6

    const days: (Date | null)[] = [];

    // Días del mes anterior
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    // Días del mes siguiente para completar la cuadrícula
    const remainingDays = 42 - days.length; // 6 semanas * 7 días
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  };

  const getEventsForDate = (date: Date | null): HealthEvent[] => {
    if (!date) return [];
    const dateStr = date.toISOString().split("T")[0];
    return events.filter((event) => event.fecha === dateStr);
  };

  const getEventColor = (eventType: string): string => {
    const colors: { [key: string]: string } = {
      vacuna: "#10B981", // verde
      medicina: "#EC4899", // rosa
      veterinario: "#F59E0B", // naranja
      antiparasitario: "#A855F7", // morado
      higiene: "#3B82F6", // azul
      otro: "#6B7280", // gris
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
      default:
        return otroIcon;
    }
  };

  const getEventTypeName = (event: HealthEvent): string => {
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

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (time: string): string => {
    return time;
  };

  const isToday = (date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date | null): boolean => {
    if (!date || !selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isCurrentMonth = (date: Date | null): boolean => {
    if (!date) return false;
    return date.getMonth() === currentDate.getMonth();
  };

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const getUpcomingEvents = (): HealthEvent[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events
      .filter((event) => {
        const eventDate = new Date(
          event.fecha + (event.horario ? `T${event.horario}` : "T00:00")
        );
        return eventDate >= today;
      })
      .slice(0, 10); // Máximo 10 eventos próximos
  };

  // CORRECCIÓN: el tipo de retorno debe incluir StaticImageData
  const getPetImage = (petName: string): string | StaticImageData => {
    const pet = allPets.find((p) => p.name === petName);
    return pet?.imageURL || perro;
  };

  const days = getDaysInMonth(currentDate);
  const upcomingEvents = getUpcomingEvents();

  return (
    <MobileFrame>
      <div className="calendar-container">
        {/* Header */}
        <div className="calendar-header">
          <button
            onClick={onBack}
            className="calendar-back-button"
            aria-label="Volver"
          >
            <ArrowLeft className="calendar-back-icon" />
          </button>
          <h1 className="calendar-title">Calendario</h1>
        </div>

        {/* Line separator */}
        <div className="calendar-header-line">
          <Image src={lineSvg} alt="Line separator" width={336} height={2} />
        </div>

        {/* Month Navigation */}
        <div className="calendar-month-nav">
          <button onClick={goToPreviousMonth} className="calendar-nav-button">
            <ChevronLeft className="calendar-nav-icon" />
          </button>
          <h2 className="calendar-month-title">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button onClick={goToNextMonth} className="calendar-nav-button">
            <ChevronRight className="calendar-nav-icon" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="calendar-grid">
          {/* Day names */}
          {dayNames.map((day, index) => (
            <div
              key={day}
              className={`calendar-day-name ${
                index === 6 ? "calendar-day-name-weekend" : ""
              }`}
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((date, index) => {
            const dateEvents = getEventsForDate(date);
            const isCurrentMonthDay = isCurrentMonth(date);
            const isTodayDate = isToday(date);
            const isSelectedDate = isSelected(date);

            return (
              <div
                key={index}
                className={`calendar-day ${
                  !isCurrentMonthDay ? "calendar-day-other-month" : ""
                } ${isTodayDate ? "calendar-day-today" : ""} ${
                  isSelectedDate ? "calendar-day-selected" : ""
                }`}
                onClick={() => {
                  if (date && isCurrentMonth(date)) {
                    setSelectedDate(date);
                    setShowAddEventModal(true);
                    setEventForm({
                      tipo: "",
                      horario: "",
                      petName: pet.name,
                      eventType: "otro",
                      reminderEnabled: false,
                      reminderTime: "",
                    });
                  }
                }}
              >
                <span className="calendar-day-number">{date?.getDate()}</span>
                <div className="calendar-day-events">
                  {dateEvents.slice(0, 2).map((event, eventIndex) => (
                    <div
                      key={event.id}
                      className="calendar-day-event-dot"
                      style={{
                        backgroundColor: getEventColor(event.eventType),
                      }}
                      title={getEventTypeName(event)}
                    />
                  ))}
                  {dateEvents.length > 2 && (
                    <div className="calendar-day-event-more">
                      +{dateEvents.length - 2}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Upcoming Events */}
        <div className="calendar-upcoming-section">
          <div className="calendar-upcoming-header">
            <h3 className="calendar-upcoming-title">Próximos eventos</h3>
            <span className="calendar-upcoming-badge">
              {upcomingEvents.length}
            </span>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="calendar-events-list">
              {upcomingEvents.map((event) => {
                const eventDate = new Date(
                  event.fecha + (event.horario ? `T${event.horario}` : "T00:00")
                );
                const petImage = getPetImage(event.petName);

                return (
                  <div key={event.id} className="calendar-event-card">
                    <div
                      className="calendar-event-icon"
                      style={{
                        backgroundColor: `${getEventColor(event.eventType)}20`,
                      }}
                    >
                      <Image
                        src={getEventIcon(event.eventType)}
                        alt={event.eventType}
                        width={54}
                        height={54}
                      />
                    </div>
                    <div className="calendar-event-info">
                      <h4 className="calendar-event-title">
                        {getEventTypeName(event)}
                      </h4>
                      <p className="calendar-event-date">
                        {formatDate(eventDate)}
                        {event.horario && ` - ${formatTime(event.horario)}hs`}
                      </p>
                    </div>
                    <div className="calendar-event-pet">
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
          ) : (
            <div className="calendar-no-events">
              <p>No tenés eventos registrados</p>
            </div>
          )}
        </div>

        {/* Modal para agregar evento */}
        {showAddEventModal && selectedDate && (
          <div
            className="calendar-add-event-modal-overlay"
            onClick={() => setShowAddEventModal(false)}
          >
            <div
              className="calendar-add-event-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="calendar-add-event-modal-header">
                <h3 className="calendar-add-event-modal-title">
                  Agregar evento
                </h3>
                <button
                  onClick={() => setShowAddEventModal(false)}
                  className="calendar-add-event-modal-close"
                >
                  <X className="calendar-add-event-modal-close-icon" />
                </button>
              </div>

              <div className="calendar-add-event-modal-content">
                <div className="calendar-add-event-field">
                  <label className="calendar-add-event-label">Fecha</label>
                  <Input
                    type="date"
                    value={selectedDate.toISOString().split("T")[0]}
                    disabled
                    className="calendar-add-event-input"
                  />
                </div>

                <div className="calendar-add-event-field">
                  <label className="calendar-add-event-label">
                    Tipo de evento
                  </label>
                  <Select
                    value={eventForm.eventType}
                    onValueChange={(value) =>
                      setEventForm({
                        ...eventForm,
                        eventType: value as HealthEvent["eventType"],
                      })
                    }
                  >
                    <SelectTrigger className="calendar-add-event-select">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vacuna">Vacuna</SelectItem>
                      <SelectItem value="medicina">Medicina</SelectItem>
                      <SelectItem value="veterinario">Veterinario</SelectItem>
                      <SelectItem value="antiparasitario">
                        Antiparasitario
                      </SelectItem>
                      <SelectItem value="higiene">Higiene</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="calendar-add-event-field">
                  <label className="calendar-add-event-label">
                    Nombre del evento
                  </label>
                  <Input
                    type="text"
                    placeholder="Ej: Vacuna Séxtuple"
                    value={eventForm.tipo}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, tipo: e.target.value })
                    }
                    className="calendar-add-event-input"
                  />
                </div>

                <div className="calendar-add-event-field">
                  <label className="calendar-add-event-label">
                    Horario (opcional)
                  </label>
                  <Input
                    type="time"
                    value={eventForm.horario}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, horario: e.target.value })
                    }
                    className="calendar-add-event-input"
                  />
                </div>

                <div className="calendar-add-event-field">
                  <label className="calendar-add-event-label">Mascota</label>
                  <Select
                    value={eventForm.petName}
                    onValueChange={(value) =>
                      setEventForm({ ...eventForm, petName: value })
                    }
                  >
                    <SelectTrigger className="calendar-add-event-select">
                      <SelectValue placeholder="Seleccionar mascota" />
                    </SelectTrigger>
                    <SelectContent>
                      {allPets.map((pet) => (
                        <SelectItem key={pet.name} value={pet.name}>
                          {pet.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="calendar-add-event-field">
                  <label className="calendar-add-event-checkbox-label">
                    <input
                      type="checkbox"
                      checked={eventForm.reminderEnabled}
                      onChange={(e) =>
                        setEventForm({
                          ...eventForm,
                          reminderEnabled: e.target.checked,
                        })
                      }
                      className="calendar-add-event-checkbox"
                    />
                    <span>Activar recordatorio</span>
                  </label>
                </div>

                {eventForm.reminderEnabled && (
                  <div className="calendar-add-event-field">
                    <label className="calendar-add-event-label">
                      Hora del recordatorio
                    </label>
                    <Input
                      type="time"
                      value={eventForm.reminderTime}
                      onChange={(e) =>
                        setEventForm({
                          ...eventForm,
                          reminderTime: e.target.value,
                        })
                      }
                      className="calendar-add-event-input"
                    />
                  </div>
                )}

                <div className="calendar-add-event-modal-actions">
                  <Button
                    onClick={() => {
                      if (eventForm.tipo && eventForm.petName && selectedDate) {
                        const newEvent: HealthEvent = {
                          id: Date.now().toString(),
                          tipo: eventForm.tipo,
                          fecha: selectedDate.toISOString().split("T")[0],
                          horario: eventForm.horario || undefined,
                          petName: eventForm.petName,
                          eventType: eventForm.eventType,
                        };

                        // Guardar evento según su tipo
                        if (eventForm.eventType === "vacuna") {
                          const vaccinesKey = `vaccines_${eventForm.petName}`;
                          const existingVaccines = JSON.parse(
                            localStorage.getItem(vaccinesKey) || "[]"
                          );
                          const vaccineEvent = {
                            ...newEvent,
                            proximaDosis: calculateNextDose(newEvent.fecha),
                            esAplicada: false,
                          };
                          existingVaccines.push(vaccineEvent);
                          localStorage.setItem(
                            vaccinesKey,
                            JSON.stringify(existingVaccines)
                          );
                        } else {
                          // Guardar otros tipos de eventos
                          const eventsKey = `events_${eventForm.petName}`;
                          const existingEvents = JSON.parse(
                            localStorage.getItem(eventsKey) || "[]"
                          );
                          existingEvents.push(newEvent);
                          localStorage.setItem(
                            eventsKey,
                            JSON.stringify(existingEvents)
                          );
                        }

                        // Crear notificación si está habilitado
                        if (
                          eventForm.reminderEnabled &&
                          eventForm.reminderTime
                        ) {
                          const notification = {
                            id: Date.now().toString(),
                            eventId: newEvent.id,
                            title: eventForm.tipo,
                            message: `Recordatorio: ${eventForm.tipo} para ${eventForm.petName}`,
                            date: selectedDate.toISOString().split("T")[0],
                            time: eventForm.reminderTime,
                            read: false,
                            createdAt: new Date().toISOString(),
                          };

                          const notificationsKey = "notifications";
                          const existingNotifications = JSON.parse(
                            localStorage.getItem(notificationsKey) || "[]"
                          );
                          existingNotifications.push(notification);
                          localStorage.setItem(
                            notificationsKey,
                            JSON.stringify(existingNotifications)
                          );
                        }

                        // Disparar evento personalizado para recargar eventos
                        window.dispatchEvent(new Event("customStorageChange"));

                        setShowAddEventModal(false);
                        setSelectedDate(null);
                      }
                    }}
                    className="calendar-add-event-save-button"
                    disabled={!eventForm.tipo || !eventForm.petName}
                  >
                    Guardar
                  </Button>
                  <Button
                    onClick={() => setShowAddEventModal(false)}
                    className="calendar-add-event-cancel-button"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MobileFrame>
  );
}

const calculateNextDose = (applicationDate: string): string => {
  if (!applicationDate) return "";
  const date = new Date(applicationDate + "T00:00:00");
  date.setFullYear(date.getFullYear() + 1);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};
