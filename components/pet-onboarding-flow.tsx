"use client";

import { useState, useEffect } from "react";
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
import imgIcon from "./images/img-icon.svg";
import perritos from "./images/dos-perros.png";

interface PetOnboardingFlowProps {
  userType: string;
  onBack: () => void;
}

export default function PetOnboardingFlow({
  userType,
  onBack,
}: PetOnboardingFlowProps) {
  const [step, setStep] = useState(userType === "future" ? 0 : 1);
  const [searchBreed, setSearchBreed] = useState("");
  const [petData, setPetData] = useState({
    breed: "",
    name: "",
    gender: "",
    weight: "0,0",
    birthday: "",
  });
  const [selectedMonth, setSelectedMonth] = useState(1); // Enero por defecto
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [approximateAge, setApproximateAge] = useState("");

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

  // Para esta parte hay que sacar la lista completa de razas de algun sitio
  const breeds = [
    "Beagle",
    "Bóxer",
    "Bulldog Francés",
    "Bulldog Inglés",
    "Caniche",
    "Chihuahua",
    "Cocker Spaniel",
    "Dálmata",
    "Doberman",
    "Dogo Argentino",
    "Galgo",
    "Golden Retriever",
    "Labrador Retriever",
    "Mestizo",
    "Pastor Alemán",
    "Pug",
    "Rottweiler",
    "Schnauzer",
    "Shih Tzu",
    "Yorkshire Terrier",
  ].sort((a, b) => a.localeCompare(b, "es"));
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

  // Empty state screen (Uh Oh!)
  if (step === 0) {
    return (
      <MobileFrame>
        <div className="relative h-full flex flex-col bg-white">
          {/* Header Superior */}
          <div className="px-6 pt-14 pb-6 flex justify-between items-center z-10">
            {/* Botón de regreso */}
            <button
              onClick={onBack}
              className="absolute left-6 top-14 text-gray-600 hover:bg-gray-100 p-1 rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            {/* Centro (Logo + Hola, Nombre) */}
            <div className="flex items-center gap-3 mt-15">
              <Image
                src={imgIcon}
                alt="Logo"
                width={34}
                height={34}
                className="rounded-full"
              />
              <span className="text-xl font-semibold text-gray-800">
                Hola, Juan
              </span>
            </div>

            {/* Íconos de Notificación y Menú */}
            <div className="flex items-center gap-4 text-gray-600 absolute right-6 mt-14">
              <Bell className="w-5 h-5 cursor-pointer" />
              <Menu className="w-5 h-5 cursor-pointer" />
            </div>
          </div>

          {/* Contenido Central */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 pt-10 pb-28">
            {/* Imagen */}
            <div className="w-full max-w-xs mb-10 opacity-100">
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
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Uh Oh!</h2>
            <p className="text-gray-500 text-center mb-12 px-6">
              Parece que no tenés mascotas registradas hasta el momento.
            </p>
          </div>

          {/* Botón Flotante Inferior */}
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-[88%]">
            <div className="relative bg-[#2563EB] text-white rounded-full py-2.5 shadow-lg overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full bg-[#1C4EBF]"
                style={{ width: "0%" }}
              />
              <div className="flex items-center justify-center gap-2 pointer-events-none select-none">
                <span className="text-sm font-semibold">
                  ¡Deslizá para agregar a tu mascota!
                </span>
              </div>

              {/* Círculo deslizable */}
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 250 }}
                onDragEnd={(event, info) => {
                  if (info.offset.x > 180) setStep(1);
                }}
                className="absolute top-1/2 left-1.5 transform -translate-y-1/2 bg-white/30 p-2.5 rounded-full cursor-grab active:cursor-grabbing"
              >
                <ArrowRight className="w-4 h-4 text-white" />
              </motion.div>
            </div>
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
        <div className="h-full flex flex-col">
          {/* Header with progress */}
          <div className="px-6 pt-6 pb-3 flex-shrink-0">
            <div className="flex items-start justify-between mb-3">
              <button
                onClick={userType === "future" ? () => setStep(0) : onBack}
                className="mt-1"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div className="text-center flex-1 mt-4">
                <h2 className="text-lg font-bold text-gray-800">
                  Agregar mascota
                </h2>
                <p className="text-gray-400 text-sm">Raza</p>
              </div>
              <div className="text-xs text-right mt-1 flex flex-col items-end">
                <span className="text-gray-800 font-semibold">Paso</span>
                <span>
                  <span className="text-gray-800 font-bold">{step}</span>
                  <span className="text-gray-400">/{totalSteps}</span>
                </span>
              </div>
            </div>
            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{ width: `${progress}%`, backgroundColor: "#31AA7A" }}
              />
            </div>
          </div>

          {/* Breed list */}
          <div
            className="px-6 py-4 overflow-y-auto space-y-3"
            style={{ height: "380px", minHeight: "380px", maxHeight: "380px" }}
          >
            {filteredBreeds.length > 0 ? (
              filteredBreeds.map((breed) => (
                <button
                  key={breed}
                  onClick={() => {
                    setPetData({ ...petData, breed });
                  }}
                  className={`w-full py-4 px-4 bg-white border-2 rounded-xl text-center transition-colors shadow-sm ${
                    petData.breed === breed
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-500 hover:bg-blue-50"
                  }`}
                >
                  <span className="text-gray-700 font-medium">{breed}</span>
                </button>
              ))
            ) : (
              <p className="text-center text-gray-400 py-8">
                No se encontraron razas
              </p>
            )}
          </div>

          {/* Search bar and button */}
          <div className="px-6 pt-6 pb-6 flex-shrink-0 bg-white border-t border-gray-100">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
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
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-4 rounded-xl font-medium"
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
        <div className="px-6 pt-8 pb-6 h-full flex flex-col">
          {/* Header with progress */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-3">
              <button onClick={() => setStep(step - 1)} className="mt-1">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div className="text-center flex-1 mt-4">
                <h2 className="text-lg font-bold text-gray-800">
                  Agregar mascota
                </h2>
                <p className="text-gray-400 text-sm">Nombre</p>
              </div>
              <div className="text-xs text-right mt-1 flex flex-col items-end">
                <span className="text-gray-800 font-semibold">Paso</span>
                <span>
                  <span className="text-gray-800 font-bold">{step}</span>
                  <span className="text-gray-400">/{totalSteps}</span>
                </span>
              </div>
            </div>
            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{ width: `${progress}%`, backgroundColor: "#31AA7A" }}
              />
            </div>
          </div>

          {/* Dog image placeholder */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 mb-3">
              <img
                src="/cute-brown-and-white-dog-portrait.jpg"
                alt="Dog"
                className="w-full h-full object-cover"
              />
            </div>
            <button className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors shadow-md">
              <Image
                src={imgIcon}
                alt="Agregar imagen"
                width={20}
                height={20}
              />
            </button>
          </div>

          <div className="flex-1">
            <label className="block text-gray-700 font-medium mb-3 text-center">
              ¿Cómo se llama tu mascota?
            </label>
            <Input
              placeholder="[Maxi]"
              value={petData.name}
              onChange={(e) => setPetData({ ...petData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg"
            />
          </div>

          <div className="space-y-3 mt-auto pt-4">
            <Button
              onClick={handleNext}
              disabled={!petData.name}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-4 rounded-xl font-medium"
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
        <div className="px-6 pt-8 pb-6 h-full flex flex-col">
          {/* Header with progress */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-3">
              <button onClick={() => setStep(step - 1)} className="mt-1">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div className="text-center flex-1 mt-4">
                <h2 className="text-lg font-bold text-gray-800">
                  Agregar mascota
                </h2>
                <p className="text-gray-400 text-sm">Tamaño</p>
              </div>
              <div className="text-xs text-right mt-1 flex flex-col items-end">
                <span className="text-gray-800 font-semibold">Paso</span>
                <span>
                  <span className="text-gray-800 font-bold">{step}</span>
                  <span className="text-gray-400">/{totalSteps}</span>
                </span>
              </div>
            </div>
            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{ width: `${progress}%`, backgroundColor: "#31AA7A" }}
              />
            </div>
          </div>

          {/* Dog image placeholder */}
          <div className="flex justify-center mb-8">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
              <img
                src="/cute-brown-and-white-dog-portrait.jpg"
                alt="Dog"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-gray-700 font-medium mb-4 text-center">
              ¿Cuál es el tamaño de {petData.name || "Maxi"}?
            </label>
            <div className="grid grid-cols-3 gap-3 mb-6">
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
                  className={`py-6 px-3 rounded-2xl text-center transition-all ${
                    petData.gender === gender.value
                      ? "bg-white border-2 border-blue-500 shadow-lg shadow-blue-200"
                      : "bg-gray-50 border-2 border-gray-200 hover:border-blue-300 hover:shadow-md"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    {/* Círculo con ícono de perro */}
                    <div
                      className={`mb-3 rounded-full bg-gray-200 flex items-center justify-center ${
                        gender.value === "small"
                          ? "w-16 h-16"
                          : gender.value === "medium"
                          ? "w-16 h-16"
                          : "w-16 h-16"
                      }`}
                    >
                      <Dog className={`text-gray-500 ${gender.iconSize}`} />
                    </div>
                    {/* Título */}
                    <span className="text-gray-700 font-semibold text-base mb-1">
                      {gender.label}
                    </span>
                    {/* Rango de peso */}
                    <span className="text-gray-400 text-xs">
                      {gender.weight}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 mt-auto pt-4">
            <Button
              onClick={handleNext}
              disabled={!petData.gender}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-4 rounded-xl font-medium"
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
        <div className="px-6 pt-8 pb-6 h-full flex flex-col">
          {/* Header with progress */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-3">
              <button onClick={() => setStep(step - 1)} className="mt-1">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div className="text-center flex-1 mt-4">
                <h2 className="text-lg font-bold text-gray-800">
                  Agregar mascota
                </h2>
                <p className="text-gray-400 text-sm">Peso</p>
              </div>
              <div className="text-xs text-right mt-1 flex flex-col items-end">
                <span className="text-gray-800 font-semibold">Paso</span>
                <span>
                  <span className="text-gray-800 font-bold">{step}</span>
                  <span className="text-gray-400">/{totalSteps}</span>
                </span>
              </div>
            </div>
            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{ width: `${progress}%`, backgroundColor: "#31AA7A" }}
              />
            </div>
          </div>

          {/* Dog image placeholder */}
          <div className="flex justify-center mb-8">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
              <img
                src="/cute-brown-and-white-dog-portrait.jpg"
                alt="Dog"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-gray-700 font-medium mb-4 text-center">
              ¿Cuál es el peso de {petData.name || "Maxi"}?
            </label>

            {/* Recuadro gris con sombra para el ajuste de peso */}
            <div className="bg-gray-50 rounded-2xl p-6 shadow-md mb-8">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-blue-600 mb-2">
                  {petData.weight}
                </div>
                <div className="text-gray-500">kg</div>
              </div>
              <p className="text-center text-gray-400 text-sm mb-4">
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
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>

          <div className="space-y-3 mt-auto pt-4">
            <Button
              onClick={handleNext}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-medium"
            >
              Continuar
            </Button>
            <button
              onClick={handleSkip}
              className="w-full text-gray-500 text-sm py-2"
            >
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
        <div className="px-6 pt-8 pb-6 h-full flex flex-col">
          {/* Header with progress */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-3">
              <button onClick={() => setStep(step - 1)} className="mt-1">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div className="text-center flex-1 mt-4">
                <h2 className="text-lg font-bold text-gray-800">
                  Agregar mascota
                </h2>
                <p className="text-gray-400 text-sm">Cumpleaños</p>
              </div>
              <div className="text-xs text-right mt-1 flex flex-col items-end">
                <span className="text-gray-800 font-semibold">Paso</span>
                <span>
                  <span className="text-gray-800 font-bold">{step}</span>
                  <span className="text-gray-400">/{totalSteps}</span>
                </span>
              </div>
            </div>
            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{ width: "100%", backgroundColor: "#31AA7A" }}
              />
            </div>
          </div>

          {/* Dog image placeholder */}
          <div className="flex justify-center mb-8">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
              <img
                src="/cute-brown-and-white-dog-portrait.jpg"
                alt="Dog"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-gray-700 font-medium mb-4 text-center">
              ¿Cuándo es el cumpleaños de {petData.name || "Maxi"}?
            </label>
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div>
                <label className="block text-xs text-gray-500 mb-2">Mes</label>
                <select
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
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
              <div>
                <label className="block text-xs text-gray-500 mb-2">Día</label>
                <select
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
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
              <div>
                <label className="block text-xs text-gray-500 mb-2">Año</label>
                <select
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                  {Array.from({ length: 20 }, (_, i) => (
                    <option key={2024 - i} value={2024 - i}>
                      {2024 - i}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-3 mt-auto pt-4">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-medium">
              Finalizar
            </Button>
            <button
              onClick={handleSkip}
              className="w-full text-gray-500 text-sm py-2"
            >
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
      <div className="px-6 pt-8 pb-6 h-full flex flex-col">
        {/* Header with progress */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-3">
            <button onClick={() => setStep(5)} className="mt-1">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="text-center flex-1 mt-4">
              <h2 className="text-lg font-bold text-gray-800">
                Agregar mascota
              </h2>
              <p className="text-gray-400 text-sm">Edad aproximada</p>
            </div>
            <div className="text-xs text-right mt-1 flex flex-col items-end">
              <span className="text-gray-800 font-semibold">Paso</span>
              <span>
                <span className="text-gray-800 font-bold">5</span>
                <span className="text-gray-400">/{totalSteps}</span>
              </span>
            </div>
          </div>
          <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{ width: "100%", backgroundColor: "#31AA7A" }}
            />
          </div>
        </div>

        {/* Dog image placeholder */}
        <div className="flex justify-center mb-8">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
            <img
              src="/cute-brown-and-white-dog-portrait.jpg"
              alt="Dog"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-gray-700 font-medium mb-6 text-center">
            ¿Cuál es la edad aproximada de {petData.name || "Maxi"}?
          </label>
          <div className="space-y-3">
            <button
              onClick={() => setApproximateAge("6 meses")}
              className={`w-full py-4 px-4 bg-white border-2 rounded-xl text-center transition-colors shadow-sm ${
                approximateAge === "6 meses"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-500 hover:bg-blue-50"
              }`}
            >
              <span className="text-gray-700 font-medium">6 meses</span>
            </button>
            <button
              onClick={() => setApproximateAge("entre 6 meses y 2 años")}
              className={`w-full py-4 px-4 bg-white border-2 rounded-xl text-center transition-colors shadow-sm ${
                approximateAge === "entre 6 meses y 2 años"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-500 hover:bg-blue-50"
              }`}
            >
              <span className="text-gray-700 font-medium">
                Entre 6 meses y 2 años
              </span>
            </button>
            <button
              onClick={() => setApproximateAge("entre 3 años y 6 años")}
              className={`w-full py-4 px-4 bg-white border-2 rounded-xl text-center transition-colors shadow-sm ${
                approximateAge === "entre 3 años y 6 años"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-500 hover:bg-blue-50"
              }`}
            >
              <span className="text-gray-700 font-medium">
                Entre 3 años y 6 años
              </span>
            </button>
            <button
              onClick={() => setApproximateAge("más de 6 años")}
              className={`w-full py-4 px-4 bg-white border-2 rounded-xl text-center transition-colors shadow-sm ${
                approximateAge === "más de 6 años"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-500 hover:bg-blue-50"
              }`}
            >
              <span className="text-gray-700 font-medium">Más de 6 años</span>
            </button>
          </div>
        </div>

        <div className="space-y-3 mt-auto pt-4">
          <Button
            onClick={() => {
              /* Finalizar */
            }}
            disabled={!approximateAge}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-4 rounded-xl font-medium"
          >
            Finalizar
          </Button>
        </div>
      </div>
    </MobileFrame>
  );
}
