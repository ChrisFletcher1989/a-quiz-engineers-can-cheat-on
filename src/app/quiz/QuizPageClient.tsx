"use client";

import { useEffect } from "react";
import QuizClient from "../../components/client/QuizClient";

export default function QuizPageClient({ questions }: { questions: any }) {
  useEffect(() => {
    const now = new Date().toISOString();
    document.cookie = `quizStartTime=${now}; path=/`;
  }, []);

  return <QuizClient questions={questions} />;
}
