enum QuizType {
  "graded-quiz",
  "practice-quiz",
  "graded-survey",
  "ungraded-survey",
}

enum AssignmentGroup {
  "Quizzes",
  "Exams",
  "Assignments",
  "Projects",
}

enum QuestionType {
  "true-false",
  "multiple-choice",
  "fill-in-blank",
}

export type Quiz = {
  _id?: string;
  title: string;
  userId: string | object;
  course: string | object;
  availableFrom: Date;
  availableUntil: Date;
  dueDate: Date;
  points: number;
  published: boolean;
  // quiz details
  quizType: QuizType;
  assignment_group: AssignmentGroup;
  time_limit_mins: number;
  multiple_attempts: boolean;
  max_attempts: number;
  access_code: string;
  one_question_at_a_time: boolean;
  webcam_required: boolean;
  lock_questions: boolean;
  questions: {
    title: string;
    questionType: QuestionType;
    points: number;
    question: string;
    answers: string[];
  }[];
};

export type QuizAttempt = {
  _id?: string;
  quiz_id: string;
  user_id: string;
  answers: {
    question_id: string;
    answer: string;
  }[];
  attemptDate: Date;
};

export { QuizType, QuestionType, AssignmentGroup };
