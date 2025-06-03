// src/pages/Home/Home.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import Input from "../../components/common/Input/Input"; // Tu componente Input original
import logo from "../../assets/images/logo.png"; // Tu logo grande para el formulario PIN

import { Sidebar } from "../../components/Sidebar";
import { SectionContent } from "../../components/SectionContent";

import {
  MENU_ITEMS,
  HOME_SECTION_DATA,
  JOIN_GAME_SECTION_DATA, // Importa la nueva constante
  GAME_SECTION_DATA,
  ANALYTICS_SECTION_DATA,
} from "../../utils/constants";

export default function Home() {
  const [pin, setPin] = useState("");
  const navigate = useNavigate();
  // Establece 'join_game' como la sección inicial si quieres que el PIN sea lo primero que vea el usuario.
  const [activeSection, setActiveSection] = useState('join_game'); 
  const [currentUser, setCurrentUser] = useState({ avatar: 'G', name: 'Usuario' });

  const handleSubmitPin = () => {
    if (!pin.trim()) {
      alert("Por favor, ingresa un PIN válido."); // Puedes usar una validación más sofisticada
      return;
    }
    localStorage.setItem("gamePin", pin);
    navigate("/join"); // Redirige a la pantalla de ingreso al juego con el PIN
  };

  const handleCreateGame = () => {
    alert("Redirigiendo a la funcionalidad de crear juego.");
    navigate("/admin");
  };

  const getCurrentSectionData = () => {
    const data = { ...HOME_SECTION_DATA }; // Crea una copia para modificar

    switch (activeSection) {
      case 'dashboard':
        return HOME_SECTION_DATA;
      case 'join_game':
        // Carga los datos base de JOIN_GAME_SECTION_DATA
        const joinData = { ...JOIN_GAME_SECTION_DATA };
        // Sobreescribe el onClick del botón "Unirse" para que llame a handleSubmitPin
        joinData.buttons = joinData.buttons.map(button =>
          button.label === "Unirse" ? { ...button, onClick: handleSubmitPin } : button
        );
        return joinData;
      case 'my_games':
        return GAME_SECTION_DATA;
      case 'analytics':
        return ANALYTICS_SECTION_DATA;
      default:
        return HOME_SECTION_DATA;
    }
  };

  return (
    <div className={styles.homePageWrapper}>
      {/* ... (Tu Header global si lo tienes aquí, o en App.js) ... */}
      {/* Ejemplo de cómo el Header de TSX podría ser el header superior si lo integras aquí */}
      {/* <Header title="Dashboard" user={currentUser} /> */}


      <div className={styles.mainContentArea}>
        <div className={styles.sidebarContainer}>
          <Sidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            onCreateGame={handleCreateGame}
          />
        </div>

        <div className={styles.contentSection}>
          {/* El contenido específico de la sección de PIN */}
          {activeSection === 'join_game' && (
            <SectionContent {...getCurrentSectionData()} />
          )}
            <div className={styles.pinFormContainer}> {/* Nueva clase para estilizar el contenedor del PIN */}
                <Input
                    placeholder="Ingresa el PIN del juego"
                    buttonText="Unirse" // Este botón del input se puede ocultar si solo quieres el de SectionContent
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    onSubmit={handleSubmitPin} // La lógica de submit para el Input
                />
            </div>
        </div>
      </div>
    </div>
  );
}