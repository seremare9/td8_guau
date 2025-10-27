"use client";

import MobileFrame from "./mobile-frame";
import { useState } from "react";
import Image from "next/image";
import personaPerro from "./images/persona_perro.png";
import "./styles/user-type-screen-styles.css";

interface UserTypeScreenProps {
  onSelectType: (type: string) => void;
}

export default function UserTypeScreen({ onSelectType }: UserTypeScreenProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelect = (type: string) => {
    setSelectedOption(type);
    setTimeout(() => {
      onSelectType(type);
    }, 200);
  };

  return (
    <MobileFrame>
      {/* 🛑 Contenedor Principal (aplica padding y flex-col) 🛑 */}
      <div className="user-type-container">
        {/* Title */}
        <h1 className="user-type-title">¿Qué opción te describe mejor?</h1>

        {/* Illustration */}
        <div className="user-type-illustration-wrapper">
          <div className="user-type-illustration-area">
            <Image
              src={personaPerro}
              alt="Persona con perro"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>

        {/* Options */}
        <div className="user-type-options-group">
          <button
            onClick={() => handleSelect("adopted")}
            className={`user-type-button ${
              selectedOption === "adopted"
                ? "user-type-button-selected"
                : "user-type-button-unselected"
            }`}
          >
            Acabo de adoptar un perro
          </button>

          <button
            onClick={() => handleSelect("experienced")}
            className={`user-type-button ${
              selectedOption === "experienced"
                ? "user-type-button-selected"
                : "user-type-button-unselected"
            }`}
          >
            Ya conozco bien a mi perro
          </button>

          <button
            onClick={() => handleSelect("future")}
            className={`user-type-button ${
              selectedOption === "future"
                ? "user-type-button-selected"
                : "user-type-button-unselected"
            }`}
          >
            Futuro padre de perro
          </button>
        </div>
      </div>
    </MobileFrame>
  );
}
