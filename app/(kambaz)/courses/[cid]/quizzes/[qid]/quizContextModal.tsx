"use client";

import { redirect } from "next/navigation";
import { useState } from "react";
import { Button, Offcanvas, Row } from "react-bootstrap";
import DeleteConfirmModal from "../../assignments/DeleteConfirmModal";
import { Quiz } from "../types";

export default function QuizContextModal({
  quiz,
  show,
  onCloseAction,
  onQuizDeleteAction,
  onQuizPublishAction,
}: {
  quiz: Quiz;
  show: boolean;
  onCloseAction: () => void;
  onQuizDeleteAction: (quizId: string) => void;
  onQuizPublishAction: () => void;
}) {
  const [quizIdToDelete, setQuizIdToDelete] = useState<string | undefined>(
    undefined,
  );

  return (
    <Offcanvas show={show} onHide={onCloseAction} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          <span className="fs-2"> Options </span>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <hr className="mx-3" />
      <Offcanvas.Body>
        <Row className="d-flex mx-2">
          <Button
            size="lg"
            className="mb-3"
            variant={quiz.published ? "secondary" : "success"}
            onClick={() => {
              onQuizPublishAction();
              onCloseAction();
            }}
          >
            {quiz.published ? "Unpublish" : "Publish"} Quiz
          </Button>
          <Button
            size="lg"
            className="my-3"
            onClick={() => redirect(`./quizzes/${quiz._id}/details`)}
          >
            {" "}
            Edit{" "}
          </Button>
          <Button
            size="lg"
            variant="danger"
            className="my-3"
            onClick={() => setQuizIdToDelete(quiz._id)}
          >
            {" "}
            Delete{" "}
          </Button>
        </Row>
      </Offcanvas.Body>

      <DeleteConfirmModal
        show={quizIdToDelete !== undefined}
        handleClose={() => {
          setQuizIdToDelete(undefined);
          onCloseAction();
        }}
        deleteOperation={() => onQuizDeleteAction(quiz._id as string)}
        dialogTitle={`Delete Quiz`}
        bodyText="Are you sure you want to delete this quiz?"
      />
    </Offcanvas>
  );
}
