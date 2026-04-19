"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function QuizPage() {
  const { cid, qid } = useParams();
  const router = useRouter();
  useEffect(() => {
    router.replace(`/kambaz/courses/${cid}/quizzes/${qid}/details`);
  }, [cid, qid]);
  return null;
}