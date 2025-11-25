import React, { useState, useEffect } from "react";

export default function Question4({
  question,
  questionNumber,
  onAnswerSubmit,
  isSubmitted,
  result,
}: any) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isRaining, setIsRaining] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=51.5072&longitude=-0.1276&current=precipitation"
        );
        const data = await res.json();
        const precipitation = data?.current?.precipitation;
        setIsRaining(precipitation > 0);
      } catch {
        setIsRaining(null);
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
  }, []);

  const options = ["Yes", "No"];
  const correctAnswer = isRaining === null ? null : isRaining ? 0 : 1;

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
      <h2>Question {questionNumber}: Is it raining in London right now?</h2>
      {loading ? (
        <div className="mb-4 text-gray-500">Checking London weather...</div>
      ) : null}
      <div className="space-y-3">
        {options.map((option: string, index: number) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(index)}
            disabled={isSubmitted || loading}
            className={`w-full rounded-lg border p-4 text-left transition-all duration-200 ${
              selectedAnswer === index
                ? isSubmitted
                  ? correctAnswer === index
                    ? "bg-green-100 border-green-500 text-green-800"
                    : "bg-red-100 border-red-500 text-red-800"
                  : "bg-blue-100 border-blue-500 text-blue-800"
                : isSubmitted && correctAnswer === index
                ? "bg-green-100 border-green-500 text-green-800"
                : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
            } ${
              isSubmitted || loading ? "cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <span className="mr-3 font-medium">
              {String.fromCharCode(65 + index)}.
            </span>
            {option}
          </button>
        ))}
      </div>
      {isSubmitted && correctAnswer !== null && (
        <div
          className={`mt-6 rounded-lg border p-4 ${
            selectedAnswer === correctAnswer
              ? "border-green-300 bg-green-100"
              : "border-red-300 bg-red-100"
          }`}
        >
          <div
            className={`mb-2 font-semibold ${
              selectedAnswer === correctAnswer
                ? "text-green-800"
                : "text-red-800"
            }`}
          >
            {selectedAnswer === correctAnswer ? "✅ Correct!" : "❌ Incorrect"}
          </div>
          <div
            className={
              selectedAnswer === correctAnswer
                ? "text-green-700"
                : "text-red-700"
            }
          >
            {isRaining === null
              ? "Could not determine the weather."
              : isRaining
              ? "It is currently raining in London."
              : "It is currently not raining in London."}
          </div>
        </div>
      )}
      {!isSubmitted && !loading && (
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
