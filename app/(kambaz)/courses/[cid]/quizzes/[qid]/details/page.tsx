"use client";

import { RootState } from "@/app/(kambaz)/store";
import { redirect, useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Button,
  Form,
  FormControl,
  FormLabel,
  Tab,
  Table,
  Tabs,
} from "react-bootstrap";
import { FaPlus } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import * as quizzesClient from "../../client";
import { setQuizzes } from "../../reducer";
import {
  AssignmentGroup,
  QuestionType,
  Quiz,
  QuizQuestion,
  QuizType,
} from "../../types";
import QuestionEditor from "./questionEditor";

export default function QuizEditor() {
  const { cid, qid } = useParams();
  const dispatch = useDispatch();

  const newQuiz = usePathname().endsWith("new/details");
  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);

  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  ) as any | null;

  // set with a new quiz object
  const [quiz, setQuiz] = useState<Quiz>(
    newQuiz
      ? {
          _id: "id",
          title: "Quiz Title",
          userId: currentUser ? currentUser._id : "",
          course: cid as string,
          availableFrom: new Date(),
          availableUntil: new Date(),
          dueDate: new Date(),
          points: 0,
          published: true,
          quizType: QuizType.GRADED_QUIZ,
          assignment_group: AssignmentGroup.QUIZZES,
          shuffle_answers: false,
          time_limit_mins: 0,
          multiple_attempts: true,
          max_attempts: 1,
          show_correct_answers: true,
          access_code: "access code here...",
          one_question_at_a_time: true,
          webcam_required: true,
          lock_questions: true,
          questions: [],
        }
      : {
          // if not new quiz, retrieve from reducer and reformat dates
          ...quizzes.filter((q) => q._id === qid)[0],
          dueDate: quizzes.filter((q) => q._id === qid)[0]?.dueDate
            ? new Date(quizzes.filter((q) => q._id === qid)[0].dueDate)
            : new Date(),
          availableFrom: quizzes.filter((q) => q._id === qid)[0]?.availableFrom
            ? new Date(quizzes.filter((q) => q._id === qid)[0].availableFrom)
            : new Date(),
          availableUntil: quizzes.filter((q) => q._id === qid)[0]
            ?.availableUntil
            ? new Date(quizzes.filter((q) => q._id === qid)[0].availableUntil)
            : new Date(),
        },
  );

  // for question editor
  const [questions, setQuestions] = useState<QuizQuestion[]>(
    quiz.questions ?? [],
  );
  const [editing, setEditing] = useState<boolean>(false);

  useEffect(() => {
    // if not faculty, redirect
    if (!currentUser || currentUser.role !== "FACULTY") {
      redirect("./take-quiz");
    }

    if (!newQuiz && quizzes.length > 0) {
      const selectedQuiz = quizzes.find((q) => q._id === qid);
      if (selectedQuiz) {
        setQuiz({
          ...selectedQuiz,
          // format dates for reducer
          dueDate: selectedQuiz.dueDate
            ? new Date(selectedQuiz.dueDate)
            : new Date(),
          availableFrom: selectedQuiz.availableFrom
            ? new Date(selectedQuiz.availableFrom)
            : new Date(),
          availableUntil: selectedQuiz.availableUntil
            ? new Date(selectedQuiz.availableUntil)
            : new Date(),
        });
      }
    }
  }, [qid, quizzes, newQuiz, currentUser]);

  const onTakeQuiz = () => {
    redirect("./take-quiz");
  };

  const onSaveQuiz = async () => {
    const quizToSave = {
      ...quiz,
      points:
        questions?.reduce((acc: number, q: QuizQuestion) => {
          return acc + q.points;
        }, 0) ?? 0,
      questions: questions ?? [],
      dueDate:
        quiz.dueDate instanceof Date
          ? quiz.dueDate.toISOString()
          : quiz.dueDate,
      availableFrom:
        quiz.availableFrom instanceof Date
          ? quiz.availableFrom.toISOString()
          : quiz.availableFrom,
      availableUntil:
        quiz.availableUntil instanceof Date
          ? quiz.availableUntil.toISOString()
          : quiz.availableUntil,
    };

    if (newQuiz) {
      const newQuizData = await quizzesClient.createQuiz(quizToSave);
      dispatch(setQuizzes([...quizzes, newQuizData]));
    } else {
      const updatedQuiz = await quizzesClient.updateQuiz(quizToSave);
      dispatch(
        setQuizzes(
          quizzes.map((q: Quiz) => (q._id === quiz._id ? updatedQuiz : q)),
        ),
      );
    }
    setEditing(false);
    redirect("../");
  };

  const onCancel = () => {
    redirect("../");
  };

  const onNewQuestion = () => {
    const newQuestion: QuizQuestion = {
      _id: uuidv4(),
      title: "Question title",
      questionType: QuestionType.MULTIPLE_CHOICE,
      points: 0,
      question: "Question here.",
      answers: [],
    };
    setQuestions([...questions, newQuestion]);
  };

  const onDeleteQuestion = (questionId: string) => {
    setQuestions(questions.filter((q: QuizQuestion) => q._id !== questionId));
  };

  const onUpdateQuestion = (question: QuizQuestion) => {
    setQuestions(
      questions.map((q: QuizQuestion) =>
        q._id === question._id ? question : q,
      ),
    );
  };

  return (
    <div id="quiz-editor">
      <Form
        onChange={() => {
          setEditing(true);
        }}
        onSubmit={(e) => {
          e.preventDefault();
          onSaveQuiz();
        }}
      >
        <FormControl
          defaultValue={quiz.title}
          onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
          className="size-fit fs-1"
        />
        <br />
        <Tabs defaultActiveKey={"details"} className="fs-5 mb-3">
          <Tab eventKey={"details"} title="Details">
            <Table borderless>
              <tbody className="fs-4">
                <tr>
                  <td align="right" valign="top">
                    <FormLabel htmlFor="quiz-type"> Quiz Type </FormLabel>
                  </td>
                  <td>
                    <Form.Select
                      size="lg"
                      id="quiz-type"
                      defaultValue={quiz.quizType}
                    >
                      {Object.values(QuizType)

                        .map((v) => (
                          <option
                            key={v}
                            onClick={() => setQuiz({ ...quiz!, quizType: v })}
                          >
                            {" "}
                            {v}{" "}
                          </option>
                        ))}
                    </Form.Select>
                  </td>
                </tr>
                <tr>
                  <td>
                    <FormLabel> Points</FormLabel>
                  </td>
                  <td>{quiz?.points}</td>
                </tr>
                <tr>
                  <td>
                    <FormLabel> Assignment Group </FormLabel>
                  </td>
                  <td>
                    <Form.Select
                      size="lg"
                      id="assignment-group"
                      defaultValue={quiz.assignment_group}
                    >
                      {Object.values(AssignmentGroup).map((v) => (
                        <option
                          key={v}
                          onClick={() =>
                            setQuiz({ ...quiz, assignment_group: v })
                          }
                        >
                          {" "}
                          {v}{" "}
                        </option>
                      ))}
                    </Form.Select>
                  </td>
                </tr>
                <tr>
                  <td>
                    <FormLabel> Shuffle Answers </FormLabel>
                  </td>
                  <td>
                    <Form.Check
                      defaultChecked={quiz.shuffle_answers}
                      onChange={() =>
                        setQuiz({
                          ...quiz,
                          shuffle_answers: !quiz.shuffle_answers,
                        })
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <FormLabel> Time Limit </FormLabel>
                  </td>
                  <td className="d-flex">
                    <FormControl
                      size="lg"
                      className="me-2"
                      defaultValue={quiz.time_limit_mins}
                      onChange={(e) =>
                        setQuiz({
                          ...quiz,
                          time_limit_mins: parseInt(e.target.value),
                        })
                      }
                    />{" "}
                    Minutes
                  </td>
                </tr>
                <tr>
                  <td>
                    <FormLabel> Multiple Attempts </FormLabel>
                  </td>
                  <td>
                    <Form.Check
                      defaultChecked={quiz.multiple_attempts}
                      onChange={() =>
                        setQuiz({
                          ...quiz,
                          multiple_attempts: !quiz.multiple_attempts,
                        })
                      }
                    />
                  </td>
                </tr>
                <tr hidden={!quiz?.multiple_attempts}>
                  <td>
                    <FormLabel> Maximum Attempts </FormLabel>
                  </td>
                  <td>
                    <FormControl
                      size="lg"
                      defaultValue={quiz.max_attempts}
                      onChange={(e) =>
                        setQuiz({
                          ...quiz,
                          max_attempts: parseInt(e.target.value),
                        })
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <FormLabel> Show Correct Answers </FormLabel>
                  </td>
                  <td>
                    <Form.Check
                      defaultChecked={quiz.show_correct_answers}
                      onChange={() =>
                        setQuiz({
                          ...quiz,
                          show_correct_answers: !quiz.show_correct_answers,
                        })
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <FormLabel> Access Code </FormLabel>
                  </td>
                  <td>
                    <FormControl
                      size="lg"
                      defaultValue={quiz.access_code}
                      onChange={(e) =>
                        setQuiz({ ...quiz, access_code: e.target.value })
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <FormLabel> One Question at a Time </FormLabel>
                  </td>
                  <td>
                    <Form.Check
                      defaultChecked={quiz.one_question_at_a_time}
                      onChange={() =>
                        setQuiz({
                          ...quiz,
                          one_question_at_a_time: !quiz.one_question_at_a_time,
                        })
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <FormLabel> Webcam Required </FormLabel>
                  </td>
                  <td>
                    <Form.Check
                      defaultChecked={quiz.webcam_required}
                      onChange={() =>
                        setQuiz({
                          ...quiz,
                          webcam_required: !quiz.webcam_required,
                        })
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <FormLabel> Lock Questions After Answering </FormLabel>
                  </td>
                  <td>
                    <Form.Check
                      defaultChecked={quiz.lock_questions}
                      onChange={() =>
                        setQuiz({
                          ...quiz,
                          lock_questions: !quiz.lock_questions,
                        })
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <FormLabel> Due Date </FormLabel>
                  </td>
                  <td>
                    <FormControl
                      size="lg"
                      defaultValue={
                        quiz?.dueDate
                          ? quiz.dueDate.toISOString().substring(0, 10)
                          : ""
                      }
                      type={"date"}
                      onChange={(e) =>
                        setQuiz({ ...quiz, dueDate: new Date(e.target.value) })
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <FormLabel> Available From </FormLabel>
                  </td>
                  <td>
                    <FormControl
                      size="lg"
                      type={"date"}
                      defaultValue={
                        quiz?.availableFrom
                          ? quiz.availableFrom.toISOString().substring(0, 10)
                          : ""
                      }
                      onChange={(e) =>
                        setQuiz({
                          ...quiz,
                          availableFrom: new Date(e.target.value),
                        })
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <FormLabel> Available Until </FormLabel>
                  </td>
                  <td>
                    <FormControl
                      size="lg"
                      defaultValue={
                        quiz?.availableUntil
                          ? quiz.availableUntil.toISOString().substring(0, 10)
                          : ""
                      }
                      type={"date"}
                      onChange={(e) =>
                        setQuiz({
                          ...quiz,
                          availableUntil: new Date(e.target.value),
                        })
                      }
                    />
                  </td>
                </tr>
              </tbody>
            </Table>
          </Tab>
          <Tab eventKey={"questions"} title="Questions">
            {questions?.map((question, idx) => (
              <div key={idx}>
                <QuestionEditor
                  quizQuestion={question}
                  onDeleteQuestion={onDeleteQuestion}
                  onUpdateQuestion={onUpdateQuestion}
                ></QuestionEditor>
              </div>
            ))}
            <Button size="lg" variant="secondary" onClick={onNewQuestion}>
              <FaPlus className="mb-1" /> Question
            </Button>
          </Tab>
        </Tabs>
        <hr />
        <div>
          <Button
            className="float-end mx-2"
            size="lg"
            variant="secondary"
            onClick={onCancel}
          >
            {" "}
            Cancel{" "}
          </Button>
          <Button
            className="float-end mx-2"
            size="lg"
            variant="success"
            onClick={() => {
              setQuiz({ ...quiz, published: true });
              onSaveQuiz();
            }}
            disabled={!editing}
          >
            Save and Publish
          </Button>
          <Button
            className="float-end mx-2"
            size="lg"
            variant="primary"
            onClick={onSaveQuiz}
            disabled={!editing}
          >
            {" "}
            Save {newQuiz ? "" : "Changes"}{" "}
          </Button>
          <Button
            className="mx-2"
            size="lg"
            variant="danger"
            onClick={onTakeQuiz}
          >
            {" "}
            Take Quiz{" "}
          </Button>
        </div>
      </Form>
    </div>
  );
}
