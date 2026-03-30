"use client";
import HelloRedux from "./hello";
import { Provider } from "react-redux";
import store from "./store";
import CounterRedux from "./CounterRedux";
import AddRedux from "./AddRedux";
import TodoList from "./todos/TodoList";

export default function ReduxExamples() {
  return (
    <Provider store={store}>
      <div>
        <h2>Redux Examples</h2>
        <HelloRedux></HelloRedux>
        <CounterRedux></CounterRedux>
        <AddRedux></AddRedux>
        <TodoList></TodoList>
      </div>
    </Provider>
  );
}
