"use client";

import { useState } from "react";
import MobileFrame from "./mobile-frame";
import Image from "next/image";
import { ArrowLeft, ChevronRight, X } from "lucide-react";
import lineSvg from "./images/line.svg";
import "./styles/help-screen-styles.css";

interface HelpScreenProps {
  onBack: () => void;
}

interface HelpCategory {
  id: string;
  title: string;
  description: string;
}

const helpCategories: HelpCategory[] = [
  {
    id: "sobre-guau",
    title: "Sobre Guau",
    description: "Descubre qué es Guau y que podes hacer con nosotros.",
  },
  {
    id: "mi-cuenta",
    title: "Mi cuenta",
    description:
      "Información sobre cómo editar tus datos, contraseña y gestionar tus preferencias.",
  },
  {
    id: "guias",
    title: "Guías",
    description: "Te enseñamos a como usar las funciones principales de Guau.",
  },
  {
    id: "cambiar-idioma",
    title: "Cambiar idioma",
    description: "Configurá el idioma de la aplicación según tus preferencias.",
  },
  {
    id: "membresia-premium",
    title: "Membresía Guau Premium",
    description:
      "Información relacionada a la membresía Premium, beneficios y más",
  },
  {
    id: "terminos-condiciones",
    title: "Términos y condiciones",
    description:
      "Leé la información legal relacionada al uso de la app, privacidad y protección de datos.",
  },
];

export default function HelpScreen({ onBack }: HelpScreenProps) {
  const handleCategoryClick = (categoryId: string) => {
    // Por ahora solo mostramos un console.log
    // Más adelante puedes navegar a pantallas específicas según la categoría
    console.log("Categoría seleccionada:", categoryId);
  };

  return (
    <MobileFrame>
      <div className="help-container">
        {/* Header */}
        <div className="help-header">
          <h1 className="help-title">Ayuda</h1>
          <button
            onClick={onBack}
            className="help-close-button"
            aria-label="Cerrar"
          >
            <X className="help-close-icon" />
          </button>
        </div>

        {/* Line separator */}
        <div className="help-header-line">
          <Image src={lineSvg} alt="Line separator" width={336} height={2} />
        </div>

        {/* Categories List */}
        <div className="help-categories-list">
          {helpCategories.map((category) => (
            <button
              key={category.id}
              className="help-category-item"
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="help-category-content">
                <h3 className="help-category-title">{category.title}</h3>
                <p className="help-category-description">
                  {category.description}
                </p>
              </div>
              <ChevronRight className="help-category-arrow" />
            </button>
          ))}
        </div>
      </div>
    </MobileFrame>
  );
}

