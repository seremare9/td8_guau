"use client";

import { useState, useEffect } from "react";
import MobileFrame from "./mobile-frame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Plus, Dog } from "lucide-react";
import Image from "next/image";
import imgIcon from "./images/img-icon.svg";

/*import iconUser from "./images/Icon.png"; */

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

  // Para esta parte hay que sacar la lista completa de razas de algun sitio
  const breeds = [
    "Mestizo",
    "Bulldog Francés",
    "Bulldog Inglés",
    "Caniche",
    "Chihuahua",
    "Dálmata",
    "Doberman",
    "Dogo Argentino",
    "Galgo",
    "Golden Retriever",
    "Labrador Retriever",
    "Pastor Alemán",
    "Pug",
    "Rottweiler",
    "Schnauzer",
    "Shih Tzu",
    "Yorkshire Terrier",
    "Beagle",
    "Bóxer",
    "Cocker Spaniel"
  ];
  // ============================================
  // 🔧 CONFIGURACIÓN DE TAMAÑOS DE MASCOTAS
  // ============================================
  // Opciones de tamaño con sus rangos de peso y tamaños de ícono
  // Puedes modificar los rangos de peso y el tamaño de los íconos:
  const genders = [
    { label: "Chico", value: "small", weight: "0 - 14kg", iconSize: "w-8 h-8" },
    { label: "Mediano", value: "medium", weight: "15 - 25kg", iconSize: "w-10 h-10" },
    { label: "Grande", value: "large", weight: "Más de 25kg", iconSize: "w-12 h-12" },
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
        defaultWeight = "0,0";  // Peso inicial para Chico
      } else if (petData.gender === "medium") {
        defaultWeight = "15,0"; // Peso inicial para Mediano
      } else if (petData.gender === "large") {
        defaultWeight = "26,0"; // Peso inicial para Grande
      }
      setPetData(prev => ({ ...prev, weight: defaultWeight }));
    }
  }, [step]);
  // ============================================

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleSkip = () => {
    setStep(totalSteps);
  };

  // Empty state screen
  if (step === 0 && userType === "future") {
    return (
      <MobileFrame>
        <div className="px-6 pt-12 pb-6 h-full flex flex-col items-center justify-center">
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-48 h-48 mb-8">
              <img
                src="/cute-cartoon-dogs-silhouettes-in-gray.jpg"
                alt="Dogs illustration"
                className="w-full h-full object-contain opacity-30"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Uh Oh!</h2>
            <p className="text-gray-500 text-center mb-8 px-4">
              Parece que no tienes mascotas registradas hasta el momento
            </p>
          </div>
          <Button
            onClick={() => setStep(1)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            ¡Empieza para agregar a tu mascota!
          </Button>
        </div>
      </MobileFrame>
    );
  }

  // Step 1: Breed selection
  if (step === 1) {
    // Filtrar razas según la búsqueda
    const filteredBreeds = breeds.filter(breed =>
      breed.toLowerCase().includes(searchBreed.toLowerCase())
    );

    return (
      <MobileFrame>
        <div className="h-full flex flex-col">
          {/* Header with progress */}
          <div className="px-6 pt-6 pb-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <button onClick={userType === "future" ? () => setStep(0) : onBack}>
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <span className="text-sm text-gray-500">
                Paso {step}/{totalSteps}
              </span>
            </div>
            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-teal-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <h2 className="text-xl font-bold text-gray-800 text-center mb-1">
              Agregar mascota
            </h2>
            <p className="text-gray-500 text-center text-sm">Raza</p>
          </div>

          {/* Breed list */}
          <div className="px-6 overflow-y-auto space-y-3" style={{ maxHeight: '340px' }}>
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
              <p className="text-center text-gray-400 py-8">No se encontraron razas</p>
            )}
          </div>

          {/* Search bar and button */}
          <div className="px-6 pt-4 pb-6 flex-shrink-0 bg-white">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar por raza"
                value={searchBreed}
                onChange={(e) => setSearchBreed(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg"
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
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setStep(step - 1)}>
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <span className="text-sm text-gray-500">
                Paso {step}/{totalSteps}
              </span>
            </div>
            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Agregar mascota
          </h2>
          <p className="text-gray-500 mb-8">Tu mascota es...</p>

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
            <label className="block text-gray-700 font-medium mb-3">
              ¿Cómo se llama tu mascota?
            </label>
            <Input
              placeholder="[Maxi]"
              value={petData.name}
              onChange={(e) => setPetData({ ...petData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg"
            />
          </div>

          <div className="space-y-3 mt-4">
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
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setStep(step - 1)}>
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <span className="text-sm text-gray-500">
                Paso {step}/{totalSteps}
              </span>
            </div>
            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Agregar mascota
          </h2>
          <p className="text-gray-500 mb-8">Tu mascota es...</p>

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
            <label className="block text-gray-700 font-medium mb-4">
              ¿Cuál es el tamaño de {petData.name || "Maxi"}?
            </label>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {genders.map((gender) => (
                <button
                  key={gender.value}
                  onClick={() => {
                    setPetData({ ...petData, gender: gender.value, weight: "0,0" });
                  }}
                  className={`py-6 px-3 rounded-2xl text-center transition-all ${
                    petData.gender === gender.value
                      ? "bg-white border-2 border-blue-500 shadow-lg shadow-blue-200"
                      : "bg-gray-50 border-2 border-gray-200 hover:border-blue-300 hover:shadow-md"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    {/* Círculo con ícono de perro */}
                    <div className={`mb-3 rounded-full bg-gray-200 flex items-center justify-center ${
                      gender.value === "small" ? "w-16 h-16" : 
                      gender.value === "medium" ? "w-16 h-16" : 
                      "w-16 h-16"
                    }`}>
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

          <div className="space-y-3 mt-4">
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
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setStep(step - 1)}>
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <span className="text-sm text-gray-500">
                Paso {step}/{totalSteps}
              </span>
            </div>
            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Agregar mascota
          </h2>
          <p className="text-gray-500 mb-8">Tu mascota es...</p>

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
            <label className="block text-gray-700 font-medium mb-4">
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

          <div className="space-y-3 mt-4">
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
  return (
    <MobileFrame>
      <div className="px-6 pt-8 pb-6 h-full flex flex-col">
        {/* Header with progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setStep(step - 1)}>
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <span className="text-sm text-gray-500">
              Paso {step}/{totalSteps}
            </span>
          </div>
          <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500 transition-all duration-300"
              style={{ width: "100%" }}
            />
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Agregar mascota
        </h2>
        <p className="text-gray-500 mb-8">Tu mascota es...</p>

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
          <label className="block text-gray-700 font-medium mb-4">
            ¿Cuándo es el cumpleaños de {petData.name || "Maxi"}?
          </label>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div>
              <label className="block text-xs text-gray-500 mb-2">Mes</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                <option>Enero</option>
                <option>Febrero</option>
                <option>Marzo</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-2">Día</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-2">Año</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                {Array.from({ length: 20 }, (_, i) => (
                  <option key={2024 - i}>{2024 - i}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-3 mt-4">
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
