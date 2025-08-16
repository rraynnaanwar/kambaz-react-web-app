import { Button, FormControl, ListGroup, InputGroup } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { addTodo, updateTodo, setTodo } from "./todosReducer";

export default function TodoForm() {
  const { todo } = useSelector((state: any) => state.todosReducer);
  const dispatch = useDispatch();
  
  return (
    <ListGroup.Item className="p-3 bg-light border-0 border-bottom">
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Enter todo item..."
          value={todo.title || ''}
          onChange={(e) => dispatch(setTodo({ ...todo, title: e.target.value }))}
          className="fs-5"
        />
      </InputGroup>
      
      <div className="d-flex gap-2">
        <Button 
          variant="success" 
          size="sm"
          className="px-3"
          onClick={() => dispatch(addTodo(todo))} 
          id="wd-add-todo-click"
        >
          Add
        </Button>
        <Button
          variant="warning"
          size="sm" 
          className="px-3"
          onClick={() => dispatch(updateTodo(todo))}
          id="wd-update-todo-click"
        >
          Update
        </Button>
      </div>
    </ListGroup.Item>
  );
}