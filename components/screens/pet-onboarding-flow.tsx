"use client";

import { useState, useEffect, useRef } from "react";
import MobileFrame from "./mobile-frame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  Plus,
  Dog,
  Bell,
  Menu,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import imgIcon from "../images/img-icon.svg";
import perritos from "../images/dos-perros.png";
import perro from "../images/perro.png";
import "../styles/onboarding-flow-styles.css";
// Importamos el HomeHeader desde el componente de Home
import { HomeHeader } from "@/components/screens/home-screen";

interface PetOnboardingFlowProps {
  userType: string;
  userName?: string;
  onBack: () => void;
  // Propiedad para forzar el paso inicial (0 = Oh Oh!, 1 = Raza)
  initialStep?: number;
  // Propiedad para indicar si viene del menú (para agregar nueva mascota)
  fromMenu?: boolean;
  onFinish?: (petData: {
    name: string;
    breed: string;
    imageURL?: string;
    sex?: string;
    gender?: string;
    weight?: string;
    birthday?: string;
    approximateAge?: string;
  }) => void;
}

export default function PetOnboardingFlow({
  userType,
  userName = "User",
  onBack,
  onFinish,
  initialStep, // Recibimos la prop aquí
  fromMenu = false, // Por defecto no viene del menú
}: PetOnboardingFlowProps) {
  const defaultInitialStep = userType === "future" ? 0 : 1;
  const [step, setStep] = useState(
    initialStep !== undefined ? initialStep : defaultInitialStep
  );
  const [searchBreed, setSearchBreed] = useState("");
  const [petData, setPetData] = useState({
    breed: "",
    name: "",
    sex: "", // macho/hembra
    gender: "", // tamaño: small/medium/large
    weight: "0,0",
    birthday: "",
    imageURL: "",
  });
  const [selectedMonth, setSelectedMonth] = useState(1); // Enero por defecto
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [approximateAge, setApproximateAge] = useState("");
  const [breeds, setBreeds] = useState<string[]>([]);
  const [isLoadingBreeds, setIsLoadingBreeds] = useState(true);

  // Referencia para el input de archivo (NECESARIO PARA EL SELECTOR DE IMAGEN)
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Función para manejar la selección de imagen
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Almacena la imagen como Base64 string
        setPetData((prev) => ({ ...prev, imageURL: reader.result as string }));
      };
      // Convierte el archivo a Base64
      reader.readAsDataURL(file);
    }
  };

  // Función para calcular el número de días en un mes
  const getDaysInMonth = (month: number, year: number) => {
    // Meses con 31 días: 1, 3, 5, 7, 8, 10, 12
    if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
      return 31;
    }
    // Meses con 30 días: 4, 6, 9, 11
    if ([4, 6, 9, 11].includes(month)) {
      return 30;
    }
    // Febrero (mes 2)
    if (month === 2) {
      // Año bisiesto si es divisible por 4, excepto los años divisibles por 100 (a menos que también sean divisibles por 400)
      const isLeapYear =
        (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
      return isLeapYear ? 29 : 28;
    }
    return 31; // Por defecto
  };

  const months = [
    { name: "Enero", value: 1 },
    { name: "Febrero", value: 2 },
    { name: "Marzo", value: 3 },
    { name: "Abril", value: 4 },
    { name: "Mayo", value: 5 },
    { name: "Junio", value: 6 },
    { name: "Julio", value: 7 },
    { name: "Agosto", value: 8 },
    { name: "Septiembre", value: 9 },
    { name: "Octubre", value: 10 },
    { name: "Noviembre", value: 11 },
    { name: "Diciembre", value: 12 },
  ];

  // Cargar razas desde breeds.csv
  // Las razas se ordenan alfabéticamente automáticamente, sin importar
  // dónde se agreguen en el CSV (al final, al principio, o en cualquier posición)
  useEffect(() => {
    const loadBreeds = async () => {
      try {
        setIsLoadingBreeds(true);
        // Usar la API route para leer desde components/breeds.csv
        // Agregar timestamp para evitar caché del navegador
        const response = await fetch(`/api/breeds?t=${Date.now()}`, {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("No se pudo cargar el archivo de razas");
        }
        const text = await response.text();
        const lines = text.split("\n");
        // Filtrar líneas vacías y el encabezado si existe
        const breedsList = lines
          .map((line) => line.trim())
          .filter((line) => line.length > 0 && line !== "Raza");
        // Ordenar alfabéticamente en español (ignora mayúsculas/minúsculas y maneja caracteres especiales)
        const sortedBreeds = breedsList.sort((a, b) => 
          a.localeCompare(b, "es", { sensitivity: "base" })
        );
        setBreeds(sortedBreeds);
      } catch (error) {
        console.error("Error cargando razas:", error);
        // Fallback a lista básica si falla la carga (también ordenada alfabéticamente)
        const fallbackBreeds = [
          "Akita Inu",
          "Beagle",
          "Bichón Frisé",
          "Bichón Maltés",
          "Border Collie",
          "Bóxer",
          "Bulldog Francés",
          "Bulldog Inglés",
          "Caniche",
          "Chihuahua",
          "Cocker Spaniel",
          "Dálmata",
          "Doberman",
          "Dogo Argentino",
          "Golden Retriever",
          "Labrador Retriever",
          "Mestizo",
          "Pastor Alemán",
          "Pug",
          "Rottweiler",
          "Schnauzer",
          "Shih Tzu",
          "Yorkshire Terrier",
        ].sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));
        setBreeds(fallbackBreeds);
      } finally {
        setIsLoadingBreeds(false);
      }
    };
    loadBreeds();
  }, []);
  // ============================================
  // 🔧 CONFIGURACIÓN DE TAMAÑOS DE MASCOTAS
  // ============================================
  // Opciones de tamaño con sus rangos de peso y tamaños de ícono
  // Puedes modificar los rangos de peso y el tamaño de los íconos:
  const genders = [
    { label: "Chico", value: "small", weight: "0 - 14kg", iconSize: "w-8 h-8" },
    {
      label: "Mediano",
      value: "medium",
      weight: "15 - 25kg",
      iconSize: "w-10 h-10",
    },
    {
      label: "Grande",
      value: "large",
      weight: "Más de 25kg",
      iconSize: "w-12 h-12",
    },
  ];
  // ============================================

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  // ============================================
  // 🔧 CONFIGURACIÓN DE PESO INICIAL POR TAMAÑO
  // ============================================
  // Actualizar peso inicial según el tamaño seleccionado cuando llega al Step 4
  // Puedes modificar estos valores iniciales según tus necesidades:
  // - small (Chico): Inicia en 0 kg
  // - medium (Mediano): Inicia en 15 kg
  // - large (Grande): Inicia en 26 kg
  useEffect(() => {
    if (step === 4 && petData.gender && petData.weight === "0,0") {
      let defaultWeight = "0,0";
      if (petData.gender === "small") {
        defaultWeight = "0,0"; // Peso inicial para Chico
      } else if (petData.gender === "medium") {
        defaultWeight = "15,0"; // Peso inicial para Mediano
      } else if (petData.gender === "large") {
        defaultWeight = "26,0"; // Peso inicial para Grande
      }
      setPetData((prev) => ({ ...prev, weight: defaultWeight }));
    }
  }, [step]);
  // ============================================

  // Ajustar el día seleccionado si excede el número de días del mes
  useEffect(() => {
    const maxDays = getDaysInMonth(selectedMonth, selectedYear);
    if (selectedDay > maxDays) {
      setSelectedDay(maxDays);
    }
  }, [selectedMonth, selectedYear, selectedDay]);

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleSkip = () => {
    if (step === 5) {
      // Si está en la pantalla de cumpleaños, ir a edad aproximada
      setStep(6);
    } else {
      setStep(totalSteps);
    }
  };

  // Empty state screen (Oh Oh!)
  if (step === 0) {
    return (
      <MobileFrame>
        <div className="empty-state-container">
          {/* Contenedor del encabezado con el padding de HOME */}
          {/* Usamos 'empty-state-header-wrapper' para dar el padding de la Home y establecer la posición relativa */}
          <div className="empty-state-header-wrapper">
            {/* Botón de regreso, posicionado de forma absoluta sobre el HomeHeader */}
            {/* <button
              onClick={onBack}
              className="empty-state-back-button"
              aria-label="Volver atrás"
            >
              <ArrowLeft className="icon-arrow" />
            </button> */}
            {/* Componente de Encabezado de la Home */}
            <HomeHeader userName={userName} />
          </div>

          {/* Contenido Central */}
          <div className="empty-state-content">
            {/* Imagen */}
            <div className="empty-state-image-wrapper">
              <Image
                src={perritos}
                alt="Dogs illustration"
                width={300}
                height={200}
                layout="responsive"
                objectFit="contain"
              />
            </div>

            {/* Texto */}
            <h2 className="empty-state-title">Oh Oh!</h2>
            <p className="empty-state-text">
              Parece que no tenés mascotas registradas hasta el momento
            </p>
          </div>

          {/* Botón Inferior */}
          <div className="empty-state-button-wrapper">
            <Button
              onClick={() => setStep(1)} // Al hacer clic, avanza al paso 1 (Registro de Raza)
              className="empty-state-fixed-button"
              aria-label="Toca para agregar a tu mascota"
            >
              <span className="empty-state-fixed-button-text">
                ¡Toca para agregar a tu mascota!
              </span>
              <Plus className="icon-add-small" />
            </Button>
          </div>
        </div>
      </MobileFrame>
    );
  }

  // Step 1: Breed selection
  if (step === 1) {
    // Filtrar razas según la búsqueda
    const filteredBreeds = breeds.filter((breed) =>
      breed.toLowerCase().includes(searchBreed.toLowerCase())
    );

    return (
      <MobileFrame>
        <div className="breed-container">
          {/* Header with progress */}
          <div className="breed-header">
            <div className="breed-header-top">
              <button
                onClick={fromMenu ? onBack : (userType === "future" ? () => setStep(0) : onBack)}
                className="breed-back-button"
              >
                <ArrowLeft className="icon-arrow" />
              </button>
              <div className="breed-header-center">
                <h2 className="breed-header-title">Agregar mascota</h2>
                <p className="breed-header-subtitle">Raza</p>
              </div>
              <div className="breed-step-indicator">
                <span className="breed-step-label">Paso</span>
                <span>
                  <span className="breed-step-number">{step}</span>
                  <span className="breed-step-total">/{totalSteps}</span>
                </span>
              </div>
            </div>
            <div className="breed-progress-bar">
              <div
                className="breed-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Breed list */}
          <div className="breed-list">
            {isLoadingBreeds ? (
              <p className="breed-no-results">Cargando razas...</p>
            ) : filteredBreeds.length > 0 ? (
              filteredBreeds.map((breed) => (
                <button
                  key={breed}
                  onClick={() => {
                    setPetData({ ...petData, breed });
                  }}
                  className={`breed-item ${
                    petData.breed === breed ? "breed-item-selected" : ""
                  }`}
                >
                  <span className="breed-item-text">{breed}</span>
                </button>
              ))
            ) : (
              <p className="breed-no-results">No se encontraron razas</p>
            )}
          </div>

          {/* Search bar and button */}
          <div className="breed-search-section">
            <div className="breed-search-wrapper">
              <Search className="breed-search-icon" />
              <Input
                placeholder="Buscar por raza"
                value={searchBreed}
                onChange={(e) => setSearchBreed(e.target.value)}
                className="w-full pl-10 pr-4 py-4 border-2 border-gray-200 rounded-xl"
              />
            </div>

            <Button
              onClick={() => {
                setSearchBreed("");
                handleNext();
              }}
              disabled={!petData.breed}
              className="breed-continue-button"
            >
              Continuar
            </Button>
          </div>
        </div>
      </MobileFrame>
    );
  }

  // Step 2: Name input
  if (step === 2) {
    return (
      <MobileFrame>
        <div className="name-container">
          {/* Header with progress */}
          <div className="name-header">
            <div className="page-header-top">
              <button
                onClick={() => setStep(step - 1)}
                className="page-back-button"
              >
                <ArrowLeft className="icon-arrow" />
              </button>
              <div className="page-header-center">
                <h2 className="page-header-title">Agregar mascota</h2>
                <p className="page-header-subtitle">Nombre y descripción</p>
              </div>
              <div className="page-step-indicator">
                <span className="breed-step-label">Paso</span>
                <span>
                  <span className="breed-step-number">{step}</span>
                  <span className="breed-step-total">/{totalSteps}</span>
                </span>
              </div>
            </div>
            <div className="page-progress-bar">
              <div
                className="page-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Dog image placeholder */}
          {/* Content: Image Selector (PARTE MODIFICADA) */}
          <div className="name-dog-image-wrapper">
            {/* 1. Input de archivo oculto: Esta línea hace que funcione el selector del teléfono/computadora */}
            <input
              type="file"
              ref={fileInputRef} // <-- Referencia clave
              accept="image/*"
              onChange={handleImageChange} // <-- Llama a la función que guarda la imagen
              style={{ display: "none" }}
            />

            {/* 2. Contenedor de la imagen/placeholder */}
            <div className="name-dog-image-container">
              <div className="name-dog-image-circle">
                {petData.imageURL ? (
                  // Muestra la imagen seleccionada
                  <Image
                    src={petData.imageURL} // <-- Fuente de la imagen (Base64)
                    alt="Foto de la mascota"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  // Muestra el placeholder (perro por defecto)
                  <Image
                    src={perro}
                    alt="Perro de ejemplo"
                    width={200}
                    height={200}
                    // ... estilos
                  />
                )}
              </div>

              {/* 3. Botón que se toca para abrir el selector de archivos */}
              <button
                // Al hacer clic, activa el input de archivo oculto
                onClick={() => fileInputRef.current?.click()}
                className="name-add-image-button"
                aria-label="Seleccionar foto de tu mascota"
                title="Toca para subir una foto"
              >
                <Image
                  src={imgIcon}
                  alt="Icono de cámara"
                  width={24}
                  height={24}
                />
              </button>
            </div>

            <p className="name-add-image-text">
              {petData.imageURL ? "Cambiar Foto" : "Agregar Foto"}
            </p>
          </div>
          {/* FIN PARTE MODIFICADA */}

          <div className="name-content">
            <label className="name-label">¿Cómo se llama tu mascota?</label>
            <Input
              placeholder="Maxi"
              value={petData.name}
              onChange={(e) => setPetData({ ...petData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg mb-6"
            />

            <label className="name-sex-label">Tu mascota es...</label>
            <div className="name-sex-buttons">
              <button
                onClick={() => {
                  setPetData({ ...petData, sex: "macho" });
                }}
                className={`name-sex-button ${
                  petData.sex === "macho"
                    ? "name-sex-button-selected"
                    : "name-sex-button-unselected"
                }`}
              >
                Macho
              </button>
              <button
                onClick={() => {
                  setPetData({ ...petData, sex: "hembra" });
                }}
                className={`name-sex-button ${
                  petData.sex === "hembra"
                    ? "name-sex-button-selected"
                    : "name-sex-button-unselected"
                }`}
              >
                Hembra
              </button>
            </div>
          </div>

          <div className="name-button-section">
            <Button
              onClick={handleNext}
              disabled={!petData.name || !petData.sex}
              className="primary-button"
            >
              Continuar
            </Button>
          </div>
        </div>
      </MobileFrame>
    );
  }

  // Step 3: Gender/Size selection
  if (step === 3) {
    return (
      <MobileFrame>
        <div className="page-container">
          {/* Header with progress */}
          <div className="page-header">
            <div className="page-header-top">
              <button
                onClick={() => setStep(step - 1)}
                className="page-back-button"
              >
                <ArrowLeft className="icon-arrow" />
              </button>
              <div className="page-header-center">
                <h2 className="page-header-title">Agregar mascota</h2>
                <p className="page-header-subtitle">Tamaño</p>
              </div>
              <div className="page-step-indicator">
                <span className="breed-step-label">Paso</span>
                <span>
                  <span className="breed-step-number">{step}</span>
                  <span className="breed-step-total">/{totalSteps}</span>
                </span>
              </div>
            </div>
            <div className="page-progress-bar">
              <div
                className="page-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Dog image placeholder */}
          <div className="dog-image-wrapper">
            <div className="dog-image-circle">
              <Image
                src={petData.imageURL || perro} // <-- CAMBIO CLAVE
                alt="Dog"
                width={192}
                height={192}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="size-content">
            <label className="size-label">
              ¿Cuál es el tamaño de {petData.name || "Maxi"}?
            </label>
            <div className="size-buttons">
              {genders.map((gender) => (
                <button
                  key={gender.value}
                  onClick={() => {
                    setPetData({
                      ...petData,
                      gender: gender.value,
                      weight: "0,0",
                    });
                  }}
                  className={`size-button ${
                    petData.gender === gender.value
                      ? "size-button-selected"
                      : "size-button-unselected"
                  }`}
                >
                  <div className="size-button-content">
                    {/* Círculo con ícono de perro */}
                    <div className="size-button-icon-circle">
                      <Dog className={`text-gray-500 ${gender.iconSize}`} />
                    </div>
                    {/* Título */}
                    <span className="size-button-label">{gender.label}</span>
                    {/* Rango de peso */}
                    <span className="size-button-weight">{gender.weight}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="primary-button-section">
            <Button
              onClick={handleNext}
              disabled={!petData.gender}
              className="primary-button"
            >
              Continuar
            </Button>
          </div>
        </div>
      </MobileFrame>
    );
  }

  // Step 4: Weight input
  if (step === 4) {
    // ============================================
    // 🔧 CONFIGURACIÓN DE RANGOS DE PESO POR TAMAÑO
    // ============================================
    // Aquí se definen los rangos mínimos y máximos del slider según el tamaño seleccionado.
    // Puedes modificar estos valores según tus necesidades:
    // - small (Chico): 0 - 14 kg
    // - medium (Mediano): 15 - 25 kg
    // - large (Grande): 26 - 50 kg
    let minWeight = 0;
    let maxWeight = 50;

    if (petData.gender === "small") {
      minWeight = 0;
      maxWeight = 14;
    } else if (petData.gender === "medium") {
      minWeight = 15;
      maxWeight = 25;
    } else if (petData.gender === "large") {
      minWeight = 26;
      maxWeight = 50;
    }
    // ============================================

    return (
      <MobileFrame>
        <div className="page-container" style={{ paddingBottom: "1rem" }}>
          {/* Header with progress */}
          <div className="page-header" style={{ marginBottom: "1rem" }}>
            <div className="page-header-top">
              <button
                onClick={() => setStep(step - 1)}
                className="page-back-button"
              >
                <ArrowLeft className="icon-arrow" />
              </button>
              <div className="page-header-center">
                <h2 className="page-header-title">Agregar mascota</h2>
                <p className="page-header-subtitle">Peso</p>
              </div>
              <div className="page-step-indicator">
                <span className="breed-step-label">Paso</span>
                <span>
                  <span className="breed-step-number">{step}</span>
                  <span className="breed-step-total">/{totalSteps}</span>
                </span>
              </div>
            </div>
            <div className="page-progress-bar">
              <div
                className="page-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Dog image placeholder */}
          <div className="dog-image-wrapper">
            <div className="dog-image-circle">
              <Image
                src={petData.imageURL || perro} // <-- CAMBIO CLAVE
                alt="Dog"
                width={192}
                height={192}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="weight-content">
            <label className="weight-label">
              ¿Cuál es el peso de {petData.name || "Maxi"}?
            </label>

            {/* Recuadro gris con sombra para el ajuste de peso */}
            <div className="weight-container">
              <div className="weight-display">
                <div className="weight-value">{petData.weight}</div>
                <div className="weight-unit">kg</div>
              </div>
              <p className="weight-instruction">
                Ajustá el peso con la barra debajo
              </p>
              {/* Slider de peso con rangos dinámicos según el tamaño */}
              <input
                type="range"
                min={minWeight}
                max={maxWeight}
                step="0.1"
                value={Number.parseFloat(petData.weight.replace(",", "."))}
                onChange={(e) =>
                  setPetData({
                    ...petData,
                    weight: e.target.value.replace(".", ","),
                  })
                }
                className="weight-slider"
              />
            </div>
          </div>

          <div className="weight-button-section">
            <Button onClick={handleNext} className="primary-button">
              Continuar
            </Button>
            <button onClick={handleSkip} className="weight-skip-button">
              No lo sé
            </button>
          </div>
        </div>
      </MobileFrame>
    );
  }

  // Step 5: Birthday input
  if (step === 5) {
    return (
      <MobileFrame>
        <div className="page-container">
          {/* Header with progress */}
          <div className="page-header">
            <div className="page-header-top">
              <button
                onClick={() => setStep(step - 1)}
                className="page-back-button"
              >
                <ArrowLeft className="icon-arrow" />
              </button>
              <div className="page-header-center">
                <h2 className="page-header-title">Agregar mascota</h2>
                <p className="page-header-subtitle">Cumpleaños</p>
              </div>
              <div className="page-step-indicator">
                <span className="breed-step-label">Paso</span>
                <span>
                  <span className="breed-step-number">{step}</span>
                  <span className="breed-step-total">/{totalSteps}</span>
                </span>
              </div>
            </div>
            <div className="page-progress-bar">
              <div className="page-progress-fill" style={{ width: "100%" }} />
            </div>
          </div>

          {/* Dog image placeholder */}
          <div className="dog-image-wrapper">
            <div className="dog-image-circle">
              <Image
                src={petData.imageURL || perro} // <-- CAMBIO CLAVE
                alt="Dog"
                width={192}
                height={192}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="birthday-content">
            <label className="birthday-label">
              ¿Cuándo es el cumpleaños de {petData.name || "Maxi"}?
            </label>
            <div className="birthday-selects">
              <div className="birthday-select-wrapper">
                <label className="birthday-select-label">Mes</label>
                <select
                  className="birthday-select"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                >
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="birthday-select-wrapper">
                <label className="birthday-select-label">Día</label>
                <select
                  className="birthday-select"
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(Number(e.target.value))}
                >
                  {Array.from(
                    { length: getDaysInMonth(selectedMonth, selectedYear) },
                    (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div className="birthday-select-wrapper">
                <label className="birthday-select-label">Año</label>
                <select
                  className="birthday-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                  {Array.from({ length: 21 }, (_, i) => {
                    const year = 2025 - i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Selected Date Display */}
            <div className="birthday-selected-date-container">
              <label className="birthday-selected-date-label">
                Fecha seleccionada
              </label>
              <div className="birthday-selected-date-display">
                {selectedMonth && selectedDay && selectedYear
                  ? `${selectedDay} de ${
                      months.find((m) => m.value === selectedMonth)?.name || ""
                    } de ${selectedYear}`
                  : "Seleccioná una fecha"}
              </div>
            </div>

            {/* Clear Selection */}
            <button
              onClick={() => {
                setSelectedMonth(1);
                setSelectedDay(1);
                setSelectedYear(2025);
              }}
              className="birthday-clear-button"
            >
              Limpiar selección
            </button>
          </div>

          <div className="primary-button-section">
            <Button
              className="primary-button"
              onClick={() => {
                if (onFinish) {
                  const birthdayString =
                    selectedMonth && selectedDay && selectedYear
                      ? `${selectedDay} de ${
                          months.find((m) => m.value === selectedMonth)?.name ||
                          ""
                        } de ${selectedYear}`
                      : "";
                  onFinish({
                    name: petData.name,
                    breed: petData.breed,
                    imageURL: petData.imageURL,
                    sex: petData.sex,
                    gender: petData.gender,
                    weight: petData.weight,
                    birthday: birthdayString,
                  });
                }
              }}
            >
              Finalizar
            </Button>
            <button onClick={handleSkip} className="secondary-button">
              No lo sé
            </button>
          </div>
        </div>
      </MobileFrame>
    );
  }

  // Step 6: Approximate age (when user doesn't know birthday)
  return (
    <MobileFrame>
      <div className="page-container">
        {/* Header with progress */}
        <div className="page-header">
          <div className="page-header-top">
            <button onClick={() => setStep(5)} className="page-back-button">
              <ArrowLeft className="icon-arrow" />
            </button>
            <div className="page-header-center">
              <h2 className="page-header-title">Agregar mascota</h2>
              <p className="page-header-subtitle">Edad aproximada</p>
            </div>
            <div className="page-step-indicator">
              <span className="breed-step-label">Paso</span>
              <span>
                <span className="breed-step-number">5</span>
                <span className="breed-step-total">/{totalSteps}</span>
              </span>
            </div>
          </div>
          <div className="page-progress-bar">
            <div className="page-progress-fill" style={{ width: "100%" }} />
          </div>
        </div>

        {/* Dog image placeholder */}
        <div className="dog-image-wrapper">
          <div className="dog-image-circle">
            <Image
              src={petData.imageURL || perro} // <-- CAMBIO CLAVE
              alt="Dog"
              width={192}
              height={192}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="age-content">
          <label className="age-label">
            ¿Cuál es la edad aproximada de {petData.name || "Maxi"}?
          </label>
          <div className="age-buttons">
            <button
              onClick={() => setApproximateAge("6 meses")}
              className={`age-button ${
                approximateAge === "6 meses"
                  ? "age-button-selected"
                  : "age-button-unselected"
              }`}
            >
              <span className="age-button-text">6 meses</span>
            </button>
            <button
              onClick={() => setApproximateAge("entre 6 meses y 2 años")}
              className={`age-button ${
                approximateAge === "entre 6 meses y 2 años"
                  ? "age-button-selected"
                  : "age-button-unselected"
              }`}
            >
              <span className="age-button-text">Entre 6 meses y 2 años</span>
            </button>
            <button
              onClick={() => setApproximateAge("entre 3 años y 6 años")}
              className={`age-button ${
                approximateAge === "entre 3 años y 6 años"
                  ? "age-button-selected"
                  : "age-button-unselected"
              }`}
            >
              <span className="age-button-text">Entre 3 años y 6 años</span>
            </button>
            <button
              onClick={() => setApproximateAge("más de 6 años")}
              className={`age-button ${
                approximateAge === "más de 6 años"
                  ? "age-button-selected"
                  : "age-button-unselected"
              }`}
            >
              <span className="age-button-text">Más de 6 años</span>
            </button>
          </div>
        </div>

        <div className="primary-button-section">
          <Button
            onClick={() => {
              if (onFinish)
                onFinish({
                  name: petData.name,
                  breed: petData.breed,
                  imageURL: petData.imageURL,
                  sex: petData.sex,
                  gender: petData.gender,
                  weight: petData.weight,
                  approximateAge: approximateAge,
                });
            }}
            disabled={!approximateAge}
            className="primary-button"
          >
            Finalizar
          </Button>
        </div>
      </div>
    </MobileFrame>
  );
}
