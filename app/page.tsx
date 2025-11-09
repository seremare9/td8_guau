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
import Calendar from "@/components/calendar";
import HelpScreen from "@/components/help-screen";
import Account from "@/components/account";

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
    | "calendar"
    | "help"
    | "account"
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
  const navigateToPetProfile = (selectedPetData?: {
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
  }) => {
    // Si se pasa una mascota específica, actualizar petData
    if (selectedPetData) {
      setPetData(selectedPetData);
    }
    setCurrentScreen("petProfile");
  };
  const navigateToVaccines = () => setCurrentScreen("vaccines");
  const navigateToCalendar = () => setCurrentScreen("calendar");
  const navigateToHelp = () => setCurrentScreen("help");
  const navigateToAccount = () => setCurrentScreen("account");

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
    } else if (currentScreen === "calendar") {
      setCurrentScreen("menu");
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
          onBack={petOnboardingStartStep === 1 ? navigateToMenu : navigateBack}
          onFinish={(data) => {
            // Guardar la nueva mascota en localStorage
            const petKey = `pet_data_${data.name}`;
            localStorage.setItem(petKey, JSON.stringify(data));
            
            // Disparar evento para actualizar otros componentes
            window.dispatchEvent(new Event("customStorageChange"));
            
            // Si es la primera mascota, actualizar el estado principal
            if (!petData) {
              setPetData(data);
            }
            
            navigateToHome();
          }}
          // Pasar el paso inicial solo si está definido
          initialStep={petOnboardingStartStep}
          // Indicar si viene del menú (cuando initialStep es 1)
          fromMenu={petOnboardingStartStep === 1}
        />
      )}
      {currentScreen === "home" && (
        <HomeScreen 
          userName={userName} 
          onOpenMenu={navigateToMenu} 
          petData={petData} 
          onOpenPetProfile={(selectedPetData) => {
            // Si se pasa una mascota específica, actualizar petData
            if (selectedPetData) {
              setPetData(selectedPetData);
            }
            navigateToPetProfile(selectedPetData);
          }}
          onOpenCalendar={navigateToCalendar}
        />
      )}
      {currentScreen === "menu" && (
        <MenuScreen 
          userName={userName} 
          onClose={navigateToHome} 
          petData={petData} 
          onOpenPetProfile={(selectedPetData) => {
            // Esta función ya no se usa desde el menú, pero se mantiene por compatibilidad
            // El menú ahora solo usa onSelectPet para cambiar de perfil
            if (selectedPetData) {
              setPetData(selectedPetData);
            }
            navigateToPetProfile(selectedPetData);
          }}
          onSelectPet={(selectedPetData) => {
            // Actualizar la mascota seleccionada y volver al home
            setPetData(selectedPetData);
            navigateToHome();
          }}
          onOpenCalendar={navigateToCalendar}
          onOpenHelp={navigateToHelp}
          onOpenAccount={navigateToAccount}
          onAddNewPet={() => {
            // Navegar al flujo de onboarding para agregar una nueva mascota
            // Empezar desde el paso 1 (raza) en lugar del paso 0 (Oh Oh!)
            setPetOnboardingStartStep(1);
            setCurrentScreen("petOnboarding");
          }}
          onDeletePet={(petName) => {
            // Eliminar todos los datos de la mascota
            // 1. Eliminar datos de la mascota
            localStorage.removeItem(`pet_data_${petName}`);
            
            // 2. Eliminar vacunas
            localStorage.removeItem(`vaccines_${petName}`);
            
            // 3. Eliminar eventos
            localStorage.removeItem(`events_${petName}`);
            
            // 4. Eliminar recordatorios relacionados con esta mascota
            const remindersKey = "event_reminders";
            const existingReminders = JSON.parse(
              localStorage.getItem(remindersKey) || "[]"
            );
            const updatedReminders = existingReminders.filter(
              (reminder: any) => reminder.petName !== petName
            );
            localStorage.setItem(remindersKey, JSON.stringify(updatedReminders));
            
            // 5. Si la mascota eliminada era la seleccionada, limpiar petData
            if (petData && petData.name === petName) {
              setPetData(null);
              // Si hay otras mascotas, seleccionar la primera disponible
              const allPets: any[] = [];
              for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith("pet_data_")) {
                  const petDataStr = localStorage.getItem(key);
                  if (petDataStr) {
                    try {
                      const petDataObj = JSON.parse(petDataStr);
                      if (petDataObj.name) {
                        allPets.push(petDataObj);
                      }
                    } catch (e) {
                      console.error("Error al parsear datos de mascota:", e);
                    }
                  }
                }
              }
              if (allPets.length > 0) {
                setPetData(allPets[0]);
              } else {
                // Si no hay más mascotas, volver al onboarding
                setCurrentScreen("petOnboarding");
                setPetOnboardingStartStep(0);
              }
            }
            
            // 6. Notificar a otros componentes del cambio
            window.dispatchEvent(new Event("customStorageChange"));
            
            // 7. Si no hay más mascotas, volver al home (o onboarding si no hay ninguna)
            const hasOtherPets = Array.from({ length: localStorage.length }, (_, i) => {
              const key = localStorage.key(i);
              return key && key.startsWith("pet_data_");
            }).some(Boolean);
            
            if (!hasOtherPets) {
              setPetData(null);
              setCurrentScreen("petOnboarding");
              setPetOnboardingStartStep(0);
            } else {
              navigateToHome();
            }
          }}
        />
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
      {currentScreen === "calendar" && (
        <Calendar
          userName={userName}
          petData={petData}
          onBack={navigateBack}
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
      {currentScreen === "help" && (
        <HelpScreen onBack={navigateToMenu} />
      )}
      {currentScreen === "account" && (
        <Account
          userName={userName}
          onBack={navigateToMenu}
          onUpdateUserData={(updatedUserData) => {
            // Guardar los datos actualizados en localStorage
            localStorage.setItem("user_data", JSON.stringify(updatedUserData));
            // Actualizar el nombre de usuario si cambió
            if (updatedUserData.firstName) {
              setUserName(updatedUserData.firstName);
            }
          }}
        />
      )}
    </div>
  );
}
