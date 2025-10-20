"use client"

import { useState } from "react"
import OnboardingScreen from "@/components/onboarding-screen"
import LoginScreen from "@/components/login-screen"
import RegisterScreen from "@/components/register-screen"

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<"onboarding" | "login" | "register">("onboarding")

  const navigateToLogin = () => setCurrentScreen("login")
  const navigateToRegister = () => setCurrentScreen("register")
  const navigateBack = () => {
    if (currentScreen === "register") {
      setCurrentScreen("login")
    } else if (currentScreen === "login") {
      setCurrentScreen("onboarding")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentScreen === "onboarding" && <OnboardingScreen onGetStarted={navigateToLogin} />}
      {currentScreen === "login" && <LoginScreen onCreateAccount={navigateToRegister} onBack={navigateBack} />}
      {currentScreen === "register" && <RegisterScreen onBack={navigateBack} />}
    </div>
  )
}
