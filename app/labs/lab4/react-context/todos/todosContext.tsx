"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

export type Todo = {
  id?: string;
  title: string;
};

interface TodosContextState {
  todos: Todo[];
  currentTodo: Todo,
  addTodo: (todo: Todo) => void;
  deleteTodo: (todo: Todo) => void;
  updateTodo: (todo: Todo) => void;
  setTodo: (todo: Todo) => void;
}

const TodosContext = createContext<TodosContextState | undefined>(undefined);

export const TodosProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([
    { id: "1", title: "Learn React" },
    { id: "2", title: "Learn Node" },
  ]);
  const [todo, setTodo] = useState<Todo>({ title: "Learn Mongo" });

  const addTodo = (todo: Todo) => {
    setTodos((prev) => [
      ...prev,
      { ...todo, id: new Date().getTime().toString() },
    ]);
    setTodo({ title: "" });
  };
  const deleteTodo = (todo: Todo) =>
    setTodos((prev) => prev.filter((t) => t.id !== todo.id));
  const updateTodo = (todo: Todo) =>
    setTodos((prev) =>
      prev.map((t) => (t.id === todo.id ? todo : t)),
    );

  const value: TodosContextState = {
    todos: todos,
    currentTodo: todo,
    addTodo: addTodo,
    deleteTodo: deleteTodo,
    updateTodo: updateTodo,
    setTodo: setTodo,
  };

  return (
    <TodosContext.Provider value={value}> {children} </TodosContext.Provider>
  )

};

export const useTodos = () => {
  const context = useContext(TodosContext);
  return context;
};
