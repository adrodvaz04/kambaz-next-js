"use client";

import { useParams, redirect } from "next/navigation";

export default function QuizDetails() {
  const {cid, qid} = useParams();
  redirect(`./${qid}/details`);
}
