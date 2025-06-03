import React, { useState, useEffect } from "react";
import Card from "../../components/game/Card/Card";
import styles from "./Game.module.css";
import Board from "../../components/game/Board/Board";
import PictogramList from "../../components/game/PictogramList/PictogramList";
import Number from "../../components/game/Number/Number";
import { socket } from "../../services/websocket/socketService";
import { useNavigate } from "react-router-dom";
import GameButton from "../../components/common/Button/GameButton";

export default function Game() {
  const COLORS = ["white", "red", "black", "yellow", "blue", "green", "orange"];
  const NUMBERS = [1, 2, 2.1, 2.2, 2.3, 3, 4.1, 4.2, 4.3, 5.1, 5.2, 6.1, 6.2, 7, 8, 9];
  const navigate = useNavigate();

  const [topPictogram, setTopPictogram] = useState(null);
  const [centerCards, setCenterCards] = useState([]);
  const [bottomNumber, setBottomNumber] = useState(null);

  const [question, setQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [visualTimeLeft, setVisualTimeLeft] = useState(null); // Nuevo estado para la cuenta regresiva visual
  const [loadingNext, setLoadingNext] = useState(false); // Estado para la pantalla de carga
  const [message, setMessage] = useState("");
  const [hasAnswered, setHasAnswered] = useState(false);

  useEffect(() => {
    const pin = localStorage.getItem("gamePin");

    socket.emit("request-current-question", { pin }, (response) => {
      if (response.success) {
        setQuestion(response.question);
        setTimeLeft(response.timeLeft);
        setVisualTimeLeft(response.timeLeft);
      } else {
        console.log(response.error || "Esperando a que el juego inicie");
      }
    });

    socket.on("game-started", ({ question, timeLimit }) => {
      setQuestion(question);
      setTimeLeft(timeLimit);
      setVisualTimeLeft(timeLimit);
      setHasAnswered(false);
      setMessage("");
      setLoadingNext(false); 
      resetBoard();
    });

    socket.on("player-answered", ({ playerId, isCorrect }) => {
      if (socket.id === playerId) {
        setMessage(isCorrect ? "¡Respuesta correcta!" : "Respuesta incorrecta.");
        setHasAnswered(true);
      }
    });

    socket.on("game-ended", ({ results }) => {
      console.log("Resultados finales recibidos en Game.jsx:", results);
      navigate("/game-results", { state: { results } });
    });

    return () => {
      socket.off("game-started");
      socket.off("player-answered");
      socket.off("game-ended");
    };
  }, [navigate]);

  // Temporizador para la cuenta regresiva real
  useEffect(() => {
    if (timeLeft === null || hasAnswered) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          confirmResults(); // Llamar a confirmResults directamente al agotar el tiempo
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, hasAnswered]);

  // Temporizador para la cuenta regresiva visual (pantalla de carga)
  useEffect(() => {
    if (!loadingNext || visualTimeLeft === null) return;

    const visualTimer = setInterval(() => {
      setVisualTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(visualTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(visualTimer);
  }, [loadingNext, visualTimeLeft]);

  const resetBoard = () => {
    setTopPictogram(null);
    setCenterCards([]);
    setBottomNumber(null);
  };

  const movePictogramToTop = (pictogram) => setTopPictogram(pictogram);
  const removePictogram = () => setTopPictogram(null);

  const moveCardToCenter = (color) => {
    if (centerCards.length < 3 && !centerCards.includes(color)) {
      setCenterCards([...centerCards, color]);
    }
  };
  const removeCardFromCenter = (index) => setCenterCards(centerCards.filter((_, i) => i !== index));
  const moveNumberToBottom = (number) => setBottomNumber(number);
  const removeNumberFromBottom = () => setBottomNumber(null);

  const confirmResults = () => {
    if (hasAnswered) return;

    const pin = localStorage.getItem("gamePin");
    const answer = {
      pictogram: topPictogram ? topPictogram.id : null,
      colors: centerCards,
      number: bottomNumber,
    };

    setLoadingNext(true); // Activa la pantalla de carga
    setVisualTimeLeft(timeLeft); // Sincroniza la cuenta regresiva visual con la real

    socket.emit("submit-answer", { pin, answer, responseTime: timeLeft || 0 }, (response) => {
      if (response.success) {
        setMessage(response.isCorrect ? "¡Respuesta correcta!" : "Respuesta incorrecta.");
        setHasAnswered(true);
      }
    });
  };

  return (
    <div className={styles.gameWrapper}>
      {loadingNext && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
          <p>Siguiente pregunta en: {visualTimeLeft} segundos</p>
        </div>
      )}
      <div className={styles.gameContainer}>
        <div className={styles.questionContainer}>
          <h2>{question ? question.title : "Esperando pregunta..."}</h2>
          {timeLeft !== null && <p>Tiempo restante: {timeLeft} segundos</p>}
          <p>{message}</p>
        </div>

        <PictogramList
          onPictogramSelect={movePictogramToTop}
          selectedPictogram={topPictogram}
        />
        <Board
          topPictogram={topPictogram}
          onPictogramRemove={removePictogram}
          centerCards={centerCards}
          onCardRemove={removeCardFromCenter}
          bottomNumber={bottomNumber}
          onNumberRemove={removeNumberFromBottom}
        />

        <div className={styles.numbersContainer}>
          {NUMBERS.map((number, index) => (
            <Number
              key={index}
              number={number}
              onClick={() => moveNumberToBottom(number)}
              disabled={bottomNumber !== null}
            />
          ))}
        </div>
      </div>

      <div className={styles.acceptButton}>
        <GameButton
          onClick={confirmResults}
          disabled={
            !topPictogram || centerCards.length === 0 || bottomNumber === null || hasAnswered
          }
        >
          Confirmar
        </GameButton>
      </div>

      <div className={styles.cardContainer}>
        {COLORS.map((color, index) => (
          <Card
            key={index}
            cardColor={color}
            onClick={() => moveCardToCenter(color)}
            inHand={true}
          />
        ))}
      </div>
    </div>
  );
}
