import { createSlice } from "@reduxjs/toolkit";
import { Quiz } from "./types";

const initialState: { quizzes: Quiz[] } = {
  quizzes: [],
};

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    setQuizzes: (state, action) => {
      state.quizzes = action.payload;
    },
    updateQuiz: (state, { payload: quiz }) => {
      state.quizzes = state.quizzes.map((q: Quiz) =>
        q._id === quiz._id ? quiz : q,
      ) as Quiz[];
    },
  },
});

export const { setQuizzes, updateQuiz } = quizzesSlice.actions;
export default quizzesSlice.reducer;
