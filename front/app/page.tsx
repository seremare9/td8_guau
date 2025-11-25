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
import { api } from "@/lib/api";

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
  // Estado para controlar si se debe saltar la animación del menú
  const [skipMenuAnimation, setSkipMenuAnimation] = useState<boolean>(false);
  // Estado para rastrear desde dónde se navegó al calendario
  const [calendarFromScreen, setCalendarFromScreen] = useState<"home" | "menu" | null>(null);
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
    id_animal?: number;
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
  const navigateToMenu = () => {
    setSkipMenuAnimation(false);
    setCurrentScreen("menu");
  };
  const [petProfileInitialTab, setPetProfileInitialTab] = useState<"sobre" | "salud" | "nutricion">("sobre");

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
  const navigateToCalendar = (from: "home" | "menu" = "menu") => {
    setCalendarFromScreen(from);
    setCurrentScreen("calendar");
  };
  const navigateToHelp = () => setCurrentScreen("help");
  const navigateToAccount = () => setCurrentScreen("account");

  // Cargar el nombre del usuario desde localStorage al iniciar
  useEffect(() => {
    const loadUserName = () => {
      const storedData = localStorage.getItem("user_data");
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          if (parsed.firstName) {
            setUserName(parsed.firstName);
          }
        } catch (e) {
          console.error("Error cargando datos del usuario:", e);
        }
      }
    };
    loadUserName();
  }, []); // Solo se ejecuta al montar el componente

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
    // Guardar el tipo de usuario en localStorage para usarlo en registro/login
    localStorage.setItem("user_type", type);
    setPetOnboardingStartStep(undefined); // Limpiar el estado
    if (type === "futuro padre de perro" || type === "acabo de tener un perro") {
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
      if (userType === "futuro padre de perro" || userType === "acabo de tener un perro") {
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
      // Volver a la pantalla desde donde se vino
      if (calendarFromScreen === "home") {
        setCurrentScreen("home");
      } else {
        setSkipMenuAnimation(true);
        setCurrentScreen("menu");
      }
      setCalendarFromScreen(null);
    } else if (currentScreen === "account" || currentScreen === "help") {
      setSkipMenuAnimation(true);
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
          onSocialLogin={(provider, userData) => {
            setUserName(userData.firstName || "User");
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
          onSocialRegister={(provider, userData) => {
            setUserName(userData.firstName || "User");
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
          onBack={petOnboardingStartStep === 1 && userType !== "ya conozco bien a mi perro" ? navigateToMenu : navigateBack}
          onFinish={async (data) => {
            // Función helper para convertir fecha de cumpleaños a formato ISO
            const convertBirthdayToISO = (birthday: string): string | undefined => {
              if (!birthday) return undefined;
              
              // Formato esperado: "15 de Enero de 2025"
              const match = birthday.match(/(\d+)\s+de\s+(\w+)\s+de\s+(\d+)/);
              if (!match) return undefined;
              
              const day = parseInt(match[1]);
              const monthName = match[2];
              const year = parseInt(match[3]);
              
              const monthsMap: { [key: string]: number } = {
                "Enero": 1, "Febrero": 2, "Marzo": 3, "Abril": 4,
                "Mayo": 5, "Junio": 6, "Julio": 7, "Agosto": 8,
                "Septiembre": 9, "Octubre": 10, "Noviembre": 11, "Diciembre": 12
              };
              
              const month = monthsMap[monthName];
              if (!month) return undefined;
              
              return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            };

            // Función helper para convertir tamaño
            const convertSize = (gender?: string): string => {
              if (gender === "small") return "chico";
              if (gender === "medium") return "mediano";
              if (gender === "large") return "grande";
              return "mediano"; // default
            };

            // Obtener id_dueño de localStorage
            const userDataStr = localStorage.getItem("user_data");
            let id_dueño: number | undefined;
            
            if (userDataStr) {
              try {
                const userData = JSON.parse(userDataStr);
                id_dueño = userData.id_dueño;
              } catch (e) {
                console.error("Error al parsear datos de usuario:", e);
              }
            }

            // Intentar guardar en el backend si hay id_dueño
            let animalData = { ...data };
            
            if (id_dueño) {
              try {
                // Convertir peso de "15,5" a número
                const pesoNumero = data.weight ? parseFloat(data.weight.replace(",", ".")) : undefined;
                
                // Preparar datos para el backend
                const animalPayload = {
                  nombre: data.name,
                  raza_nombre: data.breed,
                  sexo: data.sex || "macho",
                  tamaño: convertSize(data.gender),
                  foto_url: data.imageURL || undefined,
                  fecha_nacimiento: data.birthday ? convertBirthdayToISO(data.birthday) : undefined,
                  color: (data as any).appearance || undefined,
                  estado: "activo",
                  id_dueno: id_dueño,
                };

                // Si hay peso, agregarlo
                if (pesoNumero && !isNaN(pesoNumero)) {
                  // El peso se guardará después como un registro de peso
                }

                // Crear el animal en el backend
                const nuevoAnimal = await api.animal.create(animalPayload);
                
                // Guardar el id_animal en los datos de la mascota
                animalData = { ...data, id_animal: nuevoAnimal.id_animal } as typeof data & { id_animal: number };

                // Si hay peso, crear un registro de peso
                if (pesoNumero && !isNaN(pesoNumero) && nuevoAnimal.id_animal) {
                  try {
                    await api.peso.create({
                      id_animal: nuevoAnimal.id_animal,
                      peso: pesoNumero,
                      fecha: new Date().toISOString().split('T')[0], // Fecha actual
                    });
                  } catch (error) {
                    console.error("Error al guardar peso inicial:", error);
                    // No bloqueamos el flujo si falla el peso
                  }
                }

                console.log("✅ Animal guardado en el backend:", nuevoAnimal);
              } catch (error) {
                console.error("Error al guardar animal en el backend:", error);
                // Continuar con localStorage como fallback
              }
            } else {
              console.warn("⚠️ No se encontró id_dueño, guardando solo en localStorage");
            }

            // Guardar la nueva mascota en localStorage (siempre, como backup)
            const petKey = `pet_data_${data.name}`;
            localStorage.setItem(petKey, JSON.stringify(animalData));
            
            // Actualizar el orden de las mascotas
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
            
            // Agregar la nueva mascota al final del orden si no existe
            if (!petsOrder.includes(data.name)) {
              petsOrder.push(data.name);
              localStorage.setItem(petsOrderKey, JSON.stringify(petsOrder));
            }
            
            // Disparar evento para actualizar otros componentes
            window.dispatchEvent(new Event("customStorageChange"));
            
            // Si es la primera mascota, actualizar el estado principal
            if (!petData) {
              setPetData(animalData);
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
          onOpenCalendar={() => navigateToCalendar("home")}
        />
      )}
      {currentScreen === "menu" && (
        <MenuScreen 
          userName={userName} 
          onClose={() => {
            setSkipMenuAnimation(false);
            navigateToHome();
          }}
          petData={petData}
          skipAnimation={skipMenuAnimation} 
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
          onOpenCalendar={() => navigateToCalendar("menu")}
          onOpenHelp={navigateToHelp}
          onOpenAccount={navigateToAccount}
          onAddNewPet={() => {
            // Navegar al flujo de onboarding para agregar una nueva mascota
            // Empezar desde el paso 1 (raza) en lugar del paso 0 (Oh Oh!)
            setPetOnboardingStartStep(1);
            setCurrentScreen("petOnboarding");
          }}
          onDeletePet={async (petName) => {
            // Buscar la mascota a eliminar para obtener su id_animal si existe
            let id_animal: number | undefined;
            const petDataToDelete = petData && petData.name === petName ? petData : null;
            
            // Buscar en localStorage si no está en petData
            if (!petDataToDelete) {
              const petDataStr = localStorage.getItem(`pet_data_${petName}`);
              if (petDataStr) {
                try {
                  const petDataObj = JSON.parse(petDataStr);
                  id_animal = petDataObj.id_animal;
                } catch (e) {
                  console.error("Error al parsear datos de mascota:", e);
                }
              }
            } else {
              id_animal = petDataToDelete.id_animal;
            }

            // 1. Eliminar de la base de datos si tiene id_animal
            if (id_animal) {
              try {
                // Eliminar fotos del animal
                try {
                  const fotos = await api.animalFoto.getByAnimal(id_animal);
                  for (const foto of fotos) {
                    await api.animalFoto.delete(foto.id_foto);
                  }
                } catch (error) {
                  console.error("Error al eliminar fotos:", error);
                }

                // Eliminar el animal
                await api.animal.delete(id_animal);
                console.log("✅ Mascota eliminada de la base de datos");
              } catch (error) {
                console.error("Error al eliminar mascota de la base de datos:", error);
                // Continuar con la eliminación local
              }
            }

            // 2. Eliminar datos de la mascota de localStorage
            localStorage.removeItem(`pet_data_${petName}`);
            
            // 3. Eliminar vacunas
            localStorage.removeItem(`vaccines_${petName}`);
            
            // 4. Eliminar eventos
            localStorage.removeItem(`events_${petName}`);
            
            // 5. Eliminar peso
            localStorage.removeItem(`peso_${petName}`);
            
            // 6. Eliminar fotos
            localStorage.removeItem(`pet_photos_${petName}`);
            
            // 7. Eliminar higiene
            localStorage.removeItem(`higiene_${petName}`);
            
            // 8. Eliminar medicina
            localStorage.removeItem(`medicina_${petName}`);
            
            // 9. Eliminar antiparasitario
            localStorage.removeItem(`antiparasitario_${petName}`);
            
            // 10. Eliminar veterinario
            localStorage.removeItem(`veterinario_${petName}`);
            
            // 11. Eliminar otro
            localStorage.removeItem(`otro_${petName}`);
            
            // 12. Eliminar recordatorios relacionados con esta mascota
            const remindersKey = "event_reminders";
            const existingReminders = JSON.parse(
              localStorage.getItem(remindersKey) || "[]"
            );
            const updatedReminders = existingReminders.filter(
              (reminder: any) => reminder.petName !== petName
            );
            localStorage.setItem(remindersKey, JSON.stringify(updatedReminders));
            
            // 13. Actualizar pets_order para remover la mascota eliminada
            const petsOrderKey = "pets_order";
            const petsOrderStr = localStorage.getItem(petsOrderKey);
            if (petsOrderStr) {
              try {
                const petsOrder: string[] = JSON.parse(petsOrderStr);
                const updatedOrder = petsOrder.filter((name) => name !== petName);
                localStorage.setItem(petsOrderKey, JSON.stringify(updatedOrder));
              } catch (e) {
                console.error("Error al actualizar pets_order:", e);
              }
            }
            
            // 14. Si la mascota eliminada era la seleccionada, limpiar petData
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
            
            // 15. Notificar a otros componentes del cambio (disparar múltiples veces para asegurar que se actualice)
            window.dispatchEvent(new Event("customStorageChange"));
            // También disparar un evento personalizado con el nombre de la mascota eliminada
            window.dispatchEvent(new CustomEvent("petDeleted", { detail: { petName } }));
            
            // 16. Verificar si hay más mascotas después de la eliminación
            const hasOtherPets = Array.from({ length: localStorage.length }, (_, i) => {
              const key = localStorage.key(i);
              return key && key.startsWith("pet_data_");
            }).some(Boolean);
            
            // 17. Si no hay más mascotas, volver al onboarding
            if (!hasOtherPets) {
              setPetData(null);
              setCurrentScreen("petOnboarding");
              setPetOnboardingStartStep(0);
            } else {
              // Si hay otras mascotas, asegurarse de que petData apunte a una mascota válida
              // y navegar al home para que se actualice la lista
              if (!petData || petData.name === petName) {
                // Buscar la primera mascota disponible
                for (let i = 0; i < localStorage.length; i++) {
                  const key = localStorage.key(i);
                  if (key && key.startsWith("pet_data_")) {
                    const petDataStr = localStorage.getItem(key);
                    if (petDataStr) {
                      try {
                        const petDataObj = JSON.parse(petDataStr);
                        if (petDataObj.name && petDataObj.name !== petName) {
                          setPetData(petDataObj);
                          break;
                        }
                      } catch (e) {
                        console.error("Error al parsear datos de mascota:", e);
                      }
                    }
                  }
                }
              }
              // Cerrar el menú si está abierto y navegar al home
              if (currentScreen === "menu") {
                setCurrentScreen("home");
              } else {
                navigateToHome();
              }
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
        <HelpScreen onBack={navigateBack} />
      )}
      {currentScreen === "account" && (
        <Account
          userName={userName}
          onBack={navigateBack}
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

    </div>
  );
}
