import React, { useState, useEffect } from "react";
import styles from "./ListQuestions.module.css";

export default function ListQuestions({ onSelectQuestions }) {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  useEffect(() => {
    fetch('/api/questions')
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => console.error("Error fetching questions:", err));
  }, []);

  const toggleQuestionSelection = (questionId) => {
    setSelectedQuestions((prevSelected) =>
      prevSelected.includes(questionId)
        ? prevSelected.filter((id) => id !== questionId)
        : [...prevSelected, questionId]
    );
  };

  useEffect(() => {
    onSelectQuestions(selectedQuestions);
  }, [selectedQuestions, onSelectQuestions]);

  return (
    <div className={styles.questionsGrid}>
      {questions.map((question) => (
        <div
          key={question._id}
          className={`${styles.questionCard} ${
            selectedQuestions.includes(question._id) ? styles.questionCardSelected : ""
          }`}
          onClick={() => toggleQuestionSelection(question._id)}
        >
          <h4>{question.title}</h4>
        </div>
      ))}
    </div>
  );
}
