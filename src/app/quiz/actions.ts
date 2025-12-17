"use server";

import { cookies } from "next/headers";

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  imageUrl?: string;
}

export interface QuizResult {
  isCorrect: boolean;
  correctAnswer: number;
  explanation?: string;
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "ラオスの首都はどこですか?(英文字で）",
    options: ["Muang Xey", "Muang Xay", "Vientian", "Vientiane"],
    correctAnswer: 3,
    imageUrl: "/globe.svg",
  },
  {
    id: 2,
    question: "なぜ写真が読み込まれなかったのですか？",
    options: [
      "サーバーが忙しくお茶を提供中",
      "写真が見つかりません",
      "画像が破損していました",
      "サーバーが過負荷です",
    ],
    correctAnswer: 0,
    imageUrl: "/window.svg",
  },
  {
    id: 3,
    question: "What time in UTC did you start this quiz?",
    options: ["", "", "", ""],
    correctAnswer: 0,
    imageUrl: "/file.svg",
  },
  {
    id: 4,
    question: "ロンドンは今雨が降っていますか？",
    options: ["はい", "いいえ"],
    correctAnswer: 1, // fixed index: should be 0 or 1
    imageUrl: "/next.svg",
  },
  {
    id: 5,
    question:
      "次の合同式を満たす 0≤n<19×23 の整数 n を求めよ：n≡11(mod19), n≡15(mod23)",
    options: ["440", "422", "443", "429"],
    correctAnswer: 3,
    imageUrl: "/vercel.svg",
  },
];

export async function getQuizQuestions(): Promise<
  Omit<Question, "correctAnswer">[]
> {
  // Return questions without the correct answers to prevent cheating
  return QUIZ_QUESTIONS.map(({ correctAnswer, ...question }) => question);
}

export async function checkAnswer(
  questionId: number,
  selectedAnswer: number
): Promise<QuizResult> {
  const question = QUIZ_QUESTIONS.find((q) => q.id === questionId);

  if (!question) {
    throw new Error("Question not found");
  }

  let isCorrect = false;
  let correctAnswer = question.correctAnswer;
  let explanation = "";

  if (question.id === 3) {
    correctAnswer = 0;
    isCorrect = selectedAnswer === 0;

    const cookieStore = await cookies();
    const cookieValue = cookieStore.get("quizStartTime")?.value || "";
    explanation = isCorrect
      ? "Correct! You selected the quiz start time."
      : `Incorrect. The correct answer was the quiz start time: ${cookieValue}`;
  } else if (question.id === 4) {
    // For question 4, check London weather API
    try {
      const res = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=51.5072&longitude=-0.1276&current=precipitation"
      );
      const data = await res.json();
      const precipitation = data?.current?.precipitation ?? 0;
      const isRaining = precipitation > 0;
      correctAnswer = isRaining ? 0 : 1; // 0 = "Yes", 1 = "No"
      isCorrect = selectedAnswer === correctAnswer;
      explanation = isRaining
        ? "It is currently raining in London."
        : "It is currently not raining in London.";
    } catch (error) {
      // Fallback if API fails
      correctAnswer = 1;
      isCorrect = selectedAnswer === correctAnswer;
      explanation = "Could not verify London weather.";
    }
  } else {
    isCorrect = selectedAnswer === question.correctAnswer;
    explanation = `The correct answer is: ${
      question.options[question.correctAnswer]
    }`;
  }

  return {
    isCorrect,
    correctAnswer,
    explanation,
  };
}
