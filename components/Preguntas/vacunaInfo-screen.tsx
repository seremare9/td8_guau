"use client";

// 🛑 RUTA CORREGIDA para acceder al MobileFrame fuera de la carpeta 'Preguntas' 🛑
import MobileFrame from "../mobile-frame";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Syringe } from "lucide-react";
import "./info-screen-styles.css";

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
  // Las funciones onNext y onSkip en page.tsx ahora llevan a la misma función: navigateToMedicinaInfo

  // Función para manejar el botón principal (guía de vacunas)
  const handleNext = () => {
    // Al presionar la guía, se pone azuly va a la info sobre vacunas
  };

  // Función para manejar el botón Omitir
  const handleSkip = () => {
    // Omitir lleva a la siguiente pregunta (medicinaInfo) 🛑
    onNext();
  };

  // Clase para el botón de guía (se pone azul al hacer click)
  const NEXT_BUTTON_CLASS =
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
          {/* Icono de Vacuna (Verde) */}
          <div className="info-icon-wrapper info-icon-vaccine-bg">
            <Syringe className="info-icon info-icon-vaccine-fg" />
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
