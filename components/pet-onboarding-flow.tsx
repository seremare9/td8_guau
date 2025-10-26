"use client";

import { useState } from "react";
import MobileFrame from "./mobile-frame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Plus } from "lucide-react";

/*import iconUser from "./images/Icon.png"; */

interface PetOnboardingFlowProps {
  userType: string;
  onBack: () => void;
}

export default function PetOnboardingFlow({
  userType,
  onBack,
}: PetOnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [petData, setPetData] = useState({
    breed: "",
    name: "",
    gender: "",
    weight: "0,0",
    birthday: "",
  });

  const breeds = [
    "Mestizo",
    "Bulldog Francés",
    "Bulldog Inglés",
    "Caniche",
    "Chihuahua",
  ];
  const genders = [
    { label: "Chico", value: "small" },
    { label: "Mediano", value: "medium" },
    { label: "Grande", value: "large" },
  ];

  const totalSteps = 5;
  const progress = ((step + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps - 1) {
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
  if (step === 0 || step === 1) {
    return (
      <MobileFrame>
        <div className="px-6 pt-8 pb-6 h-full flex flex-col">
          {/* Header with progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <button onClick={step === 0 ? onBack : () => setStep(step - 1)}>
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <span className="text-sm text-gray-500">
                Paso {step + 1}/{totalSteps}
              </span>
            </div>
            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Agregar mascota
          </h2>

          {/* Search bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar por raza"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg"
            />
          </div>

          {/* Breed list */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-6">
            {breeds.map((breed) => (
              <button
                key={breed}
                onClick={() => {
                  setPetData({ ...petData, breed });
                  handleNext();
                }}
                className="w-full py-4 px-4 border border-gray-200 rounded-lg text-left hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <span className="text-gray-700 font-medium">{breed}</span>
              </button>
            ))}
          </div>

          <Button
            onClick={handleNext}
            disabled={!petData.breed}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-4 rounded-xl font-medium"
          >
            Continuar
          </Button>
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
                Paso {step + 1}/{totalSteps}
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
            <label className="block text-gray-700 font-medium mb-3">
              ¿Cómo se llama tu mascota?
            </label>
            <Input
              placeholder="[Maxi]"
              value={petData.name}
              onChange={(e) => setPetData({ ...petData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg mb-6"
            />
          </div>

          <Button
            onClick={handleNext}
            disabled={!petData.name}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-4 rounded-xl font-medium"
          >
            Continuar
          </Button>
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
                Paso {step + 1}/{totalSteps}
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
              ¿Cuál es el sexo de {petData.name || "Maxi"}?
            </label>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {genders.map((gender) => (
                <button
                  key={gender.value}
                  onClick={() => {
                    setPetData({ ...petData, gender: gender.value });
                    handleNext();
                  }}
                  className={`py-4 px-3 border-2 rounded-xl text-center transition-colors ${
                    petData.gender === gender.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <span className="text-gray-700 font-medium text-sm">
                    {gender.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleNext}
            disabled={!petData.gender}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-4 rounded-xl font-medium"
          >
            Continuar
          </Button>
        </div>
      </MobileFrame>
    );
  }

  // Step 4: Weight input
  if (step === 4) {
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
                Paso {step + 1}/{totalSteps}
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
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-blue-600 mb-2">
                {petData.weight}
              </div>
              <div className="text-gray-500">kg</div>
            </div>
            <p className="text-center text-gray-400 text-sm mb-4">
              No hay ningún peso que sea muy grande o muy chico para las fichas
            </p>
            <input
              type="range"
              min="0"
              max="50"
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

          <div className="space-y-3">
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
              Paso {totalSteps}/{totalSteps}
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

        <div className="space-y-3">
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
