import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { CheckCircle, Clock, Zap, Send, AlertCircle, Target, Trophy } from "lucide-react";

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
import Header from "../../layouts/header/Header";

export default function Game() {
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  
  const [gameHasStarted, setGameHasStarted] = useState(false);

  const [currentStep, setCurrentStep] = useState(1);
  const [topColor, setTopColor] = useState(null);
  const [bottomColor, setBottomColor] = useState(null);
  const [symbol, setSymbol] = useState(null);
  const [symbolPosition, setSymbolPosition] = useState(null);
  const [number, setNumber] = useState(null);
  const [numberPosition, setNumberPosition] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);

  const availableColorOptions = availableColors.filter(
    (color) => color.type === 'solid' || color.type === 'pattern'
  );

  const solidColors = availableColors.filter((color) => color.type === 'solid');

  const handleTopColorDrop = (color) => {
    if (hasSubmitted) return;
    if (color.type !== 'solid' && color.type !== 'pattern') {
      alert("Por favor, arrastra un color válido para la parte superior.");
      return;
    }
    setTopColor(color);
  };

  const handleBottomColorDrop = (color) => {
    if (hasSubmitted) return;
    if (color.type !== 'solid' && color.type !== 'pattern') {
      alert("Por favor, arrastra un color válido para la parte inferior.");
      return;
    }
    setBottomColor(color);
  };

  const handleSymbolDrop = (symbol, position) => {
    if (hasSubmitted) return;
    setSymbol(symbol);
    setSymbolPosition(position);
    setCurrentStep((prev) => (prev === 2 ? 3 : prev));
  };

  const handleNumberDrop = (num, position) => {
    if (hasSubmitted) return;
    setNumber(num === 'Sin Número' ? null : num);
    setNumberPosition(position);
    setCurrentStep((prev) => (prev === 3 ? 4 : prev));
  };

  useEffect(() => {
    let progress = 0;
    if (topColor) progress += 25;
    if (bottomColor) progress += 25;
    if (symbol) progress += 25;
    if (number !== null || currentStep >= 4) progress += 25;
    setProgressPercentage(progress);
  }, [topColor, bottomColor, symbol, number, currentStep]);

  useEffect(() => {
    if (topColor && bottomColor && currentStep === 1) {
      setCurrentStep(2);
    }
  }, [topColor, bottomColor, currentStep]);

  useEffect(() => {
    let intervalId;
    if (timeLeft > 0 && !hasSubmitted) {
      intervalId = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(intervalId);
            if (!hasSubmitted) {
              handleAutoSubmit();
            }
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [timeLeft, hasSubmitted]);

  useEffect(() => {
    const pin = localStorage.getItem("gamePin");
    const username = localStorage.getItem("username");
    
    const characterData = localStorage.getItem("selectedCharacter");
    if (characterData) {
      try {
        const character = JSON.parse(characterData);
        setSelectedCharacter(character);
      } catch (error) {
        console.error("Error al cargar personaje:", error);
      }
    }

    if (!username || !pin) {
      navigate("/");
      return;
    }

    setGameHasStarted(true);

    socket.emit("get-current-question", { pin }, (response) => {
      if (response && response.success) {
        if (response.question) {
          setQuestion(response.question);
          setTimeLeft(response.timeLeft || 0);
        }
      }
    });

    socket.on("next-question", ({ question, timeLimit }) => {
      resetGameState();
      setQuestion(question);
      setTimeLeft(timeLimit);
      setGameHasStarted(true);
    });

    socket.on("game-ended", ({ results }) => {
      localStorage.removeItem("selectedCharacter");
      localStorage.removeItem("username");
      navigate("/game-results", { state: { results } });
    });

    socket.on("game-cancelled", () => {
      alert("El juego ha sido cancelado por el administrador");
      localStorage.removeItem("selectedCharacter");
      localStorage.removeItem("username");
      navigate("/");
    });

    socket.on("answer-received", ({ success, message }) => {
      setIsSubmitting(false);
      if (success) {
        setSubmissionStatus('success');
        setShowSuccessAnimation(true);
        setTimeout(() => setShowSuccessAnimation(false), 2000);
      } else {
        setSubmissionStatus('error');
        setTimeout(() => setSubmissionStatus(null), 3000);
      }
    });

    return () => {
      socket.off("next-question");
      socket.off("game-ended");
      socket.off("game-cancelled");
      socket.off("answer-received");
    };
  }, [navigate]);

  const resetGameState = () => {
    setTopColor(null);
    setBottomColor(null);
    setSymbol(null);
    setSymbolPosition(null);
    setNumber(null);
    setNumberPosition(null);
    setCurrentStep(1);
    setIsSubmitting(false);
    setHasSubmitted(false);
    setSubmissionStatus(null);
    setShowSuccessAnimation(false);
    setProgressPercentage(0);
  };

  const handleAutoSubmit = () => {
    if (hasSubmitted) return;
    
    setIsSubmitting(true);
    setHasSubmitted(true);
    setSubmissionStatus('waiting');

    const answer = {
      pictogram: symbol?.id || null,
      colors: [
        topColor?.name?.toLowerCase() || null,
        bottomColor?.name?.toLowerCase() || null
      ].filter(Boolean),
      number: number || null
    };

    const pin = localStorage.getItem("gamePin");
    const responseTime = timeLeft;

    socket.emit("submit-answer", { 
      pin: pin,
      answer: answer,
      responseTime: responseTime
    });
  };

  const submitAnswer = () => {
    if (hasSubmitted || isSubmitting) return;
    
    setIsSubmitting(true);
    setHasSubmitted(true);
    setSubmissionStatus('waiting');

    const answer = {
      pictogram: symbol?.id || null,
      colors: [
        topColor?.name?.toLowerCase() || null,
        bottomColor?.name?.toLowerCase() || null
      ].filter(Boolean),
      number: number || null
    };

    const pin = localStorage.getItem("gamePin");
    const responseTime = timeLeft;

    socket.emit("submit-answer", {
      pin: pin,
      answer: answer,
      responseTime: responseTime
    });
  };

  const canSubmit = () => {
    return topColor && bottomColor && symbol && !hasSubmitted && !isSubmitting;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Header 
        timeLeft={timeLeft} 
        showCreateButton={false}
        selectedCharacter={selectedCharacter}
      />

      <div className={`${styles.gameWrapper} ${hasSubmitted ? styles.submitted : ''}`}>
        {showSuccessAnimation && (
          <div className={styles.successOverlay}>
            <div className={styles.successAnimation}>
              <CheckCircle size={64} />
              <h2>¡Respuesta Enviada!</h2>
              <p>Esperando siguiente pregunta...</p>
            </div>
          </div>
        )}

        <div className={styles.gameContainer}>
          <div className={styles.questionHeader}>
            <div className={styles.questionInfo}>
              <h2 className={styles.questionTitle}>
                {question ? 
                  question.title : 
                  gameHasStarted ? 
                    "Preparando siguiente pregunta..." : 
                    "Esperando inicio del juego..."
                }
              </h2>
              
              {question && (
                <div className={styles.questionMeta}>
                  <div className={styles.timeIndicator}>
                    <Clock size={16} />
                    <span className={timeLeft <= 10 ? styles.timeUrgent : ''}>
                      {timeLeft}s restantes
                    </span>
                  </div>
                  
                  <div className={styles.progressIndicator}>
                    <Target size={16} />
                    <span>Progreso: {progressPercentage}%</span>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill}
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {selectedCharacter && (
              <div className={styles.characterBadge}>
                <img 
                  src={selectedCharacter.image} 
                  alt={selectedCharacter.name}
                  className={styles.characterAvatar}
                />
                <div className={styles.characterInfo}>
                  <span className={styles.characterName}>{selectedCharacter.name}</span>
                  <span className={styles.characterSpecialty}>{selectedCharacter.specialty}</span>
                </div>
              </div>
            )}
          </div>

          <main className={styles.gameLayout}>
            <section className={styles.previewSection}>
              <div className={styles.previewCard}>
                <h3 className={styles.sectionTitle}>
                  <Zap size={20} />
                  Tu Pictograma
                </h3>
                
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
              </div>
            </section>

            <section className={styles.controlsSection}>
              {currentStep === 1 && question && (
                <div className={styles.controlCard}>
                  <ColorPicker 
                    colors={availableColorOptions} 
                    title="Paso 1: Arrastra Colores (Superior / Inferior)" 
                    disabled={hasSubmitted}
                  />
                </div>
              )}

              {currentStep === 2 && question && (
                <div className={styles.controlCard}>
                  <LogoPicker 
                    symbols={availableSymbols} 
                    title="Paso 2: Arrastra un Símbolo (Arriba / Abajo)" 
                    disabled={hasSubmitted}
                  />
                </div>
              )}

              {currentStep === 3 && question && (
                <div className={styles.controlCard}>
                  <NumberPicker 
                    numbers={availableNumbers} 
                    title="Paso 3: Arrastra un Número (Superior / Inferior)" 
                    disabled={hasSubmitted}
                  />
                </div>
              )}

              {currentStep === 4 && !hasSubmitted && question && (
                <div className={styles.controlCard}>
                  <div className={styles.summarySection}>
                    <h3>
                      <Trophy size={20} />
                      ¡Pictograma Listo!
                    </h3>
                    <div className={styles.summaryGrid}>
                      <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>Color Superior:</span>
                        <span className={styles.summaryValue}>{topColor?.name || 'No seleccionado'}</span>
                      </div>
                      <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>Color Inferior:</span>
                        <span className={styles.summaryValue}>{bottomColor?.name || 'No seleccionado'}</span>
                      </div>
                      <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>Símbolo:</span>
                        <span className={styles.summaryValue}>
                          {symbol?.name || 'No seleccionado'} ({symbolPosition || 'N/A'})
                        </span>
                      </div>
                      <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>Número:</span>
                        <span className={styles.summaryValue}>
                          {number || 'Ninguno'} ({numberPosition || 'N/A'})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Estados de Espera */}
              {!question && !gameHasStarted && (
                <div className={styles.waitingCard}>
                  <div className={styles.waitingContent}>
                    <Clock size={48} />
                    <h3>Esperando inicio del juego</h3>
                    <p>El administrador iniciará el juego desde su panel</p>
                    <div className={styles.waitingSpinner} />
                  </div>
                </div>
              )}

              {!question && gameHasStarted && (
                <div className={styles.waitingCard}>
                  <div className={styles.waitingContent}>
                    <Zap size={48} />
                    <h3>Preparando siguiente pregunta</h3>
                    <p>La siguiente pregunta aparecerá en breve</p>
                    <div className={styles.waitingSpinner} />
                  </div>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </DndProvider>
  );
}