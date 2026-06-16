import React, { useState, useEffect, useContext } from 'react';
import { quizData } from './quizData';
import './App.css';

const QuizContext = React.createContext();

export default function App() {
  const [selectedAnswers, setSelectedAnswers] = useState({});

  return (
    <QuizContext.Provider value={{ selectedAnswers, setSelectedAnswers }}>
      <div className="container">
        <Quiz />
      </div>
    </QuizContext.Provider>
  );
}

function Quiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  
  const [currentInput, setCurrentInput] = useState('');

  const [questionData, setQuestionData] = useState(null);

  const { setSelectedAnswers } = useContext(QuizContext);

  useEffect(() => {
    if (currentQuestionIndex < quizData.length) {
      setQuestionData(quizData[currentQuestionIndex]);
      setCurrentInput('');
    } else {
      setIsFinished(true);
    }
  }, [currentQuestionIndex]);

  const handleSelect = (e) => {
    const val = e.target.value;
    setCurrentInput(val);
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: val
    }));
  };

  const handleNext = () => {
    setCurrentQuestionIndex(prev => prev + 1);
  };

  if (isFinished) {
    return <Result />;
  }

  if (!questionData) return null;

  return (
    <div className="quiz-container">
      <h2 className="text-danger">Question {currentQuestionIndex + 1}</h2>
      <p>{questionData.question}</p>
      
      <div className="options-container">
        {questionData.answers.map((ans, idx) => (
          <div className="option" key={idx}>
            <input 
              type="radio" 
              name={`question-${currentQuestionIndex}`} 
              id={`ans-${idx}`} 
              value={ans}
              checked={currentInput === ans}
              onChange={handleSelect} 
            />
            <label htmlFor={`ans-${idx}`}>{ans}</label>
          </div>
        ))}
      </div>
      
      <AnswerFeedback currentQuestionIndex={currentQuestionIndex} />
      
      <br />
      <button className="btn btn-danger mt-3" onClick={handleNext} disabled={!currentInput}>Next</button>
    </div>
  );
}

function AnswerFeedback({ currentQuestionIndex }) {
  const { selectedAnswers } = useContext(QuizContext);
  const selectedAnswer = selectedAnswers[currentQuestionIndex];
  const question = quizData[currentQuestionIndex];

  if (!selectedAnswer) return null;

  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className={`mt-3 ${isCorrect ? 'text-success' : 'text-danger'}`}>
      <strong>{isCorrect ? 'Correct!' : 'Incorrect!'}</strong>
    </div>
  );
}

function Result() {
  const { selectedAnswers } = useContext(QuizContext);
  
  let score = 0;
  quizData.forEach((q, index) => {
    if (selectedAnswers[index] === q.correctAnswer) {
      score++;
    }
  });

  return (
    <div className="result-container">
      <h1 className="text-danger">Quiz Completed!</h1>
      <h3 className="text-secondary">Your score: {score}</h3>
    </div>
  );
}
