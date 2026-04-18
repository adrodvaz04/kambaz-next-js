"use client";

import { RootState } from "@/app/(kambaz)/store";
import { redirect, useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Form, FormControl, FormLabel, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as quizzesClient from "../../client";
import { AssignmentGroup, Quiz, QuizType } from "../../types";
import { setQuizzes } from "../../reducer";

export default function QuizEditor() {
  const { cid, qid } = useParams();
  const dispatch = useDispatch();

  const newQuiz = usePathname().endsWith("new");

  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);

  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  ) as any | null;

  const [quiz, setQuiz] = useState<Quiz>({
    _id: "id",
    title: "Quiz Title",
    userId: currentUser._id,
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
  });

  useEffect(() => {
    const fetchQuiz = async (quizId: string) => {
      const quiz: Quiz = await quizzesClient.getQuizById(quizId);
      setQuiz(quiz);
    };

    fetchQuiz(qid as string);
  }, [qid, quiz, currentUser]);

  const onTakeQuiz = () => {
    redirect("./take-quiz");
  };

  const onSaveQuiz = async () => {
    if (newQuiz) {
      const newQuiz = await quizzesClient.createQuiz(quiz);
      dispatch(setQuizzes([...quizzes, newQuiz]));
    } else {
      await quizzesClient.updateQuiz(quiz);
      dispatch(
        setQuizzes(quizzes.map((q: Quiz) => (q._id === quiz._id ? quiz : q))),
      );
    }
    redirect("../");
  };

  const onCancel = () => {
    redirect("../");
  };

  return (
    <div id="quiz-editor">
      <FormControl
        defaultValue={quiz.title}
        onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
        className="size-fit fs-1"
      />
      <br />
      <br />
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          onSaveQuiz();
        }}
      >
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
                  {Object.values(AssignmentGroup)

                    .map((v) => (
                      <option
                        key={v}
                        onClick={() =>
                          setQuiz({ ...quiz!, assignment_group: v })
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
                    setQuiz({ ...quiz, shuffle_answers: !quiz.shuffle_answers })
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
                    setQuiz({ ...quiz, max_attempts: parseInt(e.target.value) })
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
            <hr />
            <tr>
              <td>
                <FormLabel> Due Date </FormLabel>
              </td>
              <td>
                <FormControl
                  size="lg"
                  defaultValue={quiz.dueDate.toISOString().substring(0, 10)}
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
                  defaultValue={quiz.availableFrom
                    .toISOString()
                    .substring(0, 10)}
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
                  defaultValue={quiz.availableUntil
                    .toISOString()
                    .substring(0, 10)}
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
            type="submit"
            className="float-end mx-2"
            size="lg"
            variant="primary"
          >
            {" "}
            Save {newQuiz ? "Changes" : ""}{" "}
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
