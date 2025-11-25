import React, { useState, useMemo } from "react";

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return undefined;
}

function formatTime(date: Date) {
  return date.toISOString().replace("T", " ").replace("Z", " UTC");
}

export default function Question3({
  question,
  questionNumber,
  onAnswerSubmit,
  isSubmitted,
  result,
}: any) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // Get quizStartTime from cookie
  const quizStartTime = useMemo(() => {
    const cookie = getCookie("quizStartTime");
    return cookie ? new Date(cookie) : new Date();
  }, []);

  // Calculate answer options
  const options = useMemo(() => {
    if (!quizStartTime || isNaN(quizStartTime.getTime())) {
      return ["Invalid start time", "", "", ""];
    }
    return [
      formatTime(quizStartTime),
      formatTime(new Date(quizStartTime.getTime() + 60 * 1000)), // +1 min
      formatTime(new Date(quizStartTime.getTime() + 5 * 1000)), // +5 sec
      formatTime(new Date(quizStartTime.getTime() - 10 * 1000)), // -10 sec
    ];
  }, [quizStartTime]);

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
      <h2>
        Question {questionNumber}: {question.question}
      </h2>
      <div className="space-y-3">
        {options.map((option: string, index: number) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(index)}
            disabled={isSubmitted}
            className={`w-full rounded-lg border p-4 text-left transition-all duration-200 ${
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
            <span className="mr-3 font-medium">
              {String.fromCharCode(65 + index)}.
            </span>
            {option}
          </button>
        ))}
      </div>
      {isSubmitted && result && (
        <div
          className={`mt-6 rounded-lg border p-4 ${
            result.isCorrect
              ? "border-green-300 bg-green-100"
              : "border-red-300 bg-red-100"
          }`}
        >
          <div
            className={`mb-2 font-semibold ${
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
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className={`rounded-lg px-6 py-2 font-semibold transition-colors ${
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
