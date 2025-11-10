"use client";

import { useState, useEffect } from "react";
import OnboardingScreen from "@/components/screens/onboarding-screen";
import LoginScreen from "@/components/screens/inicio";
import RegisterScreen from "@/components/screens/register-screen";
import UserTypeScreen from "@/components/screens/user-type-screen";
import PetOnboardingFlow from "@/components/screens/pet-onboarding-flow";
import PetExperienceScreen from "@/components/screens/pet-experience-screen";
import HomeScreen from "@/components/screens/home-screen";
import MenuScreen from "@/components/screens/menu";
import PetProfile from "@/components/screens/pet-profile";
import Vaccines from "@/components/screens/vaccines";
import Higiene from "@/components/screens/higiene";
import Medicina from "@/components/screens/medicina";
import Antiparasitario from "@/components/screens/antiparasitario";
import Veterinario from "@/components/screens/veterinario";
import Otro from "@/components/screens/otro";
import Peso from "@/components/screens/peso";
import Calendar from "@/components/screens/calendar";
import HelpScreen from "@/components/screens/help-screen";
import Account from "@/components/screens/account";
import GlobalSearch from "@/components/screens/global-search";

// Las importaciones de componentes deben usar mayúscula inicial para JSX
import MedicinaInfoScreen from "@/components/screens/medicinaInfo-screen";
import VacunaInfoScreen from "@/components/screens/vacunaInfo-screen";

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
    | "higiene"
    | "medicina"
    | "antiparasitario"
    | "veterinario"
    | "otro"
    | "peso"
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

  // Función para verificar si hay mascotas registradas
  const hasRegisteredPets = (): boolean => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("pet_data_")) {
        const petDataStr = localStorage.getItem(key);
        if (petDataStr) {
          try {
            const petDataObj = JSON.parse(petDataStr);
            if (petDataObj.name) {
              return true;
            }
          } catch (e) {
            console.error("Error al parsear datos de mascota:", e);
          }
        }
      }
    }
    return false;
  };

  // Función para cargar la primera mascota registrada
  const loadFirstPet = () => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("pet_data_")) {
        const petDataStr = localStorage.getItem(key);
        if (petDataStr) {
          try {
            const petDataObj = JSON.parse(petDataStr);
            if (petDataObj.name) {
              setPetData(petDataObj);
              return;
            }
          } catch (e) {
            console.error("Error al parsear datos de mascota:", e);
          }
        }
      }
    }
  };

  const navigateToLogin = () => setCurrentScreen("login");
  const navigateToRegister = () => setCurrentScreen("register");
  const navigateToUserType = () => setCurrentScreen("userType");

  const navigateToVacunaInfo = () => setCurrentScreen("vacunaInfo");
  const navigateToMedicinaInfo = () => setCurrentScreen("medicinaInfo");
  const navigateToHome = () => setCurrentScreen("home");
  const navigateToMenu = () => setCurrentScreen("menu");
  const [petProfileInitialTab, setPetProfileInitialTab] = useState<"sobre" | "salud" | "nutricion">("sobre");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
  }, tab?: "sobre" | "salud" | "nutricion") => {
    // Si se pasa una mascota específica, actualizar petData
    if (selectedPetData) {
      setPetData(selectedPetData);
    }
    if (tab) {
      setPetProfileInitialTab(tab);
    } else {
      setPetProfileInitialTab("sobre");
    }
    setCurrentScreen("petProfile");
  };

  const navigateToPetProfileWithTab = (tab: "sobre" | "salud" | "nutricion") => {
    setPetProfileInitialTab(tab);
    setCurrentScreen("petProfile");
  };
  const navigateToVaccines = () => setCurrentScreen("vaccines");
  const navigateToHigiene = () => setCurrentScreen("higiene");
  const navigateToMedicina = () => setCurrentScreen("medicina");
  const navigateToAntiparasitario = () => setCurrentScreen("antiparasitario");
  const navigateToVeterinario = () => setCurrentScreen("veterinario");
  const navigateToOtro = () => setCurrentScreen("otro");
  const navigateToPeso = () => setCurrentScreen("peso");
  const navigateToCalendar = () => setCurrentScreen("calendar");
  const navigateToHelp = () => setCurrentScreen("help");
  const navigateToAccount = () => setCurrentScreen("account");

  // Verificar al cargar si hay mascotas registradas y cargar la primera
  useEffect(() => {
    if (hasRegisteredPets()) {
      loadFirstPet();
      setCurrentScreen("home");
    }
  }, []); // Solo se ejecuta al montar el componente

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
    } else if (currentScreen === "vaccines" || currentScreen === "higiene" || currentScreen === "medicina" || currentScreen === "antiparasitario" || currentScreen === "veterinario" || currentScreen === "otro" || currentScreen === "peso") {
      navigateToPetProfileWithTab("salud");
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
            // Si hay mascotas registradas, ir directamente a home
            if (hasRegisteredPets()) {
              loadFirstPet();
              navigateToHome();
            } else {
              navigateToUserType();
            }
          }}
        />
      )}
      {currentScreen === "register" && (
        <RegisterScreen
          onBack={navigateBack}
          onRegister={(name: string) => {
            setUserName(name || "User");
            // Si hay mascotas registradas, ir directamente a home
            if (hasRegisteredPets()) {
              loadFirstPet();
              navigateToHome();
            } else {
              navigateToUserType();
            }
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
          onOpenSearch={() => setIsSearchOpen(true)}
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
          onOpenHigiene={navigateToHigiene}
          onOpenMedicina={navigateToMedicina}
          onOpenAntiparasitario={navigateToAntiparasitario}
          onOpenVeterinario={navigateToVeterinario}
          onOpenOtro={navigateToOtro}
          onOpenPeso={navigateToPeso}
          initialTab={petProfileInitialTab}
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
      {currentScreen === "higiene" && (
        <Higiene
          userName={userName}
          petData={petData}
          onBack={navigateBack}
          onUpdatePetData={(updatedPetData) => setPetData(updatedPetData)}
        />
      )}
      {currentScreen === "medicina" && (
        <Medicina
          userName={userName}
          petData={petData}
          onBack={navigateBack}
          onUpdatePetData={(updatedPetData) => setPetData(updatedPetData)}
        />
      )}
      {currentScreen === "antiparasitario" && (
        <Antiparasitario
          userName={userName}
          petData={petData}
          onBack={navigateBack}
          onUpdatePetData={(updatedPetData) => setPetData(updatedPetData)}
        />
      )}
      {currentScreen === "veterinario" && (
        <Veterinario
          userName={userName}
          petData={petData}
          onBack={navigateBack}
          onUpdatePetData={(updatedPetData) => setPetData(updatedPetData)}
        />
      )}
      {currentScreen === "otro" && (
        <Otro
          userName={userName}
          petData={petData}
          onBack={navigateBack}
          onUpdatePetData={(updatedPetData) => setPetData(updatedPetData)}
        />
      )}
      {currentScreen === "peso" && (
        <Peso
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
          onLogout={() => {
            // Limpiar datos de sesión si es necesario
            setCurrentScreen("login");
          }}
          onDeleteAccount={() => {
            // Limpiar estado de la aplicación
            setPetData(null);
            setUserName("User");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Global Search Modal */}
      <GlobalSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigateToPet={(selectedPetData) => {
          setPetData(selectedPetData);
          navigateToPetProfile(selectedPetData);
        }}
        onNavigateToEvent={(eventType, petName) => {
          // Buscar la mascota por nombre
          const petDataKey = `pet_data_${petName}`;
          const petDataStr = localStorage.getItem(petDataKey);
          if (petDataStr) {
            try {
              const petData = JSON.parse(petDataStr);
              setPetData(petData);
              
              // Navegar a la pantalla correspondiente
              if (eventType === "vaccines") {
                setCurrentScreen("vaccines");
              } else if (eventType === "higiene") {
                setCurrentScreen("higiene");
              } else if (eventType === "medicina") {
                setCurrentScreen("medicina");
              } else if (eventType === "antiparasitario") {
                setCurrentScreen("antiparasitario");
              } else if (eventType === "veterinario") {
                setCurrentScreen("veterinario");
              } else if (eventType === "otro") {
                setCurrentScreen("otro");
              } else if (eventType === "peso") {
                setCurrentScreen("peso");
              }
            } catch (e) {
              console.error("Error al parsear datos de mascota:", e);
            }
          }
        }}
      />
    </div>
  );
}
