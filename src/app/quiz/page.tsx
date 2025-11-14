import { getQuizQuestions } from "./actions";
import QuizClient from "../../components/client/QuizClient";

export default async function QuizPage() {
  const questions = await getQuizQuestions();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Engineering Quiz
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Test your knowledge with these 10 multiple choice questions
          </p>
        </header>

        <QuizClient questions={questions} />
      </div>
    </div>
  );
}
