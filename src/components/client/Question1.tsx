"use client";

import { useState, useEffect } from "react";

interface QuestionProps {
  question: {
    id: number;
    question: string;
    options: string[];
    imageUrl?: string;
  };
  totalQuestions: number;
  onAnswerSubmit: (selectedAnswer: number) => void;
  isSubmitted: boolean;
  result?: {
    isCorrect: boolean;
    correctAnswer: number;
    explanation?: string;
  } | null;
}

export default function Question({
  question,
  totalQuestions,
  onAnswerSubmit,
  isSubmitted,
  result,
}: QuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleAnswerSelect = (answerIndex: number) => {
    if (!isSubmitted) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      onAnswerSubmit(selectedAnswer);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Question {1} of {totalQuestions}
          </span>
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
            #{question.id}
          </span>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
          {question.question}
        </h2>
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={isSubmitted}
              className={`w-full p-4 text-left rounded-lg border transition-all duration-200 ${
                selectedAnswer === index
                  ? isSubmitted
                    ? result?.correctAnswer === index
                      ? "bg-green-100 border-green-500 text-green-800"
                      : "bg-red-100 border-red-500 text-red-800"
                    : "bg-blue-100 border-blue-500 text-blue-800"
                  : isSubmitted && result?.correctAnswer === index
                  ? "bg-green-100 border-green-500 text-green-800"
                  : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
              } ${isSubmitted ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              <span className={index === 3 ? "correctAnswer" : ""}>
                {String.fromCharCode(65 + index)}.
              </span>
              {option}
            </button>
          ))}
        </div>
      </div>
      {isSubmitted && result && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            result.isCorrect
              ? "bg-green-100 border border-green-300"
              : "bg-red-100 border border-red-300"
          }`}
        >
          <div
            className={`font-semibold mb-2 ${
              result.isCorrect ? "text-green-800" : "text-red-800"
            }`}
          >
            {result.isCorrect ? "✅ Correct!" : "❌ Incorrect"}
          </div>
          <div className={result.isCorrect ? "text-green-700" : "text-red-700"}>
            {result.explanation}
          </div>
        </div>
      )}
      {!isSubmitted && (
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className={`px-6 py-2 font-semibold rounded-lg transition-colors ${
              selectedAnswer !== null
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Submit Answer
          </button>
        </div>
      )}
    </div>
  );
}
