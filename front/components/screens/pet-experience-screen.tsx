"use client";

import MobileFrame from "./mobile-frame";
import { useState } from "react";
import Image from "next/image";
import personaPerro2 from "../images/persona_perro-2.png";
import "../styles/pet-experience-screen-styles.css";

interface PetExperienceScreenProps {
  onBack: () => void;
  onSelectExperience: (hasExperience: boolean) => void;
}

export default function PetExperienceScreen({
  onBack,
  onSelectExperience,
}: PetExperienceScreenProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelect = (option: "yes" | "no") => {
    setSelectedOption(option);
    setTimeout(() => {
      onSelectExperience(option === "yes");
    }, 200);
  };

  return (
    <MobileFrame>
      {/* 🛑 Contenedor Principal (aplica padding y flex-col) 🛑 */}
      <div className="experience-container">
        {/* Back button */}
        {/* Usamos una clase para posicionar el botón de regreso */}
        <button onClick={onBack} className="experience-back-button">
          <svg
            className="experience-back-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Title */}
        <h1 className="experience-title">¿Has tenido mascotas antes?</h1>

        {/* Illustration */}
        <div className="experience-illustration-wrapper">
          <div className="experience-illustration-area">
            <Image
              src={personaPerro2}
              alt="Person hugging dog"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>

        {/* Options */}
        <div className="experience-options-group">
          <button
            onClick={() => handleSelect("yes")}
            className={`experience-button ${
              selectedOption === "yes"
                ? "experience-button-selected"
                : "experience-button-unselected"
            }`}
          >
            Sí, ya tengo experiencia
          </button>

          <button
            onClick={() => handleSelect("no")}
            className={`experience-button ${
              selectedOption === "no"
                ? "experience-button-selected"
                : "experience-button-unselected"
            }`}
          >
            No, soy padre primerizo
          </button>
        </div>
      </div>
    </MobileFrame>
  );
}
