import { ChangeEvent, useState } from "react";
import { Button, Form, FormControl } from "react-bootstrap";
import { FaMinus, FaPencil, FaPlus } from "react-icons/fa6";
import { v4 as uuidv4 } from "uuid";
import { Answer, QuestionType, QuizQuestion } from "../../types";

export default function QuestionEditor({
  quizQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
}: {
  quizQuestion: QuizQuestion;
  onUpdateQuestion: (question: QuizQuestion) => void;
  onDeleteQuestion: (questionId: string) => void;
}) {
  const [question, setQuestion] = useState<QuizQuestion>(quizQuestion);
  const [editingView, setEditingView] = useState<boolean>(false);
  const [warning, setWarning] = useState<string | undefined>();

  const validateQuestion = (question: QuizQuestion) => {
    if (question.answers.length == 0) {
      return setWarning("Please include at least one answer.");
    } else if (!question.answers.some((a) => a.correct)) {
      return setWarning("Please set at least one correct question.");
    } else if (
      question.answers.some((a) => a.correct && a.text.trim() === "")
    ) {
      return setWarning("Please ensure your correct answer is not empty text.");
    }

    setWarning(undefined);
    return true;
  };

  const onNewAnswer = () => {
    if (question?.questionType === QuestionType.TRUE_FALSE) return; // if true/false, do not allow adding answer

    const newAnswer: Answer = {
      _id: uuidv4(),
      text: "",
      correct: question?.questionType === QuestionType.FILL_IN_BLANK, // i.e, set true for fill-in-blank, false for multiple choice
    };

    const updatedAnswers = [...question.answers, newAnswer];
    setQuestion({
      ...question,
      answers: updatedAnswers,
    });
  };

  const onChangeQuestionType = (e: ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as QuestionType;
    let updatedAnswers: Answer[];

    switch (newType) {
      case QuestionType.TRUE_FALSE:
        updatedAnswers = [
          { _id: uuidv4(), text: "True", correct: false },
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
      ...question,
      questionType: newType,
      answers: updatedAnswers,
    };

    setQuestion(updatedQuestion);
  };

  const onSelectAnswer = (answerId: string) => {
    const questionType = question?.questionType;

    switch (questionType) {
      case QuestionType.TRUE_FALSE: // set one true, all others false
      case QuestionType.MULTIPLE_CHOICE:
        setQuestion({
          ...question,
          answers: question.answers.map((a: Answer) =>
            a._id === answerId
              ? { ...a, correct: true }
              : { ...a, correct: false },
          ),
        });
        break;
      case QuestionType.FILL_IN_BLANK:
        setQuestion({
          ...question,
          answers: question.answers.map((a: Answer) => {
            return { ...a, correct: true };
          }),
        });
        break;
    }
  };

  return (
    <div key={question._id} className="mx-5 mb-5 border border-2 fs-5">
      <div className="d-flex gap-3 p-3" id="question-editor-header">
        <FormControl
          size="lg"
          defaultValue={question.title}
          disabled={!editingView}
          onChange={(e) => setQuestion({ ...question, title: e.target.value })}
        />
        <Form.Select
          size="lg"
          defaultValue={question.questionType}
          disabled={!editingView}
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
          type="number"
          size="lg"
          disabled={!editingView}
          min="0"
          defaultValue={question.points?.toString() ?? 0}
          onChange={(e) =>
            setQuestion({
              ...question,
              points: Math.max(0, parseInt(e.target.value) || 0),
            })
          }
        ></FormControl>
        <Button
          size="lg"
          variant={editingView ? "secondary" : "primary"}
          className="d-flex"
          disabled={editingView}
          onClick={() => {
            setEditingView(true);
          }}
        >
          {" "}
          <FaPencil className="me-3 mt-1"></FaPencil> Edit{" "}
        </Button>
      </div>
      <div id="quiz-editor-body" hidden={!editingView}>
        <hr />
        <div className="px-4 mb-4">
          <h4> Question: </h4>
          <FormControl
            size="lg"
            defaultValue={question.question}
            placeholder="Enter text..."
            onChange={(e) =>
              setQuestion({
                ...question!,
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
              hidden={question.questionType === QuestionType.TRUE_FALSE}
              onClick={onNewAnswer}
            >
              <FaPlus></FaPlus>
            </Button>
          </div>

          {question.questionType === QuestionType.TRUE_FALSE ? (
            <div>
              {question.answers.map((answer: Answer) => (
                <Form.Check
                  key={answer._id}
                  name={question.title}
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
              {question.answers.map((answer: Answer, idx) => (
                <div key={idx} className="d-flex gap-4 mb-3">
                  <Form.Check
                    label={
                      answer.correct &&
                      question?.questionType !== QuestionType.FILL_IN_BLANK && (
                        <span className="pt-2 text-success text-nowrap">
                          {" "}
                          Correct Answer{" "}
                        </span>
                      )
                    }
                    defaultChecked={answer.correct}
                    className="pt-2"
                    type="radio"
                    name={question._id}
                    hidden={
                      question.questionType === QuestionType.FILL_IN_BLANK
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
                      const updatedAnswers = question.answers.map((a) =>
                        a._id === answer._id
                          ? { ...answer, text: e.target.value }
                          : a,
                      );
                      setQuestion({
                        ...question,
                        answers: updatedAnswers,
                      });
                    }}
                  ></FormControl>
                  <Button
                    size="lg"
                    variant="danger"
                    hidden={
                      question.questionType === QuestionType.TRUE_FALSE ||
                      question.answers.length == 1
                    }
                    onClick={() => {
                      const filteredAnswers =
                        question.answers?.filter(
                          (a: Answer) => a._id !== answer._id,
                        ) ?? [];
                      setQuestion({
                        ...question,
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
          <Button
            size="lg"
            onClick={() => {
              if (!validateQuestion(question)) return;
              onUpdateQuestion({
                ...question,
              });
              setEditingView(false);
            }}
          >
            {" "}
            Update Question{" "}
          </Button>
          <span className="text-danger ps-2"> {warning} </span>

          <Button
            size="lg"
            variant="secondary"
            className="float-end ms-3"
            onClick={() => {
              setEditingView(false);
              setQuestion(quizQuestion);
            }}
          >
            Cancel
          </Button>
          <Button
            size="lg"
            variant="danger"
            className="float-end"
            onClick={() => {
              onDeleteQuestion(question._id);
            }}
          >
            {" "}
            Delete Question{" "}
          </Button>
        </div>
      </div>
    </div>
  );
}
