"use client";

import { FormControl } from "react-bootstrap";
import { QuizQuestion, QuestionType } from "../../types";

export default function QuestionDisplay(
    question: QuizQuestion
) {
    switch (question.questionType) {
        case QuestionType.TRUE_FALSE:
            return (
                <div> hi </div>
            )
        case QuestionType.MULTIPLE_CHOICE:
            return (
                <div> hi </div>
            )
        case QuestionType.FILL_IN_BLANK:
            return (
                <div> hi </div>
            )
    }
}