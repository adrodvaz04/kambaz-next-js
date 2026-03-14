import React from "react";
import {ListGroup} from "react-bootstrap";
import TodoForm from "./todoForm";
import TodoItem from "./todoItem";
import { useSelector } from "react-redux";
import { RootState } from "../store";
export default function TodoList() {
  const { todos } = useSelector((state: RootState) => state.todosReducer);
  return (
    <div id="wd-todo-list-redux">
      <h2>Todo List</h2>
      <ListGroup>
        <TodoForm />
        {todos.map((todo: any) => (
          <TodoItem todo={todo} />
        ))}
      </ListGroup>
      <hr/>
    </div>
);}
