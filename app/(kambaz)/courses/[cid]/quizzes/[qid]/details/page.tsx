"use client";

import { v4 as uuidv4 } from "uuid";
import { RootState } from "@/app/(kambaz)/store";
import { redirect, useParams, usePathname } from "next/navigation";
import {
  ChangeEvent,
  ReactElement,
  ReactHTMLElement,
  useEffect,
  useState,
} from "react";
import {
  Button,
  Form,
  FormControl,
  FormLabel,
  Tab,
  Table,
  Tabs,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as quizzesClient from "../../client";
import {
  AssignmentGroup,
  Quiz,
  QuizType,
  QuizQuestion,
  QuestionType,
  Answer,
} from "../../types";
import { setQuizzes } from "../../reducer";
import { FaMinus, FaPencil, FaPlus } from "react-icons/fa6";

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

  const [questions, setQuestions] = useState<QuizQuestion[]>(
    quiz.questions ?? [],
  );

  // used for question editing
  const [editedQuestion, setEditedQuestion] = useState<
    QuizQuestion | undefined
  >();
  const [editedAnswers, setEditedAnswers] = useState<Answer[] | undefined>();

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
      questions: questions,
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
      answers: [{ _id: uuidv4(), text: "Answer here", correct: true }],
    };
    setQuestions([...questions, newQuestion]);
    setEditedQuestion(newQuestion);
  };

  const onNewAnswer = () => {
    if (editedQuestion?.questionType === QuestionType.TRUE_FALSE) return; // if true/false, do not allow adding answer

    const newAnswer: Answer = {
      _id: uuidv4(),
      text: "Answer here.",
      correct: editedQuestion?.questionType === QuestionType.FILL_IN_BLANK, // i.e, set true for fill-in-blank, false for multiple choice
    };

    const updatedAnswers = [...(editedAnswers ?? []), newAnswer];
    setEditedAnswers(updatedAnswers);
    setEditedQuestion({
      ...editedQuestion!,
      answers: updatedAnswers,
    });
  };

  const onSelectAnswer = (answerId: string) => {
    const questionType = editedQuestion?.questionType;

    switch (questionType) {
      case (QuestionType.TRUE_FALSE, QuestionType.MULTIPLE_CHOICE): // set one true, all others false
        setEditedAnswers(
          editedAnswers?.map((a: Answer) =>
            a._id === answerId ? { ...a, correct: true } : a,
          ),
        );
        break;
      case QuestionType.FILL_IN_BLANK:
        setEditedAnswers(
          editedAnswers?.map((a: Answer) => {
            return { ...a, correct: true };
          }),
        );
        break;
    }
  };

  const onChangeQuestionType = (e: ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as QuestionType;
    let updatedAnswers: Answer[];

    switch (newType) {
      case QuestionType.TRUE_FALSE:
        updatedAnswers = [
          { _id: uuidv4(), text: "True", correct: true },
          { _id: uuidv4(), text: "False", correct: false },
        ];
        break;
      case QuestionType.MULTIPLE_CHOICE:
        updatedAnswers = [
          { _id: uuidv4(), text: "Option 1", correct: false },
          { _id: uuidv4(), text: "Option 2", correct: false },
        ];
        break;
      case QuestionType.FILL_IN_BLANK:
        updatedAnswers = [{ _id: uuidv4(), text: "Blank", correct: true }];
        break;
    }

    const updatedQuestion: QuizQuestion = {
      ...editedQuestion!,
      questionType: newType,
      answers: updatedAnswers,
    };

    setEditedQuestion(updatedQuestion);
    setEditedAnswers(updatedAnswers);
  };

  const onDeleteQuestion = () => {
    if (editedQuestion) {
      setQuestions(
        questions.filter((q: QuizQuestion) => q._id !== editedQuestion!._id),
      );

      // reset states
      setEditedQuestion(undefined);
      setEditedAnswers(undefined);
    }
  };

  const onUpdateQuestion = () => {
    if (editedQuestion) {
      setEditedQuestion({
        ...editedQuestion,
        answers: editedAnswers ?? editedQuestion.answers,
      });
      setQuestions(
        questions.map((q: QuizQuestion) =>
          q._id === editedQuestion._id ? editedQuestion : q,
        ),
      );

      // reset states
      setEditedQuestion(undefined);
      setEditedAnswers(undefined);
    }
  };

  return (
    <div id="quiz-editor">
      <Form
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
          {/* 
                      
                      
                      
                      QUESTIONS SECTION 
                      
                      
                      
                      
                      */}
          <Tab eventKey={"questions"} title="Questions">
            {questions.map((question) => (
              <div
                key={question._id}
                className="mx-5 mb-5 border border-2 fs-5"
              >
                <div className="d-flex gap-3 p-3" id="question-editor-header">
                  <FormControl
                    size="lg"
                    defaultValue={question.title}
                    disabled={editedQuestion?._id !== question._id}
                    onChange={(e) =>
                      setEditedQuestion({ ...question, title: e.target.value })
                    }
                  />
                  <Form.Select
                    size="lg"
                    defaultValue={question.questionType}
                    disabled={editedQuestion?._id !== question._id}
                    onChange={onChangeQuestionType}
                  >
                    {Object.values(QuestionType).map((v) => (
                      <option key={v} value={v}>
                        {" "}
                        {v}{" "}
                      </option>
                    ))}
                  </Form.Select>
                  <span className="mt-2"> Pts </span>
                  <FormControl
                    size="lg"
                    disabled={editedQuestion?._id !== question._id}
                    defaultValue={question.points}
                    onChange={(e) =>
                      setEditedQuestion({
                        ...question,
                        points: parseInt(e.target.value),
                      })
                    }
                  ></FormControl>
                  <Button
                    size="lg"
                    variant={
                      editedQuestion?._id === question._id
                        ? "secondary"
                        : "primary"
                    }
                    className="d-flex"
                    disabled={editedQuestion?._id === question._id}
                    onClick={() => {
                      setEditedQuestion(question);
                      setEditedAnswers(question.answers);
                    }}
                  >
                    {" "}
                    <FaPencil className="me-3 mt-1"></FaPencil> Edit{" "}
                  </Button>
                </div>
                <div
                  id="quiz-editor-body"
                  hidden={editedQuestion?._id !== question._id}
                >
                  <hr />
                  <div className="px-4 mb-4">
                    <h4> Question: </h4>
                    <FormControl
                      size="lg"
                      defaultValue={editedQuestion?.question}
                      placeholder="Enter text..."
                      onChange={(e) =>
                        setEditedQuestion({
                          ...editedQuestion!,
                          question: e.target.value,
                        })
                      }
                    ></FormControl>
                  </div>

                  <div className="px-5 mb-4">
                    <div className="d-flex gap-3 mb-4">
                      <h4 className="mt-1"> Answers: </h4>
                      <Button
                        className="d-flex"
                        variant="primary"
                        size="lg"
                        hidden={
                          editedQuestion?.questionType ===
                          QuestionType.TRUE_FALSE
                        }
                        onClick={onNewAnswer}
                      >
                        <FaPlus></FaPlus>
                      </Button>
                    </div>

                    {editedQuestion?.questionType === QuestionType.TRUE_FALSE ? (
                      <div>
                        {editedAnswers?.map((answer: Answer) => (
                          <Form.Check
                            key={answer._id}
                            defaultChecked={answer.correct}
                            name={editedQuestion.title}
                            type="radio"
                            label={
                              <span>
                                {answer.text}
                                {answer.correct && (
                                  <span className="ms-2 text-success text-nowrap">
                                    Correct Answer
                                  </span>
                                )}
                              </span>
                            }
                            checked={answer.correct}
                            onChange={() => {
                              onSelectAnswer(answer._id);
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div>
                        {editedAnswers?.map((answer: Answer, idx) => (
                          <div key={idx} className="d-flex gap-4 mb-3">
                            <Form.Check
                              label={
                                answer.correct &&
                                editedQuestion?.questionType !==
                                  QuestionType.FILL_IN_BLANK && (
                                  <span className="pt-2 text-success text-nowrap">
                                    {" "}
                                    Correct Answer{" "}
                                  </span>
                                )
                              }
                              defaultChecked={answer.correct}
                              className="pt-2"
                              type="radio"
                              name={answer.text}
                              multiple={
                                editedQuestion?.questionType ===
                                QuestionType.FILL_IN_BLANK
                              }
                              hidden={
                                editedQuestion?.questionType ===
                                QuestionType.FILL_IN_BLANK
                              }
                              onClick={() => {
                                onSelectAnswer(answer._id);
                              }}
                            ></Form.Check>

                            <FormControl
                              size="lg"
                              defaultValue={answer.text}
                              placeholder="Enter text..."
                              onChange={(e) => {
                                const updatedAnswers = editedAnswers.map((a) =>
                                  a._id === answer._id
                                    ? { ...answer, text: e.target.value }
                                    : a,
                                );
                                setEditedQuestion({
                                  ...editedQuestion!,
                                  answers: updatedAnswers,
                                });
                                setEditedAnswers(updatedAnswers);
                              }}
                            ></FormControl>
                            <Button
                              size="lg"
                              variant="danger"
                              hidden={
                                editedQuestion?.questionType ===
                                QuestionType.TRUE_FALSE
                              }
                              onClick={() => {
                                const filteredAnswers =
                                  editedAnswers?.filter(
                                    (a) => a._id !== answer._id,
                                  ) ?? [];
                                setEditedAnswers(filteredAnswers);
                                setEditedQuestion({
                                  ...editedQuestion!,
                                  answers: filteredAnswers,
                                });
                              }}
                            >
                              {" "}
                              <FaMinus></FaMinus>{" "}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <hr />
                    <Button size="lg" onClick={onUpdateQuestion}>
                      {" "}
                      Update Question{" "}
                    </Button>
                    <Button
                      size="lg"
                      variant="danger"
                      className="float-end"
                      onClick={() => {
                        onDeleteQuestion();
                      }}
                    >
                      {" "}
                      Delete Question{" "}
                    </Button>
                  </div>
                </div>
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
          >
            Save and Publish
          </Button>
          <Button
            className="float-end mx-2"
            size="lg"
            variant="primary"
            onClick={onSaveQuiz}
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
