"use client";

import { RootState } from "@/app/(kambaz)/store";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, FormControl, ListGroup, ListGroupItem } from "react-bootstrap";
import { FaCheckCircle } from "react-icons/fa";
import { FaCircleXmark, FaPlus } from "react-icons/fa6";
import { IoEllipsisVertical, IoRocketOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import QuizContextModal from "./[qid]/quizContextModal";
import * as quizzesClient from "./client";
import { setQuizzes } from "./reducer";
import { AssignmentGroup, Quiz } from "./types";

export default function Quizzes() {
  const { cid } = useParams();
  const { quizzes = [] } = useSelector(
    (state: RootState) => state.quizzesReducer,
  );

  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  ) as any | null;

  const isFaculty = currentUser.role === "FACULTY";

  const dispatch = useDispatch();

  const [quizToEdit, setQuizToEdit] = useState<Quiz | undefined>(undefined);

  useEffect(() => {
    const fetchQuizzes = async (cid: string) => {
      try {
        let quizzesData: Quiz[];
        if (currentUser && isFaculty) {
          quizzesData = await quizzesClient.getQuizzesByCourse(cid, false);
        } else {
          quizzesData = await quizzesClient.getQuizzesByCourse(cid, true);
        }
        // Ensure quizzesData is always an array (keep dates as strings for Redux serialization)
        const validQuizzes = Array.isArray(quizzesData) ? quizzesData : [];
        dispatch(setQuizzes(validQuizzes));
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        dispatch(setQuizzes([]));
      }
    };
    fetchQuizzes(cid as string);
  }, [dispatch, currentUser, isFaculty, cid]);

  const onQuizDelete = async (quizId: string) => {
    const deletedQuiz = await quizzesClient.deleteQuiz(quizId);
    dispatch(
      setQuizzes(quizzes.filter((q: Quiz) => q._id !== deletedQuiz._id)),
    );
  };

  const onNewQuizClick = () => {
    redirect("./quizzes/new");
  };

  const today = new Date();

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
          disabled={!isFaculty}
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
        .map((group: string) => (
          <div key={group} className="">
            <ListGroup className="my-3 pb-3 rounded-0">
              <ListGroupItem>
                <span className="fs-4 fw-bold"> {group} </span>
              </ListGroupItem>
              {quizzes
                .filter((q: Quiz) => q.assignment_group === group)
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
                          hidden={!isFaculty}
                          onClick={() => setQuizToEdit(q)}
                        >
                          <IoEllipsisVertical size={28}></IoEllipsisVertical>
                        </Button>
                      </div>
                      <div className="size-fit">
                        <Link
                          href={`./quizzes/${q._id}/${currentUser?.role === "FACULTY" ? "details" : "take-quiz"}`}
                        >
                          <b className="fs-3"> {q.title} </b>
                        </Link>
                        <br />
                        <span className="fs-5">
                          {" "}
                          <b>
                            {today < new Date(q.availableFrom)
                              ? `Not available until ${new Date(q.availableFrom).toDateString()}`
                              : today > new Date(q.availableUntil)
                                ? "Closed"
                                : "Available"}
                          </b>
                          {" | "}
                          <b>Due</b> {new Date(q.dueDate).toDateString()} |{" "}
                          {q.points.toString()} pts | {q.questions.length}{" "}
                          {q.questions.length === 1 ? "Question" : "Questions"}
                        </span>
                      </div>
                    </ListGroupItem>
                    <QuizContextModal
                      quiz={q}
                      show={quizToEdit !== undefined}
                      onCloseAction={() => setQuizToEdit(undefined)}
                      onQuizDeleteAction={onQuizDelete}
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
