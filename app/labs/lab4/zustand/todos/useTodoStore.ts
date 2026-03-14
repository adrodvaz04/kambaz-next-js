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
  updateTodo: (todo: Todo) => void;
  setTodo: (todo: Todo) => void;
}

export const useTodoStore = create<TodosState>((set) => ({
  todos: [
    { id: "1", title: "Learn React" },
    { id: "2", title: "Learn Node" },
  ],
  currentTodo: { id: "", title: "Learn Mongo" },
  addTodo: (todo) => {
    set((state) => ({
      todos: [
        ...state.todos,
        { ...todo, id: new Date().getTime().toString() },
      ],
      currentTodo: { id: "", title: "" },
    }));
  },
  deleteTodo: (todo) => {
    set((state) => ({
      todos: state.todos.filter((t) => t.id !== todo.id),
    }));
  },
  updateTodo: (todo) => {
    set((state) => ({
      todos: state.todos.map((t) =>
        t.id === todo.id ? todo : t
      ),
      currentTodo: { id: "", title: "" },
    }));
  },
  setTodo: (todo) => {
    set({ currentTodo: todo });
  },
}));
