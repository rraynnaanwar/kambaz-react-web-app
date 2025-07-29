import { ListGroup, Button, ButtonGroup } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { deleteTodo, setTodo } from "./todosReducer";

export default function TodoItem({ todo }: { todo: any }) {
  const dispatch = useDispatch();

  return (
    <ListGroup.Item className="d-flex justify-content-between align-items-center py-3 border-0 border-bottom">
      <span className="fs-5 text-dark">{todo.title}</span>
      
      <ButtonGroup>
        {todo.title === "Learn Mongo" ? (
          <>
            <Button 
              variant="warning" 
              size="sm"
              className="me-2 px-3"
              onClick={() => dispatch(setTodo(todo))}
            >
              Update
            </Button>
            <Button 
              variant="success" 
              size="sm"
              className="px-3"
            >
              Add
            </Button>
          </>
        ) : (
          <>
            <Button 
              variant="primary" 
              size="sm"
              className="me-2 px-3"
              onClick={() => dispatch(setTodo(todo))}
            >
              Edit
            </Button>
            <Button 
              variant="danger" 
              size="sm"
              className="px-3"
              onClick={() => dispatch(deleteTodo(todo.id))}
            >
              Delete
            </Button>
          </>
        )}
      </ButtonGroup>
    </ListGroup.Item>
  );
}