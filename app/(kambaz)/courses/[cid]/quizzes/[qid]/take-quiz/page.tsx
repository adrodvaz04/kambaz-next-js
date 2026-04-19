"use client";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import {
  resetTakeQuiz,
  setAttemptInfo,
  setPhase,
  setQuiz,
  setSubmission,
} from "./reducer";

import { useEffect, useState } from "react";
import * as client from "../../client";
import { Answer, Quiz, QuizAttempt, QuizQuestion } from "../../types";

export default function TakeQuiz() {
  const { qid, cid } = useParams();
  const dispatch = useDispatch();

  const { phase, score, showAnswers } = useSelector(
    (state: RootState) => state.takeQuizReducer,
  );
  const quiz = useSelector(
    (state: RootState) => state.takeQuizReducer.quiz,
  ) as Quiz | null;

  const attemptsInfo = useSelector(
    (state: RootState) => state.takeQuizReducer.attemptsInfo,
  ) as any | null;

  const [answers, setAnswers] = useState<
    { question_id: string; answer: string }[]
  >([]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  ) as any;

  const router = useRouter();

  // loading quiz

  useEffect(() => {
    const loadQuiz = async () => {
      if (!qid || Array.isArray(qid)) return;

      const quizDataResponse = await client.getQuizById(qid);
      const quizData: Quiz = Array.isArray(quizDataResponse)
        ? quizDataResponse[0]
        : quizDataResponse;
      dispatch(setQuiz(quizData));

      console.log(quizData);

      // get attempts for current user on this quiz

      let attemptsData = {
        remaining: quizData.max_attempts ?? 1,
        attempts: [] as QuizAttempt[],
      };

      try {
        const allAttempts = await client.getQuizAttemptsByUser();
        const quizAttempts = Array.isArray(allAttempts)
          ? allAttempts.filter(
              (attempt: QuizAttempt) => attempt.quiz_id === qid,
            )
          : (allAttempts.attempts ?? []).filter(
              (attempt: QuizAttempt) => attempt.quiz_id === qid,
            );

        attemptsData = {
          attempts: quizAttempts,
          remaining: Math.max(0, quizData.max_attempts - quizAttempts.length),
        };
      } catch (err) {
        console.log("no fetched attempts found", err);
      }
      dispatch(setAttemptInfo(attemptsData));

      // if there's no attempts left
      console.log(
        "remaining:",
        attemptsData.remaining,
        "attempts:",
        attemptsData.attempts,
      );

      if (attemptsData.remaining === 0) {
        const lastAttempt = attemptsData.attempts[0];

        dispatch(
          setSubmission({
            score: lastAttempt.score ?? 0,
            showAnswers: quizData.show_correct_answers,
          }),
        );
        dispatch(setPhase("submitted"));
        return;
      }
      dispatch(setPhase(quizData.access_code ? "access-code" : "taking"));
    };

    dispatch(resetTakeQuiz());
    loadQuiz();
  }, [qid, dispatch]);

  // grab correct answer
  const getAnswer = (questionId: string) =>
    answers.find((a) => a.question_id === questionId)?.answer ?? "";

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => {
      const existing = prev.findIndex((a) => a.question_id === questionId);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { question_id: questionId, answer };
        return updated;
      }
      return [...prev, { question_id: questionId, answer }];
    });
  };

  const handleSubmit = async () => {
    if (!quiz || !qid || Array.isArray(qid) || !currentUser) return;
    setSubmitting(true);

    try {
      let earned_points = 0;
      quiz.questions.forEach((q: QuizQuestion) => {
        const submitted = answers.find((a) => a.question_id === q._id);
        if (
          submitted?.answer === q.answers.find((a: Answer) => a.correct)?.text
        ) {
          earned_points += q.points;
        }
      });

      await client.addQuizAttempt({
        answers,
        score: earned_points,
        quiz_id: qid,
        user_id: currentUser._id,
        attemptDate: new Date(),
      });

      dispatch(
        setSubmission({
          score: earned_points,
          showAnswers: quiz.show_correct_answers,
        }),
      );
      dispatch(setPhase("submitted"));
    } catch (err) {
      console.log("Failed to submit quiz:", err);
    }

    setSubmitting(false);
  };

  // access code
  const accessCodeSubmit = () => {
    if (!quiz) return;
  };

  // handle retake quiz
  const handleRetakeQuiz = async () => {
    if (!attemptsInfo || attemptsInfo.remaining <= 0) return;

    // Reset state for new attempt
    setAnswers([]);
    setCurrentQuestionIndex(0);
    dispatch(resetTakeQuiz());

    // Reload quiz and attempts data
    if (!qid || Array.isArray(qid)) return;

    try {
      const quizDataResponse = await client.getQuizById(qid);
      const quizData: Quiz = Array.isArray(quizDataResponse)
        ? quizDataResponse[0]
        : quizDataResponse;
      dispatch(setQuiz(quizData));

      const allAttempts = await client.getQuizAttemptsByUser();
      const quizAttempts = Array.isArray(allAttempts)
        ? allAttempts.filter((attempt: QuizAttempt) => attempt.quiz_id === qid)
        : (allAttempts.attempts ?? []).filter(
            (attempt: QuizAttempt) => attempt.quiz_id === qid,
          );

      const newAttemptsData = {
        attempts: quizAttempts,
        remaining: Math.max(0, quizData.max_attempts - quizAttempts.length),
      };
      dispatch(setAttemptInfo(newAttemptsData));
      dispatch(setPhase("taking"));
    } catch (err) {
      console.log("Failed to retake quiz:", err);
    }
  };

  const renderQuestion = (q: QuizQuestion, index: number) => {
    const selected = getAnswer(q._id);
    return (
      <div key={index}>
        <p>
          {index + 1}. {q.question} ({q.points} pts)
        </p>

        {q.questionType === "Multiple Choice" &&
          q.answers.map((opt: Answer, i: number) => (
            <div key={i}>
              <input
                type="radio"
                name={`q-${q._id}`}
                id={`q-${q._id}-${i}`}
                value={opt.text}
                checked={selected === opt.text}
                onChange={() => handleAnswerChange(q._id, opt.text)}
                disabled={phase === "submitted"}
              />
              <label htmlFor={`q-${q._id}-${i}`}>
                {opt.text}
                {showAnswers &&
                  opt === q.answers.find((a: Answer) => a.correct) &&
                  " ✓"}
                {showAnswers &&
                  selected === opt.text &&
                  opt !== q.answers.find((a: Answer) => a.correct) &&
                  " ✗"}
              </label>
            </div>
          ))}
        {q.questionType === "True/False" &&
          ["True", "False"].map((opt) => (
            <div key={opt}>
              <input
                type="radio"
                name={`q-${q._id}`}
                id={`q-${q._id}-${opt}`}
                value={opt}
                checked={selected === opt}
                onChange={() => handleAnswerChange(q._id, opt)}
                disabled={phase === "submitted"}
              />
              <label htmlFor={`q-${q._id}-${opt}`}>
                {opt}
                {showAnswers &&
                  opt === q.answers.find((a: Answer) => a.correct)?.text &&
                  " ✓"}
                {showAnswers &&
                  selected === opt &&
                  opt !== q.answers.find((a: Answer) => a.correct)?.text &&
                  " ✗"}
              </label>
            </div>
          ))}

        {q.questionType === "Fill-in-the-blank" && (
          <div>
            <input
              type="text"
              value={selected}
              placeholder="Your answer..."
              onChange={(e) => handleAnswerChange(q._id, e.target.value)}
              disabled={phase === "submitted"}
            />
            {showAnswers && (
              <p>
                Correct answer: {q.answers.find((a: Answer) => a.correct)?.text}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  if (!currentUser) {
    return (
      <div>
        Sorry, please sign in to take the quiz.
        <button onClick={() => router.push("/account/signin")}>Sign In</button>
      </div>
    );
  }

  if (phase === "loading") return <div>Loading quiz...</div>;
  if (!quiz) return <div>Quiz not found.</div>;

  if (phase === "submitted")
    return (
      <div>
        <h1>Quiz Submitted</h1>
        <p>
          Score: {score} / {quiz?.points} pts
        </p>
        {showAnswers && quiz?.questions && (
          <div>
            <h4>Answer Review:</h4>
            {quiz.questions.map((q: QuizQuestion, i: number) =>
              renderQuestion(q, i),
            )}
          </div>
        )}
        {attemptsInfo?.remaining > 0 && (
          <button onClick={handleRetakeQuiz}>
            Retake Quiz ({attemptsInfo.remaining} attempts remaining)
          </button>
        )}
        <button onClick={() => router.push(`/courses/${cid}/quizzes`)}>
          Back
        </button>
      </div>
    );

  const questions = quiz.questions ?? [];
  const oneAtATime = quiz.one_question_at_a_time;

  return (
    <div>
      <h1>{quiz.title}</h1>
      <p>{attemptsInfo?.remaining ?? "?"} attempt(s) remaining</p>
      <hr />
      {oneAtATime ? (
        <div>
          <p>
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
          {renderQuestion(
            questions[currentQuestionIndex],
            currentQuestionIndex,
          )}
          <div>
            <button
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex((i) => i - 1)}
            >
              ← Previous
            </button>
            {currentQuestionIndex < questions.length - 1 ? (
              <button onClick={() => setCurrentQuestionIndex((i) => i + 1)}>
                Next →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Quiz"}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div>
          {questions.map((q: QuizQuestion, i: number) => renderQuestion(q, i))}
          <button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>
        </div>
      )}
    </div>
  );
}
