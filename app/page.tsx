"use client";

import { useState } from "react";
import OnboardingScreen from "@/components/onboarding-screen";
import LoginScreen from "@/components/inicio";
import RegisterScreen from "@/components/register-screen";
import UserTypeScreen from "@/components/user-type-screen";
import PetOnboardingFlow from "@/components/pet-onboarding-flow";
import PetExperienceScreen from "@/components/pet-experience-screen";
import HomeScreen from "@/components/home-screen";
import MenuScreen from "@/components/menu";
import PetProfile from "@/components/pet-profile";
import Vaccines from "@/components/vaccines";

// Las importaciones de componentes deben usar mayúscula inicial para JSX
import MedicinaInfoScreen from "@/components/Preguntas/medicinaInfo-screen";
import VacunaInfoScreen from "@/components/Preguntas/vacunaInfo-screen";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<
    | "onboarding"
    | "login"
    | "register"
    | "userType"
    | "petExperience"
    | "petOnboarding"
    | "vacunaInfo"
    | "medicinaInfo"
    | "home"
    | "menu"
    | "petProfile"
    | "vaccines"
  >("onboarding");

  const [userType, setUserType] = useState<string>("");
  const [userName, setUserName] = useState<string>("User");
  // Nuevo estado para controlar el paso inicial de PetOnboardingFlow
  const [petOnboardingStartStep, setPetOnboardingStartStep] = useState<
    number | undefined
  >(undefined);
  // Estado para guardar los datos de la mascota (incluyendo la imagen)
  const [petData, setPetData] = useState<{ 
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
  } | null>(null);

  const navigateToLogin = () => setCurrentScreen("login");
  const navigateToRegister = () => setCurrentScreen("register");
  const navigateToUserType = () => setCurrentScreen("userType");

  const navigateToVacunaInfo = () => setCurrentScreen("vacunaInfo");
  const navigateToMedicinaInfo = () => setCurrentScreen("medicinaInfo");
  const navigateToHome = () => setCurrentScreen("home");
  const navigateToMenu = () => setCurrentScreen("menu");
  const navigateToPetProfile = () => setCurrentScreen("petProfile");
  const navigateToVaccines = () => setCurrentScreen("vaccines");

  // Nueva función: Navega al flujo de onboarding forzando el paso 0 ("Oh Oh!")
  const navigateToEmptyPetList = () => {
    // Forzamos el paso 0 para mostrar la pantalla "Oh Oh!"
    setPetOnboardingStartStep(0);
    setCurrentScreen("petOnboarding");
  };

  const navigateToPetOnboarding = (type: string) => {
    setUserType(type);
    setPetOnboardingStartStep(undefined); // Limpiar el estado
    if (type === "future" || type === "adopted") {
      setCurrentScreen("petExperience");
    } else {
      // Tutor actual siempre debe empezar en el paso 1 (Registro)
      setPetOnboardingStartStep(1);
      setCurrentScreen("petOnboarding");
    }
  };

  const handlePetExperience = (hasExperience: boolean) => {
    console.log("[v0] Pet experience:", hasExperience);
    if (hasExperience) {
      // Si tiene experiencia (Sí), va directo al flujo de mascota
      setCurrentScreen("petOnboarding");
    } else {
      // Si NO tiene experiencia (No), va a la primera pantalla de información
      setCurrentScreen("vacunaInfo");
    }
  };

  const navigateBack = () => {
    if (currentScreen === "register") {
      setCurrentScreen("login");
    } else if (currentScreen === "login") {
      setCurrentScreen("onboarding");
    } else if (currentScreen === "userType") {
      setCurrentScreen("login");
    } else if (currentScreen === "petExperience") {
      setCurrentScreen("userType");
    } else if (currentScreen === "vacunaInfo") {
      setCurrentScreen("petExperience"); // Regresa de vacunas a experiencia
    } else if (currentScreen === "medicinaInfo") {
      setCurrentScreen("vacunaInfo"); // Regresa de medicinas a vacunas
    } else if (currentScreen === "petOnboarding") {
      // Si el paso inicial fue 0 (Oh Oh!) significa que vino de info screens o directamente como future.
      // Regresar a la pantalla de experiencia si es future/adopted, o userType si es Tutor actual.
      if (userType === "future" || userType === "adopted") {
        setCurrentScreen("petExperience");
      } else {
        setCurrentScreen("userType");
      }
      setPetOnboardingStartStep(undefined); // Limpiar el estado al retroceder
    } else if (currentScreen === "petProfile") {
      // Regresar a home (puedes mejorar esto guardando la pantalla anterior)
      setCurrentScreen("home");
    } else if (currentScreen === "vaccines") {
      setCurrentScreen("petProfile");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentScreen === "onboarding" && (
        <OnboardingScreen onGetStarted={navigateToLogin} />
      )}
      {currentScreen === "login" && (
        <LoginScreen
          onCreateAccount={navigateToRegister}
          onBack={navigateBack}
          onLogin={() => {
            setUserName("User");
            navigateToUserType();
          }}
        />
      )}
      {currentScreen === "register" && (
        <RegisterScreen
          onBack={navigateBack}
          onRegister={(name: string) => {
            setUserName(name || "User");
            navigateToUserType();
          }}
        />
      )}
      {currentScreen === "userType" && (
        <UserTypeScreen onSelectType={navigateToPetOnboarding} />
      )}
      {currentScreen === "petExperience" && (
        <PetExperienceScreen
          onBack={navigateBack}
          onSelectExperience={handlePetExperience}
        />
      )}
      {currentScreen === "petOnboarding" && (
        <PetOnboardingFlow
          userType={userType}
          userName={userName}
          onBack={navigateBack}
          onFinish={(data) => {
            setPetData(data);
            navigateToHome();
          }}
          // Pasar el paso inicial solo si está definido
          initialStep={petOnboardingStartStep}
        />
      )}
      {currentScreen === "home" && (
        <HomeScreen userName={userName} onOpenMenu={navigateToMenu} petData={petData} onOpenPetProfile={navigateToPetProfile} />
      )}
      {currentScreen === "menu" && (
        <MenuScreen userName={userName} onClose={navigateToHome} petData={petData} onOpenPetProfile={navigateToPetProfile} />
      )}
      {currentScreen === "petProfile" && (
        <PetProfile 
          userName={userName} 
          petData={petData} 
          onBack={navigateBack}
          onUpdatePetData={(updatedPetData) => setPetData(updatedPetData)}
          onOpenVaccines={navigateToVaccines}
        />
      )}
      {currentScreen === "vaccines" && (
        <Vaccines
          userName={userName}
          petData={petData}
          onBack={navigateBack}
          onUpdatePetData={(updatedPetData) => setPetData(updatedPetData)}
        />
      )}
      {currentScreen === "vacunaInfo" && (
        <VacunaInfoScreen
          onNext={navigateToMedicinaInfo}
          onSkip={navigateToHome}
          onBack={navigateBack}
        />
      )}
      {currentScreen === "medicinaInfo" && (
        <MedicinaInfoScreen
          onNext={navigateToEmptyPetList}
          onSkip={navigateToEmptyPetList}
          onBack={navigateBack}
        />
      )}
    </div>
  );
}
