"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

export type Todo = {
  id?: string;
  title: string;
};

interface TodosContextState {
  todos: Todo[];
  currentTodo: Todo,
  addTodo: (val: string) => void;
  deleteTodo: (todo: Todo) => void;
  updateTodo: (todo: Todo) => void;
  setTodo: (todo: Todo) => void;
}

const TodosContext = createContext<TodosContextState | undefined>(undefined);

export const TodosProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todo, setTodo] = useState<Todo>({id: "", title: ""});

  const add = (val: string) =>
    {
      setTodos((prev) => [
      ...prev,
      { id: new Date().getTime().toString(), title: val },
    ])
  };
  const deleteTodo = (todo: Todo) =>
    setTodos((prev) =>
      prev.splice(
        prev.findIndex((t) => t.id === todo.id),
        1,
      ),
    );
  const updateTodo = (todo: Todo) =>
    setTodos((prev) =>
      prev.map((t) => (t.id === todo.id ? { ...t, title: todo.title } : t)),
    );

  const value: TodosContextState = {
    todos: todos,
    currentTodo: todo,
    addTodo: add,
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
