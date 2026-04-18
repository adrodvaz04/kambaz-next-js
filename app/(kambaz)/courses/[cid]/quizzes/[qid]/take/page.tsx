


"use client";
import { RootState } from "./../../../../../store";
import { redirect, useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setQuiz, setPhase, setSubmission, resetTakeQuiz, setAttemptInfo } from "./reducer";

import * as client from "../../client";
import { useEffect, useState } from "react";
import React from "react";

/* const testQuestions = [
    {
      _id: "q1",
      title: "Question 1",
      questionType: "Multiple Choice",
      points: 10,
      question: "What is 2 + 2?",
      answers: ["3", "4", "5", "6"],
      correct_answer: "4",
    },
    {
      _id: "q2",
      title: "Question 2",
      questionType: "True/False",
      points: 5,
      question: "The sky is blue.",
      answers: ["True", "False"],
      correct_answer: "True",
    },
    {
      _id: "q3",
      title: "Question 3",
      questionType: "Fill-in-the-blank",
      points: 5,
      question: "The capital of France is ___.",
      answers: [],
      correct_answer: "Paris",
    },
  ]; */



export default function TakeQuiz() {
  const { qid } = useParams();
  const dispatch = useDispatch();


const { phase, score, showAnswers } = useSelector((state: RootState) => state.takeQuizReducer);
const quiz = useSelector((state: RootState) => state.takeQuizReducer.quiz) as any;
const attemptsInfo = useSelector((state: RootState) => state.takeQuizReducer.attemptsInfo) as any;
  

  const [answers, setAnswers] = useState<{ question_index: number; answer: string }[]>([]);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer) as any;
  const router = useRouter();





  // loading quiz

  /* const loadQuiz = async () => {
    const quizData = {
      _id: "3325e63f-279a-480c-af2d-1fa2d0b7ed9b",
      title: "Test Quiz",
      points: 20,
      access_code: "",
      one_question_at_a_time: false,
      show_correct_answers: true,
      questions: testQuestions,
    };
    dispatch(setQuiz(quizData));
    dispatch(setAttemptInfo({ remaining: 1, attempts: [] }));
    dispatch(setPhase("taking"));
  };
  useEffect(() => {
  dispatch(resetTakeQuiz());
  loadQuiz();
}, []); */

   const loadQuiz = async () => {
    
    if (!qid || Array.isArray(qid)) return;
    


    // get quiz

    
    let quizData  = await client.getQuizById(qid);
    console.log("quizData:", quizData);
    quizData = { ...quizData, access_code: "", one_question_at_a_time: false}
    console.log("quiz:", quizData);
    dispatch(setQuiz(quizData));

    // get attempts

    let attemptsData = { remaining: 1, attempts: [] };
    try {
        attemptsData = await client.getQuizAttempts(qid);
      } catch (err) {
        console.log("Could not fetch attempts, defaulting:", err);
      }
      dispatch(setAttemptInfo(attemptsData));
   

    // if there's no attempts left
    if (attemptsData.remaining === 0 && attemptsData.attempts?.length > 0) {
      const { data: attempts } = await client.getQuizAttempts(qid);
      const lastAttempt = attempts[0]
      dispatch(setSubmission({
        score: lastAttempt.score,
        showAnswers: quizData.show_correct_answers,
      }));  
        return;
      }
      dispatch(setPhase(quizData.access_code ? "access-code" : "taking"));
  };
  useEffect(() => {
    dispatch(resetTakeQuiz());
    loadQuiz();
    
  }, [qid]); 




  // grab correct answer 
  const getAnswer = (questionIndex: number) => 
    answers.find((a) => a.question_index === questionIndex)?.answer ?? "";


    const handleAnswerChange = (questionIndex: number, answer: string) => {
        setAnswers((prev) => {
          const existing = prev.findIndex((a) => a.question_index === questionIndex);
          if (existing >= 0) {
            const updated = [...prev];
            updated[existing] = { question_index: questionIndex, answer };
            return updated;
          }
          return [...prev, { question_index: questionIndex, answer }];
        });
      };



  const handleSubmit = async () => {
    if (!quiz ||!qid || Array.isArray(qid)) return;
    setSubmitting(true);

    try {
        let earned_points = 0;
        quiz.questions.forEach((q: any, i: number) => {
            const submitted = answers.find((a) => a.question_index === i)
            if (submitted?.answer === q.correct_answer) {
                earned_points += q.points;
            }
        });

        await client.addQuizAttempt(qid, {answers, score: earned_points, quiz_id: qid});

        dispatch(setSubmission({
            score: earned_points,
            showAnswers: quiz.show_correct_answers,
        }));
    }
    catch (err) {
        console.log("Failed to submit quiz:",/* JSON.stringify(err) */);
    }

    setSubmitting(false);
  }


  // access code 
  const accessCodeSubmit = () => {
    if (!quiz) return;

  }

  const renderQuestion = (q: any, index: number) => {
    const selected = getAnswer(index);
    return (
      <div key={index}>
        <p>{index + 1}. {q.question} ({q.points} pts)</p>

        {q.questionType === "Multiple Choice" && q.answers.map((opt: string, i: number) => (
          <div key={i}>
            <input type="radio" name={`q-${index}`} id={`q-${index}-${i}`}
              value={opt} checked={selected === opt}
              onChange={() => handleAnswerChange(index, opt)}
              disabled={phase === "submitted"} />
            <label htmlFor={`q-${index}-${i}`}>
              {opt}
              {showAnswers && opt === q.correct_answer && " ✓"}
              {showAnswers && selected === opt && opt !== q.correct_answer && " ✗"}
            </label>
          </div>
        ))}

        {q.questionType === "True/False" && ["True", "False"].map((opt) => (
          <div key={opt}>
            <input type="radio" name={`q-${index}`} id={`q-${index}-${opt}`}
              value={opt} checked={selected === opt}
              onChange={() => handleAnswerChange(index, opt)}
              disabled={phase === "submitted"} />
            <label htmlFor={`q-${index}-${opt}`}>
              {opt}
              {showAnswers && opt === q.correct_answer && " ✓"}
              {showAnswers && selected === opt && opt !== q.correct_answer && " ✗"}
            </label>
          </div>
        ))}

        {q.questionType === "Fill-in-the-blank" && (
          <div>
            <input type="text" value={selected} placeholder="Your answer..."
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              disabled={phase === "submitted"} />
            {showAnswers && <p>Correct answer: {q.correct_answer}</p>}
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

  if (phase === "submitted") return (
    <div>
      <h1>Quiz Submitted</h1>
      <p>Score: {score} / {quiz?.points} pts</p>
      {showAnswers && quiz?.questions && (
        <div>
          <h4>Answer Review:</h4>
          {quiz.questions.map((q: any, i: number) => renderQuestion(q, i))}
        </div>
      )}
      <button onClick={() => window.history.back()}>Back</button>
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
          <p>Question {currentQuestionIndex + 1} of {questions.length}</p>
          {renderQuestion(questions[currentQuestionIndex], currentQuestionIndex)}
          <div>
            <button disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex((i) => i - 1)}>← Previous</button>
            {currentQuestionIndex < questions.length - 1
              ? <button onClick={() => setCurrentQuestionIndex((i) => i + 1)}>Next →</button>
              : <button onClick={handleSubmit} disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Quiz"}
                </button>
            }
          </div>
        </div>
      ) : (
        <div>
          {questions.map((q: any, i: number) => renderQuestion(q, i))}
          <button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>
        </div>
      )}
    </div>
  );
} 
