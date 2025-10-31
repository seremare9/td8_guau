"use client";

import { useState } from "react";
import MobileFrame from "./mobile-frame";
import Image from "next/image";
import imgIcon from "./images/img-icon.svg";
import perro from "./images/perro.png";
import petCardSvg from "./images/pet-card.svg";
import imgInfoCardBasic2 from "./images/info-cards/img-info-card-basic-2.png";
import imgInfoCardBasic3 from "./images/info-cards/img-info-card-basic-3.png";
import imgInfoCardBasic1 from "./images/info-cards/img-info-card-basic-1.png";
import lineSvg from "./images/line.svg";
import lupaSvg from "./images/lupa.svg";
import campanaSvg from "./images/campana.svg";
import menuSvg from "./images/menu.svg";
import dividerSvg from "./images/divider.svg";
import elipsesSvg from "./images/elipses.svg";
import "./styles/home-screen-styles.css";

interface HomeScreenProps {
  userName?: string;
}

export default function HomeScreen({ 
  userName = "User",
}: HomeScreenProps) {
  const [pets] = useState([
    {
      id: 1,
      name: "Maxi",
      breed: "Border Collie",
      image: perro,
    },
  ]);

  const [events] = useState<Array<any>>([]);

  const [usefulInfo] = useState([
    {
      id: 1,
      title: "Cuidados básicos",
      subtitle: "Click para leer",
      image: imgInfoCardBasic1,
    },
    {
      id: 2,
      title: "Juguetes ideales para cachorros",
      subtitle: "Click para leer",
      image: imgInfoCardBasic2,
    },
    {
      id: 3,
      title: "Tips para la hora del paseo",
      subtitle: "Click para leer",
      image: imgInfoCardBasic3,
    },
  ]);

  return (
    <MobileFrame>
      <div className="home-container">
        {/* Header */}
        <div className="home-header">
          <div className="home-header-left">
            <div className="home-logo-container">
            </div>
            <div className="home-greeting">
              <span className="home-greeting-text">Hola, </span>
              <span className="home-greeting-name">{userName}</span>
            </div>
          </div>
          <div className="home-header-icons">
            <Image
              src={lupaSvg}
              alt="Buscar"
              width={20}
              height={20}
              className="home-icon"
            />
            <Image
              src={dividerSvg}
              alt=""
              width={1}
              height={20}
              className="home-icon-divider"
            />
            <Image
              src={campanaSvg}
              alt="Notificaciones"
              width={20}
              height={20}
              className="home-icon"
            />
            <Image
              src={dividerSvg}
              alt=""
              width={1}
              height={20}
              className="home-icon-divider"
            />
            <Image
              src={menuSvg}
              alt="Menú"
              width={20}
              height={20}
              className="home-icon"
            />
          </div>
        </div>

        {/* Line separator */}
        <div className="home-header-line">
          <Image
            src={lineSvg}
            alt="Line separator"
            width={336}
            height={2}
            className="home-line-image"
          />
        </div>

        {/* Mis mascotas */}
        <div className="home-section">
          <div className="home-section-header">
            <h2 className="home-section-title">Mis mascotas</h2>
            <div className="home-section-badge">
              <span>{pets.length}</span>
            </div>
          </div>
          <div className="home-pets-container">
            {pets.map((pet, index) => (
              <div key={pet.id} className="home-pet-card">
                <div className="home-pet-card-content">
                  <div className="home-pet-info">
                    <h3 className="home-pet-name">{pet.name}</h3>
                    <p className="home-pet-breed">{pet.breed}</p>
                  </div>
                  <div className="home-pet-image-wrapper">
                    <div className="home-pet-image-circle">
                      <Image
                        src={pet.image}
                        alt={pet.name}
                        width={120}
                        height={120}
                        className="home-pet-image"
                      />
                    </div>
                  </div>
                  <div className="home-pet-image-elipses">
                    <Image
                      src={elipsesSvg}
                      alt=""
                      width={120}
                      height={120}
                      className="home-elipses-image"
                    />
                  </div>
                </div>
                <div className="home-pet-pattern"></div>
              </div>
            ))}
            <div className="home-pagination">
              <div className="home-pagination-dot active"></div>
            </div>
          </div>
        </div>

        {/* Próximos eventos */}
        <div className="home-section">
          <div className="home-section-header">
            <h2 className="home-section-title">Próximos eventos</h2>
            <div className="home-section-badge">
              <span>{events.length}</span>
            </div>
          </div>
          <div className="home-events-container">
            {events.length === 0 ? (
              <div className="home-empty-card">
                <p className="home-empty-text">
                  No tenés eventos registrados
                </p>
              </div>
            ) : (
              events.map((event) => (
                <div key={event.id} className="home-event-card">
                  {/* Event content */}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Información útil */}
        <div className="home-section">
          <div className="home-section-header">
            <h2 className="home-section-title">Información útil</h2>
          </div>
          <div className="home-info-container">
            {usefulInfo.map((info) => (
              <div key={info.id} className="home-info-card">
                <div className="home-info-image-wrapper">
                  <Image
                    src={info.image}
                    alt={info.title}
                    width={60}
                    height={60}
                    className="home-info-image"
                  />
                </div>
                <div className="home-info-content">
                  <h4 className="home-info-title">
                    {info.title}
                  </h4>
                  <p className="home-info-subtitle">
                    {info.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MobileFrame>
  );
}

