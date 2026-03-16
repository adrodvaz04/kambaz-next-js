import { createSlice } from "@reduxjs/toolkit";
import { enrollments } from "../database";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  enrollments: enrollments,
};
const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    enroll: (state, { payload: enrollment }) => {
      state.enrollments = [
        ...state.enrollments,
        { _id: uuidv4(), user: enrollment.user, course: enrollment.course },
      ] as any;
    },
    unenroll: (state, { payload: unenrollment }) => {
      state.enrollments = state.enrollments.filter(
        (e) => e.user === unenrollment.user && e.course !== unenrollment.course,
      );
    },
  },
});
export const { enroll, unenroll } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;
