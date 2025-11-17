"use client";

import MobileFrame from "./mobile-frame";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import logoPastilla from "../images/logo_pastilla.png";
import "../styles/info-screen-styles.css";

interface InfoScreenProps {
  onNext: () => void; // Navega a Home/petOnboarding
  onSkip: () => void; // Navega a Home/petOnboarding
  onBack: () => void;
}

export default function MedicinaInfoScreen({
  onNext,
  onSkip,
  onBack,
}: InfoScreenProps) {
  // Ambos botones llevan al final del flujo (Home/petOnboarding)
  const handleNext = () => onNext();
  const handleSkip = () => onSkip();

  // Clase para el botón de guía (se pone azul al hacer click)
  const GUIDE_BUTTON_CLASS =
    "info-main-button info-main-button-primary info-main-button-blue";

  // Clase para el botón omitir (es el estilo de texto gris)
  const SKIP_BUTTON_CLASS = "info-skip-button";

  return (
    <MobileFrame>
      <div className="info-container">
        <button onClick={onBack} className="info-back-button">
          <ArrowLeft className="info-back-icon" />
        </button>

        <div className="info-content">
          {/* Icono de Medicina */}
          <div style={{ marginBottom: '2.5rem' }}>
            <Image 
              src={logoPastilla} 
              alt="Medicina" 
              width={112}
              height={112}
            />
          </div>

          <h2 className="info-title">
            ¿Te gustaría recibir información sobre medicinas?
          </h2>
        </div>

        <div className="info-actions">
          <Button onClick={handleNext} className={GUIDE_BUTTON_CLASS}>
            Ir a guía de medicinas
          </Button>
          <button onClick={handleSkip} className={SKIP_BUTTON_CLASS}>
            Omitir
          </button>
        </div>
      </div>
    </MobileFrame>
  );
}
