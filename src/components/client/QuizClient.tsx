"use client";

import { useState } from "react";
import { checkAnswer, type QuizResult } from "../../app/quiz/actions";
import Question from "./Question";

interface Question {
  id: number;
  question: string;
  options: string[];
}

interface QuizClientProps {
  questions: Question[];
}

export default function QuizClient({ questions }: QuizClientProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [score, setScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(
    new Set()
  );

  const handleAnswerSubmit = async (selectedAnswer: number) => {
    try {
      const questionResult = await checkAnswer(
        questions[currentQuestion].id,
        selectedAnswer
      );
      setResult(questionResult);
      setShowResult(true);

      if (questionResult.isCorrect) {
        setScore(score + 1);
      }

      setAnsweredQuestions(
        (prev) => new Set([...prev, questions[currentQuestion].id])
      );
    } catch (error) {
      console.error("Failed to check answer:", error);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowResult(false);
      setResult(null);
    } else {
      setIsQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setShowResult(false);
    setResult(null);
    setScore(0);
    setIsQuizComplete(false);
    setAnsweredQuestions(new Set());
  };

  if (isQuizComplete) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
            Quiz Complete!
          </h2>
          <div className="mb-6">
            <div className="text-6xl font-bold text-blue-600 mb-2">{score}</div>
            <div className="text-xl text-gray-600 dark:text-gray-300">
              out of {questions.length}
            </div>
          </div>
          <div className="mb-6">
            <div className="text-lg text-gray-700 dark:text-gray-300">
              Your Score: {Math.round((score / questions.length) * 100)}%
            </div>
          </div>
          <button
            onClick={resetQuiz}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Score: {score}/{answeredQuestions.size}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Question Component */}
      <Question
        question={currentQ}
        questionNumber={currentQuestion + 1}
        totalQuestions={questions.length}
        onAnswerSubmit={handleAnswerSubmit}
        isSubmitted={showResult}
        result={result}
      />

      {/* Navigation Buttons */}
      {showResult && (
        <div className="mt-6 flex justify-between">
          <button
            onClick={resetQuiz}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors"
          >
            Reset Quiz
          </button>

          <button
            onClick={handleNextQuestion}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            {currentQuestion < questions.length - 1
              ? "Next Question"
              : "View Results"}
          </button>
        </div>
      )}
    </div>
  );
}
