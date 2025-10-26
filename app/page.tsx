"use client";

import { useState } from "react";
import OnboardingScreen from "@/components/onboarding-screen";
import LoginScreen from "@/components/inicio";
import RegisterScreen from "@/components/register-screen";
import UserTypeScreen from "@/components/user-type-screen";
import PetOnboardingFlow from "@/components/pet-onboarding-flow";
import PetExperienceScreen from "@/components/pet-experience-screen";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<
    | "onboarding"
    | "login"
    | "register"
    | "userType"
    | "petExperience"
    | "petOnboarding"
  >("onboarding");

  const [userType, setUserType] = useState<string>("");
  const navigateToLogin = () => setCurrentScreen("login");
  const navigateToRegister = () => setCurrentScreen("register");
  const navigateToUserType = () => setCurrentScreen("userType");

  const navigateToPetOnboarding = (type: string) => {
    setUserType(type);
    if (type === "future") {
      setCurrentScreen("petExperience");
    } else {
      setCurrentScreen("petOnboarding");
    }
  };

  const handlePetExperience = (hasExperience: boolean) => {
    console.log("[v0] Pet experience:", hasExperience);
    setCurrentScreen("petOnboarding");
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
    } else if (currentScreen === "petOnboarding") {
      if (userType === "future") {
        setCurrentScreen("petExperience");
      } else {
        setCurrentScreen("userType");
      }
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
          onLogin={navigateToUserType}
        />
      )}
      {currentScreen === "register" && (
        <RegisterScreen onBack={navigateBack} onRegister={navigateToUserType} />
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
        <PetOnboardingFlow userType={userType} onBack={navigateBack} />
      )}
    </div>
  );
}
