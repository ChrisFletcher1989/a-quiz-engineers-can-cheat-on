import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Question2({
  question,
  questionNumber,
  onAnswerSubmit,
  isSubmitted,
  result,
}: any) {
  const [imageUrl, setImageUrl] = useState<string | undefined>(
    question.imageUrl
  );
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("/api/fetchImage", {
          validateStatus: (status) => status === 200 || status === 418,
        });
        const url = response?.data;
        if (url && (url.startsWith("http") || url.startsWith("/"))) {
          setImageUrl(url);
        } else {
          setImageUrl(undefined);
        }
      } catch (error) {
        setImageUrl(undefined);
      }
    })();
  }, []);

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
      {imageUrl && (
        <div className="mb-4">
          <img src={imageUrl} alt="Question Image" className="w-full h-auto" />
        </div>
      )}
      <div className="space-y-3">
        {question.options.map((option: string, index: number) => (
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
            <span className="font-medium mr-3">
              {String.fromCharCode(65 + index)}.
            </span>
            {option}
          </button>
        ))}
      </div>
      {isSubmitted && result && (
        <div
          className={`mt-6 p-4 rounded-lg ${
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
        <div className="flex justify-center mt-6">
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
