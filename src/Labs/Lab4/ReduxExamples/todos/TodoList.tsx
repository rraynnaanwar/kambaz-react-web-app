import { ListGroup, Container } from "react-bootstrap";
import TodoForm from "./TodoForm";
import TodoItem from "./TodoItem";
import { useSelector } from "react-redux";

export default function TodoList() {
  const { todos } = useSelector((state: any) => state.todosReducer);

  return (
    <Container className="mt-4">
      <div id="wd-todo-list-redux">
        <h2 className="mb-4 fw-bold text-dark">Todo List</h2>
        
        <ListGroup className="shadow-sm">
          <TodoForm />
          {todos.map((todo: any) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ListGroup>
        
        <hr className="mt-4"/>
      </div>
    </Container>
  );
}