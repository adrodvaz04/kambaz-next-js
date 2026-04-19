enum QuizType {
  GRADED_QUIZ = "Graded Quiz",
  PRACTICE_QUIZ = "Practice Quiz",
  GRADED_SURVEY = "Graded Survey",
  UNGRADED_SURVEY = "Ungraded Survey",
}

enum AssignmentGroup {
  QUIZZES = "Quizzes",
  EXAMS = "Exams",
  ASSIGNMENTS = "Assignments",
  PROJECTS = "Projects",
}

enum QuestionType {
  TRUE_FALSE = "True/False",
  MULTIPLE_CHOICE = "Multiple Choice",
  FILL_IN_BLANK = "Fill-in-the-blank",
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
  shuffle_answers: boolean;
  time_limit_mins: number;
  multiple_attempts: boolean;
  max_attempts: number;
  show_correct_answers: boolean;
  access_code: string;
  one_question_at_a_time: boolean;
  webcam_required: boolean;
  lock_questions: boolean;
  questions: QuizQuestion[];
};

export type QuizQuestion = {
  _id: string;
  title: string;
  questionType: QuestionType;
  points: number;
  question: string;
  answers: Answer[];
};

export type Answer = {
  _id: string;
  text: string;
  correct: boolean;
};

export type QuizAttempt = {
  _id?: string;
  quiz_id: string;
  user_id: string;
  answers: {
    question_id: string;
    answer: string;
  }[];
  score: number;
  attemptDate: Date;
};

export { QuizType, QuestionType, AssignmentGroup };
