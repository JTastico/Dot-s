import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { socket } from "../../services/websocket/socketService";
import styles from "./Game.module.css";

import {
  availableColors,
  availableSymbols,
  availableNumbers,
} from "../../components/game/Designer/pictogramData";

import LivePreviewRombo from "../../components/game/LivePreview/LivePreviewRombo";
import ColorPicker from "../../components/game/ColorPicker/ColorPicker";
import LogoPicker from "../../components/game/LogoPicker/LogoPicker";
import NumberPicker from "../../components/game/NumberPicker/NumberPicker";

export default function Game() {
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [topColor, setTopColor] = useState(null);
  const [bottomColor, setBottomColor] = useState(null);
  const [symbol, setSymbol] = useState(null);
  const [symbolPosition, setSymbolPosition] = useState(null);
  const [number, setNumber] = useState(null);
  const [numberPosition, setNumberPosition] = useState(null); // nuevo

  const solidColors = availableColors.filter((color) => color.type === 'solid');

  const handleTopColorDrop = (color) => {
    if (color.type !== 'solid') {
      alert("Por favor, arrastra un color sólido para la parte superior.");
      return;
    }
    setTopColor(color);
  };

  const handleBottomColorDrop = (color) => {
    if (color.type !== 'solid') {
      alert("Por favor, arrastra un color sólido para la parte inferior.");
      return;
    }
    setBottomColor(color);
  };

  const handleSymbolDrop = (symbol, position) => {
    setSymbol(symbol);
    setSymbolPosition(position);
    setCurrentStep((prev) => (prev === 2 ? 3 : prev));
  };

  const handleNumberDrop = (num, position) => {
    setNumber(num === 'Sin Número' ? null : num);
    setNumberPosition(position);
    setCurrentStep((prev) => (prev === 3 ? 4 : prev));
  };

  useEffect(() => {
    if (topColor && bottomColor && currentStep === 1) {
      setCurrentStep(2);
    }
  }, [topColor, bottomColor, currentStep]);

  useEffect(() => {
    const pin = localStorage.getItem("gamePin");

    socket.emit("request-current-question", { pin }, (response) => {
      if (response.success) {
        setQuestion(response.question);
        setTimeLeft(response.timeLeft);
      } else {
        console.log(response.error || "Esperando a que el juego inicie");
      }
    });

    socket.on("game-started", ({ question, timeLimit }) => {
      setQuestion(question);
      setTimeLeft(timeLimit);
      setTopColor(null);
      setBottomColor(null);
      setSymbol(null);
      setSymbolPosition(null);
      setNumber(null);
      setNumberPosition(null);
      setCurrentStep(1);
    });

    socket.on("game-ended", ({ results }) => {
      navigate("/game-results", { state: { results } });
    });

    return () => {
      socket.off("game-started");
      socket.off("game-ended");
    };
  }, [navigate]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.gameWrapper}>
        <div className={styles.gameContainer}>
          <div className={styles.questionContainer}>
            <h2>{question ? question.title : "Esperando pregunta..."}</h2>
            {timeLeft !== null && <p>Tiempo restante: {timeLeft} segundos</p>}
          </div>

          <main className="designerLayout">
            <section className="previewSection">
              <LivePreviewRombo
                topColorOption={topColor}
                bottomColorOption={bottomColor}
                symbolOption={symbol}
                symbolPosition={symbolPosition}
                number={number}
                numberPosition={numberPosition}
                onTopColorDrop={handleTopColorDrop}
                onBottomColorDrop={handleBottomColorDrop}
                onSymbolDrop={handleSymbolDrop}
                onNumberDrop={handleNumberDrop}
              />
            </section>

            <section className="controlsSection">
              {currentStep === 1 && (
                <ColorPicker colors={solidColors} title="Paso 1: Arrastra Colores (Superior / Inferior)" />
              )}

              {currentStep === 2 && (
                <LogoPicker symbols={availableSymbols} title="Paso 2: Arrastra un Símbolo (Arriba / Abajo)" />
              )}

              {currentStep === 3 && (
                <NumberPicker numbers={availableNumbers} title="Paso 3: Arrastra un Número (Superior / Inferior)" />
              )}

              {currentStep === 4 && (
                <div className="summarySection">
                  <h2>¡Pictograma Configurado!</h2>
                  <p><strong>Color Superior:</strong> {topColor?.name || 'No seleccionado'}</p>
                  <p><strong>Color Inferior:</strong> {bottomColor?.name || 'No seleccionado'}</p>
                  <p><strong>Símbolo:</strong> {symbol?.name || 'No seleccionado'} ({symbolPosition || 'N/A'})</p>
                  <p><strong>Número:</strong> {number || 'Ninguno'} ({numberPosition || 'N/A'})</p>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </DndProvider>
  );
}
