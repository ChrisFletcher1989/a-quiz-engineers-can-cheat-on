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
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
    imageUrl: "/globe.svg",
  },
  {
    id: 2,
    question:
      "Which programming language is known for its use in web development?",
    options: ["Python", "JavaScript", "C++", "Assembly"],
    correctAnswer: 1,
    imageUrl: "/window.svg",
  },
  {
    id: 3,
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "Home Tool Markup Language",
      "Hyperlinks and Text Markup Language",
      "Hyperlinking Text Managing Language",
    ],
    correctAnswer: 0,
    imageUrl: "/file.svg",
  },
  {
    id: 4,
    question: "Which company developed React?",
    options: ["Google", "Microsoft", "Facebook", "Apple"],
    correctAnswer: 2,
    imageUrl: "/next.svg",
  },
  {
    id: 5,
    question: "What is the result of 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: 1,
    imageUrl: "/vercel.svg",
  },
  {
    id: 6,
    question: "Which of these is a NoSQL database?",
    options: ["MySQL", "PostgreSQL", "MongoDB", "SQLite"],
    correctAnswer: 2,
    imageUrl: "/globe.svg",
  },
  {
    id: 7,
    question: "What does CSS stand for?",
    options: [
      "Computer Style Sheets",
      "Creative Style Sheets",
      "Cascading Style Sheets",
      "Colorful Style Sheets",
    ],
    correctAnswer: 2,
    imageUrl: "/file.svg",
  },
  {
    id: 8,
    question: "Which HTTP status code indicates a successful request?",
    options: ["404", "500", "200", "302"],
    correctAnswer: 2,
    imageUrl: "/window.svg",
  },
  {
    id: 9,
    question: "What is the main purpose of Git?",
    options: [
      "Database management",
      "Version control",
      "Web hosting",
      "File compression",
    ],
    correctAnswer: 1,
    imageUrl: "/next.svg",
  },
  {
    id: 10,
    question: "Which of these is a frontend framework?",
    options: ["Express.js", "Django", "Vue.js", "Laravel"],
    correctAnswer: 2,
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
