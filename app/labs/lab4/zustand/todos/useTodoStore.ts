import { create } from "zustand";

type Todo = {
  id: string;
  title: string;
};

interface TodosState {
  todos: Todo[];
  currentTodo: Todo;
  addTodo: (todo: Todo) => void;
  deleteTodo: (todo: Todo) => void;
  updateTodos: (todo: Todo) => void;
  setTodo: (todo: Todo) => void;
}

export const useTodoStore = create<TodosState>((set) => ({
  todos: [],
  currentTodo: { id: "", title: "" },
  addTodo: (t) => {
    set((state) => ({
      todos: [
        ...state.todos,
        { id: new Date().getTime().toString(), title: "" },
      ],
    }));
  },
  deleteTodo: (t) => {
    set((state) => ({
      todos: state.todos.splice(
        state.todos.findIndex((t) => t.id === state.currentTodo.id),
      ),
    }));
  },
  updateTodos: (t) => {
    set((state) => ({
      todos: state.todos.map((t) =>
        t.id === state.currentTodo.id
          ? { ...t, title: state.currentTodo.title }
          : t,
      ),
    }));
  },
  setTodo: (t) => {
    set({ currentTodo: t });
  },
}));
