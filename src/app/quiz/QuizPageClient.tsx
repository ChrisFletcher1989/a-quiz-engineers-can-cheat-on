"use client";

import { useEffect } from "react";
import QuizClient from "../../components/client/QuizClient";

export default function QuizPageClient({ questions }: { questions: any }) {
  useEffect(() => {
    const now = new Date().toISOString();
    document.cookie = `quizStartTime=${now}; path=/`;
    console.log("Cookie set from QuizPageClient:", document.cookie);
  }, []);

  return <QuizClient questions={questions} />;
}
