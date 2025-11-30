"use client";

import MobileFrame from "./mobile-frame";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import logoVacuna from "../images/event-icons/vacuna.svg";
import "../styles/info-screen-styles.css";

interface InfoScreenProps {
  onNext: () => void; // Navega a MedicinaInfoScreen
  onSkip: () => void; // Navega a MedicinaInfoScreen
  onBack: () => void;
}

export default function VacunaInfoScreen({
  onNext,
  onSkip,
  onBack,
}: InfoScreenProps) {

  // Guía de vacunas
  const handleNext = () => {
  };

  // Omitir
  const handleSkip = () => {
    onNext();
  };

  // Guía de vacunas
  const NEXT_BUTTON_CLASS =
    "info-main-button info-main-button-primary info-main-button-blue";

  // Omitir
  const SKIP_BUTTON_CLASS = "info-skip-button";

  return (
    <MobileFrame>
      <div className="info-container">
        <button onClick={onBack} className="info-back-button">
          <ArrowLeft className="info-back-icon" />
        </button>

        <div className="info-content">
          <div style={{ marginBottom: '2.5rem' }}>
            <Image 
              src={logoVacuna} 
              alt="Vacuna" 
              width={112}
              height={112}
            />
          </div>

          <h2 className="info-title">
            ¿Te gustaría recibir información sobre vacunas?
          </h2>
        </div>

        <div className="info-actions">
          <Button onClick={handleNext} className={NEXT_BUTTON_CLASS}>
            Ir a guía de vacunas
          </Button>
          <button onClick={handleSkip} className={SKIP_BUTTON_CLASS}>
            Omitir
          </button>
        </div>
      </div>
    </MobileFrame>
  );
}
