"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {/* Question Image */}
      <div className="mb-6 flex justify-center">
        <div className="relative w-full max-w-md h-48 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
          <Image
            src={question.imageUrl || "/next.svg"}
            alt={`Question ${1} illustration`}
            fill
            className="object-contain dark:invert"
            priority={1 <= 3} // Prioritize first few questions
          />
        </div>
      </div>

      {/* Question Text */}
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

        {/* Answer Options */}
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
                      ? "bg-green-100 border-green-500 text-green-800 dark:bg-green-900 dark:border-green-400 dark:text-green-200"
                      : "bg-red-100 border-red-500 text-red-800 dark:bg-red-900 dark:border-red-400 dark:text-red-200"
                    : "bg-blue-100 border-blue-500 text-blue-800 dark:bg-blue-900 dark:border-blue-400 dark:text-blue-200"
                  : isSubmitted && result?.correctAnswer === index
                  ? "bg-green-100 border-green-500 text-green-800 dark:bg-green-900 dark:border-green-400 dark:text-green-200"
                  : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
              } ${isSubmitted ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              <span className={index === 1 ? "correctAnswer" : ""}>
                {String.fromCharCode(65 + index)}.
              </span>
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Result Display */}
      {isSubmitted && result && (
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

      {/* Submit Button */}
      {!isSubmitted && (
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className={`px-6 py-2 font-semibold rounded-lg transition-colors ${
              selectedAnswer !== null
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
            }`}
          >
            Submit Answer
          </button>
        </div>
      )}
    </div>
  );
}
