import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { socket, connectSocket } from "../../services/websocket/socketService";
import styles from "./JoinGame.module.css";
import Input from "../../components/common/Input/Input";

export default function JoinGame() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Estado para controlar la pantalla de carga
  const navigate = useNavigate();

  const handleSubmit = () => {
    const pin = localStorage.getItem("gamePin");

    if (!username.trim()) {
      setError("Por favor ingresa un nombre");
      return;
    }

    setLoading(true); // Mostrar pantalla de carga

    connectSocket();

    socket.emit("join-game", { pin, username }, (response) => {
      setLoading(false); // Ocultar pantalla de carga
      if (response.success) {
        console.log("Conectado al juego. Redirigiendo a la pantalla de juego...");
        navigate("/game");
      } else {
        setError(response.error || "Error al unirse al juego");
      }
    });
  };

  return (
    <div className={styles.joinWrapper}>
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
          <p>Conectando al juego...</p>
        </div>
      )}
      <div className={styles.joinContainer}>
        <img src={logo} alt="logo" />
        <h1>Unirse al Juego</h1>
      </div>
      <Input
        placeholder="Tu nombre"
        buttonText="Comenzar"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onSubmit={handleSubmit}
        disabled={loading} // Deshabilitar botón si está cargando
      />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
