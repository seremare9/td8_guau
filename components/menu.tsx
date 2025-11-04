"use client";

import Image from "next/image";
import MobileFrame from "./mobile-frame";
import { X, ShoppingBag, Users, Calendar, HelpCircle, User, Settings, Plus } from "lucide-react";
import perro from "./images/perro.png";
import imgIcon from "./images/img-icon.svg";
import "./styles/menu-styles.css";
import lineSvg from "./images/line.svg";

interface MenuScreenProps {
  userName?: string;
  onClose: () => void;
  petData?: { name: string; breed: string } | null;
}

export default function MenuScreen({
  userName = "User",
  onClose,
  petData,
}: MenuScreenProps) {
  const pets = [
    {
      id: 1,
      name: petData?.name || "Maxi",
      image: perro,
    },
  ];

  return (
    <MobileFrame>
      <div className="menu-container">
        {/* Header */}
        <div className="menu-header">
          <div className="menu-header-left">
            <div className="menu-dog-icon">
            </div>
            <div className="menu-greeting">
            <span className="menu-greeting-text">Hola, </span>
            <span className="menu-greeting-name">{userName}</span>
            </div>
          </div>
          <button onClick={onClose} className="menu-close-button" aria-label="Cerrar menú">
            <X className="menu-close-icon" />
          </button>
        </div>
        {/* Line separator */}
        <div className="home-header-line">
          <Image
            src={lineSvg}
            alt="Line separator"
            width={336}
            height={2}
          />
        </div>

        {/* Mis mascotas */}
        <div className="menu-section">
          <h2 className="menu-section-title">Mis mascotas</h2>
          <div className="menu-pets-container">
            {pets.map((pet) => (
              <div key={pet.id} className="menu-pet-item">
                <div className="menu-pet-circle">
                  <Image
                    src={pet.image}
                    alt={pet.name}
                    width={64}
                    height={64}
                    className="menu-pet-image"
                  />
                </div>
                <span className="menu-pet-name">{pet.name}</span>
              </div>
            ))}
            <div className="menu-pet-item">
              <div className="menu-pet-circle menu-pet-new">
                <Plus className="menu-pet-plus-icon" />
              </div>
              <span className="menu-pet-name menu-pet-name-new">Nueva</span>
            </div>
          </div>
        </div>
        {/* Line separator */}
        <div className="home-header-line">
          <Image
            src={lineSvg}
            alt="Line separator"
            width={336}
            height={2}
          />
        </div>

        {/* Menu Items */}
        <div className="menu-items">
          <button className="menu-item">
            <ShoppingBag className="menu-item-icon" />
            <span className="menu-item-text">Tienda Guau</span>
          </button>
          <button className="menu-item">
            <Users className="menu-item-icon" />
            <span className="menu-item-text">Contactos</span>
          </button>
          <button className="menu-item">
            <Calendar className="menu-item-icon" />
            <span className="menu-item-text">Calendario</span>
          </button>
          <button className="menu-item">
            <HelpCircle className="menu-item-icon" />
            <span className="menu-item-text">Preguntas frecuentes</span>
          </button>
        </div>

        {/* Line separator */}
        <div className="home-header-line">
          <Image
            src={lineSvg}
            alt="Line separator"
            width={336}
            height={2} />
        </div>

        {/* Bottom Menu Items */}
        <div className="menu-items">
          <button className="menu-item">
            <User className="menu-item-icon" />
            <span className="menu-item-text">Mi cuenta</span>
          </button>
          <button className="menu-item">
            <Settings className="menu-item-icon" />
            <span className="menu-item-text">Configuración</span>
          </button>
        </div>
      </div>
    </MobileFrame>
  );
}

