import { createSlice } from "@reduxjs/toolkit";
import { Quiz} from "../../types";

const initialState = {
    quiz: null, 
    attemptsInfo: null, 
    phase: "loading",
    score: null,
    showAnswers: false,
};

const takeQuizSlice = createSlice({
    name: "takeQuiz",
    initialState,
    reducers: {
        setQuiz: (state, action) => {
            state.quiz = action.payload;
        },
        setAttemptInfo: (state, action) => {
            state.attemptsInfo = action.payload;
        },
        setPhase: (state, action) => {
            state.phase = action.payload;
        },
        setSubmission: (state, action) => {
            state.score = action.payload.score;
            state.showAnswers = action.payload.showAnswers;
            state.phase = "submitted"
        },
        resetTakeQuiz: () => initialState,


    },
});

export const {
    setQuiz, 
    setAttemptInfo, 
    setPhase,
    setSubmission, 
    resetTakeQuiz,
} = takeQuizSlice.actions;
export default takeQuizSlice.reducer;