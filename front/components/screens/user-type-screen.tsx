"use client";

import MobileFrame from "./mobile-frame";
import { useState } from "react";
import Image from "next/image";
import personaPerro from "../images/persona_perro.png";
import "../styles/user-type-screen-styles.css";

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

      <div className="user-type-container">
    
        <h1 className="user-type-title">¿Qué opción te describe mejor?</h1>

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
            onClick={() => handleSelect("acabo de tener un perro")}
            className={`user-type-button ${
              selectedOption === "acabo de tener un perro"
                ? "user-type-button-selected"
                : "user-type-button-unselected"
            }`}
          >
            Acabo de adoptar un perro
          </button>

          <button
            onClick={() => handleSelect("ya conozco bien a mi perro")}
            className={`user-type-button ${
              selectedOption === "ya conozco bien a mi perro"
                ? "user-type-button-selected"
                : "user-type-button-unselected"
            }`}
          >
            Ya conozco bien a mi perro
          </button>

          <button
            onClick={() => handleSelect("futuro padre de perro")}
            className={`user-type-button ${
              selectedOption === "futuro padre de perro"
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
