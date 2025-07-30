import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FormControl, Form, Button, Container, Row, Col } from "react-bootstrap";
import { addAssignment, updateAssignment } from "./reducer";

export default function AssignmentEditor() {
  const { cid, aid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { assignments } = useSelector((state: any) => state.assignmentsReducer);
  
  const [assignment, setAssignment] = useState({
    _id: "",
    title: "",
    course: cid || "",
    description: "",
    points: 100,
    dueDate: "",
    availableDate: "",
    availableUntilDate: "",
  });

  const isEditing = aid !== "new";

  useEffect(() => {
    if (isEditing) {
      const existingAssignment = assignments.find((a: any) => a._id === aid);
      if (existingAssignment) {
        setAssignment({
          ...existingAssignment,
          availableUntilDate: existingAssignment.availableUntilDate || "",
        });
      }
    } else {
      const now = new Date();
      const availableDate = new Date(now);
      const dueDate = new Date(now);
      dueDate.setDate(dueDate.getDate() + 7);
      const availableUntilDate = new Date(dueDate);
      availableUntilDate.setDate(availableUntilDate.getDate() + 1);

      setAssignment(prev => ({
        ...prev,
        availableDate: availableDate.toISOString().slice(0, 16),
        dueDate: dueDate.toISOString().slice(0, 16),
        availableUntilDate: availableUntilDate.toISOString().slice(0, 16),
      }));
    }
  }, [aid, assignments, isEditing]);

  const handleSave = () => {
    if (isEditing) {
      dispatch(updateAssignment(assignment));
    } else {
      dispatch(addAssignment({ ...assignment, course: cid }));
    }
    navigate(`/Kambaz/Courses/${cid}/Assignments`);
  };

  const handleCancel = () => {
    navigate(`/Kambaz/Courses/${cid}/Assignments`);
  };

  const handleInputChange = (field: string, value: any) => {
    setAssignment(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={8} className="mx-auto">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>{isEditing ? "Edit Assignment" : "New Assignment"}</h2>
            <div>
              <Button 
                variant="success" 
                onClick={handleSave}
                className="me-2"
                disabled={!assignment.title.trim()}
              >
                Save
              </Button>
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Assignment Name</Form.Label>
              <FormControl
                type="text"
                value={assignment.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter assignment name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <FormControl
                as="textarea"
                rows={5}
                value={assignment.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter assignment description"
              />
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Points</Form.Label>
                  <FormControl
                    type="number"
                    value={assignment.points}
                    onChange={(e) => handleInputChange("points", parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Available From</Form.Label>
                  <FormControl
                    type="datetime-local"
                    value={assignment.availableDate}
                    onChange={(e) => handleInputChange("availableDate", e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Due Date</Form.Label>
                  <FormControl
                    type="datetime-local"
                    value={assignment.dueDate}
                    onChange={(e) => handleInputChange("dueDate", e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Available Until</Form.Label>
                  <FormControl
                    type="datetime-local"
                    value={assignment.availableUntilDate}
                    onChange={(e) => handleInputChange("availableUntilDate", e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="border rounded p-3 mb-4">
              <h5>Assignment Settings</h5>
              
              <Form.Group className="mb-3">
                <Form.Label>Submission Type</Form.Label>
                <Form.Select>
                  <option>Online</option>
                  <option>Paper</option>
                  <option>External Tool</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Assignment Group</Form.Label>
                <Form.Select>
                  <option>Assignments</option>
                  <option>Quizzes</option>
                  <option>Exams</option>
                  <option>Project</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Display Grade As</Form.Label>
                <Form.Select>
                  <option>Percentage</option>
                  <option>Points</option>
                  <option>Letter Grade</option>
                  <option>Complete/Incomplete</option>
                </Form.Select>
              </Form.Group>
            </div>

            <div className="border rounded p-3 mb-4">
              <h5>Online Entry Options</h5>
              <Form.Check 
                type="checkbox" 
                label="Text Entry" 
                className="mb-2"
              />
              <Form.Check 
                type="checkbox" 
                label="Website URL" 
                className="mb-2"
              />
              <Form.Check 
                type="checkbox" 
                label="Media Recordings" 
                className="mb-2"
              />
              <Form.Check 
                type="checkbox" 
                label="Student Annotation" 
                className="mb-2"
              />
              <Form.Check 
                type="checkbox" 
                label="File Uploads" 
                className="mb-2"
              />
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button 
                variant="success" 
                onClick={handleSave}
                disabled={!assignment.title.trim()}
              >
                Save
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}