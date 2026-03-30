import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  enrollments: [],
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
        (e: any) => e.user === unenrollment.user && e.course !== unenrollment.course,
      );
    },
    setEnrollments: (state, action) => {
      state.enrollments = action.payload;
    }
  },
});
export const { enroll, unenroll, setEnrollments } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;
