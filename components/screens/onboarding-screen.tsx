import Image from "next/image";
import { Button } from "@/components/ui/button";
import imgLogoGuau from "../images/guau_logo.svg";
import MobileFrame from "./mobile-frame";
import "../styles/onboarding-screen-styles.css";

interface OnboardingScreenProps {
  onGetStarted: () => void;
}

export default function OnboardingScreen({
  onGetStarted,
}: OnboardingScreenProps) {
  return (
    <MobileFrame>
      <div className="onboarding-container">
        {/* Logo */}
        <div className="logo-container">
          <Image src={imgLogoGuau} alt="logo_guau" className="logo-image" />
        </div>

        {/* Texto */}
        <p className="onboarding-text">Todo sobre tu perro, en un solo lugar</p>

        {/* Botón */}
        <Button onClick={onGetStarted} className="onboarding-button">
          Continuar
        </Button>
      </div>
    </MobileFrame>
  );
}
