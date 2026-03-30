import { configureStore } from "@reduxjs/toolkit";
import helloReducer from "./hello/helloReducer";
import counterReducer from "./CounterRedux/counterReducer";
import addReducer from "./AddRedux/addReducer";
import todosReducer from "./todos/todosReducer";

const store = configureStore({
  reducer: { helloReducer, counterReducer, addReducer, todosReducer }});
export type RootState = ReturnType<typeof store.getState>;
export default store;