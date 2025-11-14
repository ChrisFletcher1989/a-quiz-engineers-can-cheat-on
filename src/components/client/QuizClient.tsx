"use client";

import { useState } from "react";
import { checkAnswer, type QuizResult } from "../../app/quiz/actions";

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
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [score, setScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(
    new Set()
  );

  const handleAnswerSelect = (answerIndex: number) => {
    if (!showResult) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleSubmitAnswer = async () => {
    if (selectedAnswer === null) return;

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
      setSelectedAnswer(null);
      setShowResult(false);
      setResult(null);
    } else {
      setIsQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
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

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
            {currentQ.question}
          </h2>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                className={`w-full p-4 text-left rounded-lg border transition-all duration-200 ${
                  selectedAnswer === index
                    ? showResult
                      ? result?.correctAnswer === index
                        ? "bg-green-100 border-green-500 text-green-800 dark:bg-green-900 dark:border-green-400 dark:text-green-200"
                        : "bg-red-100 border-red-500 text-red-800 dark:bg-red-900 dark:border-red-400 dark:text-red-200"
                      : "bg-blue-100 border-blue-500 text-blue-800 dark:bg-blue-900 dark:border-blue-400 dark:text-blue-200"
                    : showResult && result?.correctAnswer === index
                    ? "bg-green-100 border-green-500 text-green-800 dark:bg-green-900 dark:border-green-400 dark:text-green-200"
                    : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                } ${showResult ? "cursor-not-allowed" : "cursor-pointer"}`}
              >
                <span className="font-medium mr-3">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Result Display */}
        {showResult && result && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              result.isCorrect
                ? "bg-green-100 border border-green-300 dark:bg-green-900 dark:border-green-700"
                : "bg-red-100 border border-red-300 dark:bg-red-900 dark:border-red-700"
            }`}
          >
            <div
              className={`font-semibold mb-2 ${
                result.isCorrect
                  ? "text-green-800 dark:text-green-200"
                  : "text-red-800 dark:text-red-200"
              }`}
            >
              {result.isCorrect ? "✅ Correct!" : "❌ Incorrect"}
            </div>
            <div
              className={
                result.isCorrect
                  ? "text-green-700 dark:text-green-300"
                  : "text-red-700 dark:text-red-300"
              }
            >
              {result.explanation}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={resetQuiz}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors"
          >
            Reset Quiz
          </button>

          <div className="space-x-3">
            {!showResult ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className={`px-6 py-2 font-semibold rounded-lg transition-colors ${
                  selectedAnswer !== null
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
                }`}
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                {currentQuestion < questions.length - 1
                  ? "Next Question"
                  : "View Results"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
