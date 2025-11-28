"use server";

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

// Mock quiz data - in a real app this would come from a database
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
    options: [
      "", //todo add times
      "",
      "",
      "",
    ],
    correctAnswer: 0,
    imageUrl: "/file.svg",
  },
  {
    id: 4,
    question: "ロンドンは今雨が降っていますか？",
    options: ["はい", "いいえ"],
    correctAnswer: 2, //todo call weather API and render answer accordingly
    imageUrl: "/next.svg",
  },
  {
    id: 5,
    question:
      "次の合同式を満たす 0≤n&lt;19×23 の整数 n を求めよ：n≡4(mod19), n≡8(mod23)",
    options: ["440", "441", "443", "422"],
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

  const isCorrect = selectedAnswer === question.correctAnswer;

  return {
    isCorrect,
    correctAnswer: question.correctAnswer,
    explanation: `The correct answer is: ${
      question.options[question.correctAnswer]
    }`,
  };
}
