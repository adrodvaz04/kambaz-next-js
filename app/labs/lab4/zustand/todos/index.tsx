"use client";

import { useTodoStore } from "./useTodoStore";
import { FormControl, ListGroup, ListGroupItem, Button } from "react-bootstrap";

export default function ZustandTodos() {
  const { todos, currentTodo, addTodo, deleteTodo, updateTodo, setTodo } =
    useTodoStore()!;
  let renderedTodos = todos.map((t) => (
    <ListGroupItem key={t.id}>
      <Button onClick={() => deleteTodo(t)} id="wd-delete-todo-click">
        {" "}
        Delete{" "}
      </Button>
      <Button onClick={() => setTodo(t)} id="wd-set-todo-click">
        {" "}
        Edit{" "}
      </Button>
      {t.title}
    </ListGroupItem>
  ));

  return (
    <div id="wd-react-context-todo">
      <h2> Todo List </h2>
      <ListGroup>
        <ListGroupItem>
          <Button onClick={() => addTodo(currentTodo)} id="wd-add-todo-click">
            {" "}
            Add{" "}
          </Button>
          <Button
            onClick={() => updateTodo(currentTodo)}
            id="wd-update-todo-click"
          >
            {" "}
            Update{" "}
          </Button>
          <FormControl
            defaultValue={currentTodo.title}
            onChange={(e) => setTodo({ ...currentTodo, title: e.target.value })}
          />
        </ListGroupItem>
        {renderedTodos}
      </ListGroup>
    </div>
  );
}
