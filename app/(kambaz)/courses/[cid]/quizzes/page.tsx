"use client";

import { useState, useEffect } from "react";
import { redirect, useParams } from "next/navigation";
import { setQuizzes } from "./reducer";
import * as quizzesClient from "./client";
import { RootState } from "@/app/(kambaz)/store";
import { useDispatch, useSelector } from "react-redux";
import {
  ListGroup,
  ListGroupItem,
  FormControl,
  Button,
  Row,
} from "react-bootstrap";
import { Quiz, QuizType, AssignmentGroup } from "./types";
import { FaCircleXmark, FaPlus, FaRocket } from "react-icons/fa6";
import { IoEllipsisVertical, IoRocketOutline } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import QuizContextModal from "./[qid]/quizContextModal";
import Link from "next/link";

export default function Quizzes() {
  const testQuizzes: Quiz[] = [
    {
      _id: "id",
      title: "title here",
      userId: "string",
      course: "string",
      availableFrom: new Date(),
      availableUntil: new Date(),
      dueDate: new Date(),
      points: 123,
      published: true,
      quizType: QuizType["graded-quiz"],
      assignment_group: AssignmentGroup["Quizzes"],
      time_limit_mins: 123,
      multiple_attempts: true,
      max_attempts: 21,
      access_code: "string",
      one_question_at_a_time: true,
      webcam_required: true,
      lock_questions: true,
      questions: [],
    },
  ];

  const { cid } = useParams();
  //   const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const quizzes = testQuizzes;

  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  ) as any | null;

  const dispatch = useDispatch();

  const [quizToEdit, setQuizToEdit] = useState<Quiz | undefined>(undefined);

  useEffect(() => {
    const fetchQuizzes = async (cid: string) => {
      let quizzes: object[];
      if (currentUser && currentUser.role === "FACULTY") {
        quizzes = await quizzesClient.getQuizzesByCourse(cid, false);
      } else {
        quizzes = await quizzesClient.getQuizzesByCourse(cid, true);
      }
      dispatch(setQuizzes(quizzes));
    };

    fetchQuizzes(cid as string);
  }, [dispatch, currentUser, cid, quizzes]);

  const onQuizDelete = async (quizId: string) => {
    await quizzesClient.deleteQuiz(quizId);
    dispatch(setQuizzes(quizzes.filter((q: Quiz) => q._id !== quizId)));
  };

  const onQuizUpdate = async (quiz: Quiz) => {
    const updatedQuiz = await quizzesClient.updateQuiz(quiz);
    dispatch(
      setQuizzes(
        quizzes.map((q: Quiz) => (q._id === quiz._id ? updatedQuiz : q)),
      ),
    );
  };

  const onNewQuizClick = () => {
    redirect("./quizzes/new");
  };

  return (
    <div id="quizzes-view">
      <div className="gap-4 w-full m-2">
        <FormControl
          type="text"
          placeholder="Search for Quiz..."
          className="w-auto align-middle float-start py-2"
          size="lg"
          onChange={(e) => {
            dispatch(
              setQuizzes(
                e.target.value === ""
                  ? quizzes
                  : quizzes.filter((q: Quiz) =>
                      q.title.includes(e.target.value),
                    ),
              ),
            );
          }}
        ></FormControl>
        <Button variant="secondary" size="lg" className="float-end btn p-2">
          <IoEllipsisVertical
            size={32}
            className="bg-gray-200"
          ></IoEllipsisVertical>
        </Button>
        <Button
          size="lg"
          className="btn btn-danger d-flex p-2 px-3 float-end mx-3"
          onClick={onNewQuizClick}
        >
          <FaPlus className="mt-1 me-2"></FaPlus>
          Quiz
        </Button>
      </div>
      <br />
      <br />
      <hr />

      {/* hardcoded splice for only string values*/}
      {Object.values(AssignmentGroup)
        .splice(0, 4)
        .map((group: string | AssignmentGroup) => (
          <div key={group} className="">
            <ListGroup className="my-3 pb-3 rounded-0">
              <ListGroupItem>
                <span className="fs-3 fw-bold"> {group} </span>
              </ListGroupItem>
              {quizzes
                .filter(
                  (q: Quiz) => AssignmentGroup[q.assignment_group] === group,
                )
                .map((q: Quiz) => (
                  <div key={q._id} className="size-fit">
                    <ListGroupItem className="py-2">
                      <IoRocketOutline
                        size={32}
                        className="float-start text-success me-3 my-2 mt-4"
                      ></IoRocketOutline>
                      <div className="d-flex gap-2 float-end">
                        {q.published ? (
                          <FaCheckCircle
                            size={28}
                            className="text-success mt-4"
                          ></FaCheckCircle>
                        ) : (
                          <FaCircleXmark
                            size={28}
                            className="text-danger mt-4"
                          ></FaCircleXmark>
                        )}
                        <Button
                          variant=""
                          className="mt-3"
                          onClick={() => setQuizToEdit(q)}
                        >
                          <IoEllipsisVertical size={28}></IoEllipsisVertical>
                        </Button>
                      </div>
                      <div className="size-fit">
                        <Link href={`./quizzes/${q._id}/details`}>
                          <b className="fs-3"> {q.title} </b>
                        </Link>
                        <br />
                        <span className="fs-5">
                          {" "}
                          <b>Due</b> {q.dueDate.toDateString()} |{" "}
                          {q.points.toString()} pts | {q.questions.length}{" "}
                          Questions
                        </span>
                      </div>
                    </ListGroupItem>
                    <QuizContextModal
                      quiz={q}
                      show={quizToEdit !== undefined}
                      onClose={() => setQuizToEdit(undefined)}
                      onQuizUpdateAction={() => onQuizUpdate}
                      onQuizDeleteAction={() => onQuizDelete}
                      onQuizPublishAction={async () => {
                        await quizzesClient.updateQuiz({
                          ...q,
                          published: !q.published,
                        });
                        dispatch(
                          setQuizzes(
                            quizzes.map((quiz: Quiz) =>
                              quiz._id === quizToEdit!._id
                                ? { ...quiz, published: !quiz.published }
                                : quiz,
                            ),
                          ),
                        );
                      }}
                    ></QuizContextModal>
                  </div>
                ))}
              <br />
            </ListGroup>
          </div>
        ))}
    </div>
  );
}
