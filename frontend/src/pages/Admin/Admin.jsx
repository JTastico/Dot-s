import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket, connectSocket, disconnectSocket } from "../../services/websocket/socketService";
import GameCreator from "../../components/admin/GameCreator/GameCreator";
import GameMonitor from "../../components/admin/GameMonitor/GameMonitor";
import ListQuestions from "../../components/admin/GameCreator/ListQuestions";
import styles from "./Admin.module.css";

export default function Admin() {
  const [juegoCreado, setJuegoCreado] = useState(false);
  const [tiempo, setTiempo] = useState("");
  const [codigo, setCodigo] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    connectSocket();

    // Escuchar el evento de finalización del juego
    socket.on("game-ended", ({ results }) => {
      console.log("Resultados finales recibidos en Game.jsx:", results);
      navigate("/game-results", { state: { results } });
    });

    return () => {
      socket.off("game-ended");
      disconnectSocket();
    };
  }, [navigate]);

  const handleCrearJuego = (tiempoJuego) => {
    // Validar si al menos se ha seleccionado un pictograma
    if (selectedQuestions.length === 0) {
      alert("Por favor, selecciona al menos un pictograma antes de crear el juego.");
      return;
    }

    socket.emit("create-game", { timeLimit: parseInt(tiempoJuego), questionIds: selectedQuestions }, (response) => {
      if (response.success) {
        setCodigo(response.pin);
        setTiempo(tiempoJuego);
        setJuegoCreado(true);
      } else {
        alert(response.error || "Error al crear el juego");
      }
    });
  };

  const handleIniciarJuego = () => {
    socket.emit("start-game", { pin: codigo }, (response) => {
      if (!response.success) {
        alert(response.error || "Error al iniciar el juego");
      }
    });
  };

  return (
    <div>
      {!juegoCreado ? (
        <div className={styles.container}>
            <GameCreator onCrearJuego={handleCrearJuego} />
            <ListQuestions onSelectQuestions={setSelectedQuestions} />  
        </div>
      ) : (
        <GameMonitor tiempo={tiempo} codigo={codigo} onIniciarJuego={handleIniciarJuego} />
      )}
    </div>
  );
}
