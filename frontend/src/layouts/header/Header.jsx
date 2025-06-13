import React from "react";
import styles from "./Header.module.css";
import logo from "../../assets/images/logo.png";
import { Gamepad2 } from "lucide-react";

export default function Header({ children, timeLeft, showCreateButton = true }) {
  const handleCreateGame = () => {
    //lógica para crear una partida
    console.log("Crear partida clickeado");
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoSection}>
        <img src={logo} alt="DOT'S GO Logo" className={styles.headerLogo} />
        <span className={styles.headerTitle}>DOT'S GO!!</span>
      </div>
      {showCreateButton && (
        <button className={styles.createGameBtn} onClick={handleCreateGame}>
          <Gamepad2 size={20} />
          Crear Partida
        </button>
      )}
      
      {timeLeft !== null && (
        <div className={`${styles.timer} ${timeLeft <= 10 ? styles.lowTime : ''}`}>
          ⏱️ {timeLeft}s
        </div>
      )}
      
      {children}
      
    </header>
  );
}

/*
<header className={styles.header}>
      <Link to="/"><img src={logo_small} /></Link>
      <nav className={styles.headerNav}>
        {/* <Link to="/login">
          <Button children="Iniciar Sesión" />
        </Link>
        <Link to="/register">
          <Button children="Registrarse" />
        </Link>}
        <Link to="/admin">
          <Button children="Crear partida" />
        </Link>
      </nav>
    </header>
*/