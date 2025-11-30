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
import perro from "../images/default-pet-pic.png";
import "../styles/onboarding-flow-styles.css";
import { HomeHeader } from "@/components/screens/home-screen";

interface PetOnboardingFlowProps {
  userType: string;
  userName?: string;
  onBack: () => void;
  initialStep?: number;
  // Propiedad para indicar si viene del menú (para agregar nueva mascota)
  fromMenu?: boolean;
  onOpenMenu?: () => void;
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
  initialStep, 
  fromMenu = false, 
  onOpenMenu, 
}: PetOnboardingFlowProps) {
  const defaultInitialStep = userType === "future" ? 0 : 1;
  const [step, setStep] = useState(
    initialStep !== undefined ? initialStep : defaultInitialStep
  );
  const [searchBreed, setSearchBreed] = useState("");
  const [petData, setPetData] = useState({
    breed: "",
    name: "",
    sex: "", 
    gender: "", 
    weight: "0,0",
    birthday: "",
    imageURL: "",
  });
  const [selectedMonth, setSelectedMonth] = useState(1); 
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [approximateAge, setApproximateAge] = useState("");
  const [breeds, setBreeds] = useState<string[]>([]);
  const [isLoadingBreeds, setIsLoadingBreeds] = useState(true);

  // Referencia para el input de archivo 
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Función para manejar la selección de imagen
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        // Compresión de la imagen
        const { compressImage } = await import("@/lib/utils");
        const compressedImage = await compressImage(file, 1920, 1920, 0.8);
        setPetData((prev) => ({ ...prev, imageURL: compressedImage }));
      } catch (error) {
        console.error("Error al procesar la imagen:", error);
        alert("Error al procesar la imagen. Por favor, intenta con una imagen más pequeña.");
      }
    }
  };

  // Función para calcular el número de días en un mes
  const getDaysInMonth = (month: number, year: number) => {
    if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
      return 31;
    }
    if ([4, 6, 9, 11].includes(month)) {
      return 30;
    }
    if (month === 2) {
      // Año bisiesto si es divisible por 4
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
  // Las razas se ordenan alfabéticamente automáticamente
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
        
        // Separar "Mestizo" del resto de las razas
        const mestizoIndex = breedsList.findIndex(breed => 
          breed.toLowerCase() === "mestizo"
        );
        const mestizo = mestizoIndex !== -1 ? breedsList[mestizoIndex] : null;
        const otherBreeds = breedsList.filter((_, index) => index !== mestizoIndex);
        
        // Ordenar el resto alfabéticamente 
        const sortedOtherBreeds = otherBreeds.sort((a, b) => 
          a.localeCompare(b, "es", { sensitivity: "base" })
        );
        
        // Poner "Mestizo" primero, luego el resto ordenado alfabéticamente
        const sortedBreeds = mestizo 
          ? [mestizo, ...sortedOtherBreeds]
          : sortedOtherBreeds;
        
        setBreeds(sortedBreeds);
      } catch (error) {
        console.error("Error cargando razas:", error);
        // Lista básica por si falla la carga del csv
        const fallbackBreedsList = [
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
        ];
        
        // Separar "Mestizo" del resto
        const mestizoIndex = fallbackBreedsList.findIndex(breed => 
          breed.toLowerCase() === "mestizo"
        );
        const mestizo = mestizoIndex !== -1 ? fallbackBreedsList[mestizoIndex] : null;
        const otherFallbackBreeds = fallbackBreedsList.filter((_, index) => index !== mestizoIndex);
        
        const sortedOtherFallbackBreeds = otherFallbackBreeds.sort((a, b) => 
          a.localeCompare(b, "es", { sensitivity: "base" })
        );
        
        // Poner "Mestizo" primero
        const fallbackBreeds = mestizo 
          ? [mestizo, ...sortedOtherFallbackBreeds]
          : sortedOtherFallbackBreeds;
        
        setBreeds(fallbackBreeds);
      } finally {
        setIsLoadingBreeds(false);
      }
    };
    loadBreeds();
  }, []);

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
 

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  // Peso inicial por tamaño (se puede modificar)
  useEffect(() => {
    if (step === 4 && petData.gender && petData.weight === "0,0") {
      let defaultWeight = "0,0";
      if (petData.gender === "small") {
        defaultWeight = "0,0"; 
      } else if (petData.gender === "medium") {
        defaultWeight = "15,0"; 
      } else if (petData.gender === "large") {
        defaultWeight = "26,0"; 
      }
      setPetData((prev) => ({ ...prev, weight: defaultWeight }));
    }
  }, [step]);

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

  // Pantalla que aparece cuando no hay perros registrados
  if (step === 0) {
    return (
      <MobileFrame>
        <div className="empty-state-container">
          <div className="empty-state-header-wrapper">
            <HomeHeader userName={userName} onOpenMenu={onOpenMenu} />
          </div>
          <div className="empty-state-content">
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

            <h2 className="empty-state-title">Oh Oh!</h2>
            <p className="empty-state-text">
              Parece que no tenés mascotas registradas hasta el momento
            </p>
          </div>

          <div className="empty-state-button-wrapper">
            <Button
              onClick={() => setStep(1)} 
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

  // Paso 1: Selección de raza
  if (step === 1) {
    const filteredBreedsList = breeds.filter((breed) =>
      breed.toLowerCase().includes(searchBreed.toLowerCase())
    );
    
    // Asegurar que "Mestizo" aparezca primero si está en los resultados filtrados
    const mestizoInFiltered = filteredBreedsList.find(breed => 
      breed.toLowerCase() === "mestizo"
    );
    const otherFilteredBreeds = filteredBreedsList.filter(breed => 
      breed.toLowerCase() !== "mestizo"
    );
    
    const filteredBreeds = mestizoInFiltered
      ? [mestizoInFiltered, ...otherFilteredBreeds]
      : filteredBreedsList;

    return (
      <MobileFrame>
        <div className="breed-container">
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

          {/* Lista de razas */}
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

  // Paso 2: Nombre 
  if (step === 2) {
    return (
      <MobileFrame>
        <div className="name-container">
         
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

          <div className="name-dog-image-wrapper">
           
            <input
              type="file"
              ref={fileInputRef} 
              accept="image/*"
              onChange={handleImageChange} 
              style={{ display: "none" }}
            />

            <div className="name-dog-image-container">
              <div className="name-dog-image-circle">
                {petData.imageURL ? (
                
                  <Image
                    src={petData.imageURL} 
                    alt="Foto de la mascota"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  // Imagen por defecto
                  <Image
                    src={perro}
                    alt="Perro de ejemplo"
                    width={200}
                    height={200}
                  />
                )}
              </div>

              <button
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

          <div className="name-content">
            <label className="name-label">¿Cómo se llama tu mascota?</label>
            <Input
              placeholder="Nombre"
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

  // Paso 3: Selección de tamaño
  if (step === 3) {
    return (
      <MobileFrame>
        <div className="page-container">
       
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

          <div className="dog-image-wrapper">
            <div className="dog-image-circle">
              <Image
                src={petData.imageURL || perro} 
                alt="Dog"
                width={192}
                height={192}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="size-content">
            <label className="size-label">
              ¿Cuál es el tamaño de <strong>{petData.name || "Maxi"}</strong>?
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
                
                    <div className="size-button-icon-circle">
                      <Dog className={`text-gray-500 ${gender.iconSize}`} />
                    </div>
               
                    <span className="size-button-label">{gender.label}</span>
               
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

  // Paso 4: Peso
  if (step === 4) {
 
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
   

    return (
      <MobileFrame>
        <div className="page-container" style={{ paddingBottom: "1rem" }}>
        
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

          <div className="dog-image-wrapper">
            <div className="dog-image-circle">
              <Image
                src={petData.imageURL || perro} 
                alt="Dog"
                width={192}
                height={192}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="weight-content">
            <label className="weight-label">
              ¿Cuál es el peso de <strong>{petData.name || "Maxi"}</strong>?
            </label>

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

  // Paso 5: Cumpleaños
  if (step === 5) {
    return (
      <MobileFrame>
        <div className="page-container">
         
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

        
          <div className="dog-image-wrapper">
            <div className="dog-image-circle">
              <Image
                src={petData.imageURL || perro} 
                alt="Dog"
                width={192}
                height={192}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="birthday-content">
            <label className="birthday-label">
              ¿Cuándo es el cumpleaños de <strong>{petData.name || "Maxi"}</strong>?
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

  // Paso 6: Edad aproximada (si no se sabe el cumpleaños)
  return (
    <MobileFrame>
      <div className="page-container">
       
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

        
        <div className="dog-image-wrapper">
          <div className="dog-image-circle">
            <Image
              src={petData.imageURL || perro} 
              alt="Dog"
              width={192}
              height={192}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="age-content">
          <label className="age-label">
            ¿Cuál es la edad aproximada de <strong>{petData.name || "Maxi"}</strong>?
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
