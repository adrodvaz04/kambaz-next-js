"use client";
import { redirect, useParams, useRouter } from "next/navigation";
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
import {
  Answer,
  QuestionType,
  Quiz,
  QuizAttempt,
  QuizQuestion,
} from "../../types";
import { Button, Card, FormControl } from "react-bootstrap";
import { FaCheck, FaPencil, FaXmark } from "react-icons/fa6";

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

  const isFaculty = currentUser ? currentUser.role === "FACULTY" : false;

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

      if (!isFaculty) {
        await client.addQuizAttempt({
          answers,
          score: earned_points,
          quiz_id: qid,
          user_id: currentUser._id,
          attemptDate: new Date(),
        });
      }

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
    let renderedAnswers;
    switch (q.questionType) {
      case QuestionType.MULTIPLE_CHOICE:
      case QuestionType.TRUE_FALSE:
        renderedAnswers = q.answers.map((opt: Answer, i: number) => (
          <div key={i}>
            <hr />
            <input
              className="ms-5"
              type="radio"
              name={`q-${q._id}`}
              id={`q-${q._id}-${i}`}
              value={opt.text}
              checked={selected === opt.text}
              onChange={() => handleAnswerChange(q._id, opt.text)}
              disabled={phase === "submitted"}
            />
            <label htmlFor={`q-${q._id}-${i}`} className="fs-4 p-2">
              {opt.text}
              {showAnswers &&
                opt === q.answers.find((a: Answer) => a.correct) && (
                  <FaCheck color="green" className="ms-2"></FaCheck>
                )}
              {showAnswers &&
                selected === opt.text &&
                opt !== q.answers.find((a: Answer) => a.correct) && (
                  <FaXmark color="red" className="ms-2"></FaXmark>
                )}
            </label>
          </div>
        ));
        break;

      case QuestionType.FILL_IN_BLANK:
        renderedAnswers = (
          <div>
            <div className="px-2 d-flex">
              <FormControl
                className="py-2 ms-2 mt-3 mb-2"
                size="lg"
                type="text"
                value={selected}
                placeholder="Your answer..."
                onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                disabled={phase === "submitted"}
              />
            </div>

            {showAnswers && !(selected in q.answers.map((a) => a.text)) && (
              <span className="fs-4 pt-1 px-2 text-success">
                Correct {q.answers.length == 1 ? "answer" : "answers"}:
                {q.answers
                  .map((a: Answer) => {
                    return ` ${a.text}`;
                  })
                  .toString()}
              </span>
            )}
          </div>
        );
        break;
    }

    return (
      <div key={index}>
        <span className="p-3 fs-4">
          {!quiz?.one_question_at_a_time ? `${index + 1}.` : ""} {q.question}
        </span>

        {renderedAnswers}
      </div>
    );
  };

  if (!currentUser) {
    return (
      <div className="p-4">
        <span className="fs-3">Sorry, please sign in to take the quiz.</span>
        <br />
        <Button
          className="mt-3"
          variant="danger"
          size="lg"
          onClick={() => router.push("/account/signin")}
        >
          Sign In
        </Button>
      </div>
    );
  }

  if (phase === "loading") return <div>Loading quiz...</div>;

  if (!quiz)
    return (
      <div>
        Quiz not found.
        <br />
        <Button
          className="mt-3"
          variant="danger"
          size="lg"
          onClick={() => router.push("/account/signin")}
        >
          Sign In
        </Button>
      </div>
    );

  if (phase === "submitted")
    return (
      <div>
        <Button
        size="lg"
        variant="secondary"
        className="float-end"
        hidden={!isFaculty}
        disabled={!isFaculty}
        onClick={() => redirect("./details")}
      >
        {" "}
        <FaPencil /> Back To Editor{" "}
      </Button>
        <h1>Quiz Submitted</h1>
        <br />
        <h3>
          Score: {score} / {quiz?.points} pts
        </h3>
        <hr />
        {showAnswers && quiz?.questions && (
          <Card>
            <Card.Header className="fs-4">Answer Review:</Card.Header>
            <Card.Body>
              {quiz.questions.map((q: QuizQuestion, i: number) => (
                <div key={i}>
                  {renderQuestion(q, i)}
                  <br />
                </div>
              ))}
            </Card.Body>
          </Card>
        )}
        <Button
          size="lg"
          hidden={attemptsInfo.remaining >= 1}
          onClick={handleRetakeQuiz}
        >
          Retake Quiz ({attemptsInfo.remaining} attempts remaining)
        </Button>
        <Button
          className="mt-3"
          size="lg"
          onClick={() => router.push(`/courses/${cid}/quizzes`)}
        >
          Back
        </Button>
      </div>
    );

  const questions = quiz.questions ?? [];
  const oneAtATime = quiz.one_question_at_a_time;

  return (
    <div className="p-3 pt-2">
      <Button
        size="lg"
        variant="secondary"
        className="float-end"
        hidden={!isFaculty}
        disabled={!isFaculty}
        onClick={() => redirect("./details")}
      >
        {" "}
        <FaPencil /> Back To Editor{" "}
      </Button>
      <h1>{quiz.title}</h1>
      <hr />
      <h5>
        {" "}
        {quiz.points} {quiz.points !== 1 ? "Points" : "Point"}
      </h5>
      <span className="fs-5">
        {attemptsInfo?.remaining ?? "?"}{" "}
        {attemptsInfo.remaining == 1 ? "attempt" : "attempts"} remaining
      </span>
      <hr />
      {oneAtATime ? (
        <div>
          <Card className="border">
            <Card.Header className="fs-4 py-3">
              Question {currentQuestionIndex + 1} of {questions.length}
              <div className="float-end">
                {questions[currentQuestionIndex].points} pts
              </div>
            </Card.Header>
            <Card.Body>
              {renderQuestion(
                questions[currentQuestionIndex],
                currentQuestionIndex,
              )}
            </Card.Body>
          </Card>
          <br />
          <div className="gap-3 p-2"></div>
          <Button
            size="lg"
            className="me-3"
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex((i) => i - 1)}
          >
            ← Previous
          </Button>
          {currentQuestionIndex < questions.length - 1 ? (
            <Button
              size="lg"
              onClick={() => setCurrentQuestionIndex((i) => i + 1)}
            >
              Next →
            </Button>
          ) : (
            <Button
              className="float-end"
              variant="danger"
              size="lg"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Quiz"}
            </Button>
          )}
        </div>
      ) : (
        <div>
          {questions.map((q: QuizQuestion, i: number) => renderQuestion(q, i))}
          <Button
            onClick={handleSubmit}
            disabled={submitting || answers.some((a) => a.answer.trim() === "")}
          >
            {submitting ? "Submitting..." : "Submit Quiz"}
          </Button>
        </div>
      )}
    </div>
  );
}
