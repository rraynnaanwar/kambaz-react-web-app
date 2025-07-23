import { Form, Button } from "react-bootstrap";
import { useParams } from "react-router";
import * as db from "../../Database";

export default function AssignmentEditor() {
  const formGroupStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "1rem",
  };

  const labelStyle = {
    minWidth: "140px",
    marginBottom: 0,
    fontWeight: "500",
  };

  const inputStyle = {
    flex: 1,
  };

  const { cid, aid } = useParams();
  const currAssignment = db.assignments.find(
    (assignment) => assignment.course === cid && assignment._id === aid
  );

  const formatDateForInput = (dateString: string | number | Date) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  if (!currAssignment) {
    return (
      <div id="wd-assignments-editor" className="p-4">
        <h6>Assignment Not Found</h6>
        <p>The assignment you're looking for could not be found.</p>
      </div>
    );
  }

  return (
    <div id="wd-assignments-editor" className="p-4">
      <h6>Assignment Name</h6>
      <Form>
        <Form.Group controlId="wd-name" style={formGroupStyle}>
          <Form.Label style={labelStyle}>{"Name: "}</Form.Label>
          <Form.Control
            type="text"
            defaultValue={currAssignment.title}
            style={inputStyle}
          />
        </Form.Group>

        <Form.Group
          controlId="wd-description"
          style={{ marginBottom: "1.5rem" }}
        >
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            style={{ width: "100%", resize: "vertical" }}
            defaultValue={
              currAssignment.description || "No description available."
            }
          />
        </Form.Group>

        <Form.Group controlId="wd-points" style={formGroupStyle}>
          <Form.Label style={labelStyle}>Points</Form.Label>
          <Form.Control
            type="number"
            defaultValue={currAssignment.points || 100}
            style={{ ...inputStyle, maxWidth: "150px" }}
          />
        </Form.Group>

        <Form.Group controlId="wd-group" style={formGroupStyle}>
          <Form.Label style={labelStyle}>Assignment Group</Form.Label>
          <Form.Select defaultValue="Assignments" style={inputStyle}>
            <option value="Quiz">QUIZ</option>
            <option value="Assignments">ASSIGNMENTS</option>
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="wd-display-grade-as" style={formGroupStyle}>
          <Form.Label style={labelStyle}>Display Grade as</Form.Label>
          <Form.Select defaultValue="Percentage" style={inputStyle}>
            <option value="Percentage">Percentage</option>
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="wd-submission-type" style={formGroupStyle}>
          <Form.Label style={labelStyle}>Submission Type</Form.Label>
          <Form.Select defaultValue="Online" style={inputStyle}>
            <option value="Online">Online</option>
          </Form.Select>
        </Form.Group>

        <div style={{ display: "flex", marginBottom: "1.5rem" }}>
          <div style={{ minWidth: "140px" }}></div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                border: "1px solid #dee2e6",
                borderRadius: "0.375rem",
                padding: "1rem",
                backgroundColor: "#ffffff",
              }}
            >
              <Form.Label
                style={{
                  fontWeight: "500",
                  marginBottom: "1rem",
                  display: "block",
                }}
              >
                Online Entry Options
              </Form.Label>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <Form.Check
                  type="checkbox"
                  id="wd-text-entry"
                  label="Text Entry"
                />
                <Form.Check
                  type="checkbox"
                  id="wd-website-url"
                  label="Website URL"
                  defaultChecked
                />
                <Form.Check
                  type="checkbox"
                  id="wd-media-recordings"
                  label="Media Recordings"
                />
                <Form.Check
                  type="checkbox"
                  id="wd-student-annotation"
                  label="Student Annotations"
                />
                <Form.Check
                  type="checkbox"
                  id="wd-file-upload"
                  label="File Uploads"
                />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", marginBottom: "1.5rem" }}>
          <Form.Label
            style={{ minWidth: "140px", marginBottom: 0, fontWeight: "500" }}
          >
            Assign
          </Form.Label>
          <div style={{ flex: 1 }}>
            <div
              style={{
                border: "1px solid #dee2e6",
                borderRadius: "0.375rem",
                padding: "1rem",
                backgroundColor: "#ffffff",
              }}
            >
              <Form.Group
                controlId="wd-assign-to"
                style={{ marginBottom: "1rem" }}
              >
                <Form.Label
                  style={{ fontWeight: "500", marginBottom: "0.5rem" }}
                >
                  Assign to
                </Form.Label>
                <div
                  style={{
                    border: "1px solid #dee2e6",
                    borderRadius: "0.375rem",
                    padding: "0.375rem 0.75rem",
                    backgroundColor: "#f8f9fa",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Everyone</span>
                  <span style={{ cursor: "pointer", fontWeight: "bold" }}>
                    ×
                  </span>
                </div>
              </Form.Group>

              <Form.Group
                controlId="wd-due-date"
                style={{ marginBottom: "1rem" }}
              >
                <Form.Label
                  style={{ fontWeight: "500", marginBottom: "0.5rem" }}
                >
                  Due
                </Form.Label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Form.Control
                    type="datetime-local"
                    defaultValue={formatDateForInput(currAssignment.dueDate)}
                    style={{ flex: 1 }}
                  />
                  <span style={{ fontSize: "1.2rem", color: "#6c757d" }}>
                    📅
                  </span>
                </div>
              </Form.Group>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <Form.Group controlId="wd-available-dates">
                  <Form.Label
                    style={{ fontWeight: "500", marginBottom: "0.5rem" }}
                  >
                    Available from
                  </Form.Label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Form.Control
                      type="datetime-local"
                      defaultValue={formatDateForInput(
                        currAssignment.availableDate
                      )}
                      style={{ flex: 1 }}
                    />
                    <span style={{ fontSize: "1.2rem", color: "#6c757d" }}>
                      📅
                    </span>
                  </div>
                </Form.Group>

                <Form.Group controlId="wd-available-until">
                  <Form.Label
                    style={{ fontWeight: "500", marginBottom: "0.5rem" }}
                  >
                    Until
                  </Form.Label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Form.Control
                      type="datetime-local"
                      defaultValue={formatDateForInput(currAssignment.dueDate)}
                      style={{ flex: 1 }}
                    />
                    <span style={{ fontSize: "1.2rem", color: "#6c757d" }}>
                      📅
                    </span>
                  </div>
                </Form.Group>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end">
          <Button variant="secondary" className="me-2">
            Cancel
          </Button>
          <Button variant="danger" type="submit">
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
}
