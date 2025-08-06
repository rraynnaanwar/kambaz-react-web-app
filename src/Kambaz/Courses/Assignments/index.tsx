import { useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import ModulesControls from "./AssignmentControls";
import { FormControl, InputGroup, ListGroup } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import AssignmentControlButtons from "./AssignmentControlButtons";
import LessonControlButtons from "../Modules/LessonControlButtons";
import { FaRegFileAlt } from "react-icons/fa";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { deleteAssignment, setAssignments } from "./reducer";
import * as assignmentClient from "./client";

export default function Assignments() {
  const { cid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { assignments } = useSelector((state: any) => state.assignmentsReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const isFaculty = currentUser?.role === "FACULTY";

  const courseAssignments = assignments.filter(
    (assignment: any) => assignment.course === cid
  );

  // Fetch assignments when component mounts or course changes
  useEffect(() => {
    const fetchAssignments = async () => {
      if (cid) {
        try {
          const fetchedAssignments = await assignmentClient.findAssignmentsForCourse(cid);
          dispatch(setAssignments(fetchedAssignments));
        } catch (error) {
          console.error("Error fetching assignments:", error);
        }
      }
    };
    fetchAssignments();
  }, [cid, dispatch]);

  const handleDeleteAssignment = async (assignmentId: string) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        if (cid) {
          await assignmentClient.deleteAssignment(cid, assignmentId);
          // Update Redux state after successful deletion
          dispatch(deleteAssignment(assignmentId));
        }
      } catch (error) {
        console.error("Error deleting assignment:", error);
        alert("Failed to delete assignment. Please try again.");
      }
    }
  };

  const handleEditAssignment = (assignmentId: string) => {
    navigate(`/Kambaz/Courses/${cid}/Assignments/${assignmentId}`);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div id="wd-assignments" className="p-3">
      <div className="d-flex align-items-center mb-3">
        <InputGroup style={{ maxWidth: 300 }}>
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <FormControl placeholder="Search..." id="wd-search-assignment" />
        </InputGroup>
        <div className="ms-auto">
          <ModulesControls />
        </div>
      </div>

      <ListGroup className="rounded-0" id="wd-modules">
        <ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary d-flex align-items-center">
            <BsGripVertical className="me-2 fs-3" />
            <span className="me-auto">Assignments</span>
            {isFaculty && <AssignmentControlButtons />}
          </div>

          <ListGroup className="wd-lessons rounded-0">
            {courseAssignments.length === 0 ? (
              <ListGroup.Item className="text-center p-4 text-muted">
                No assignments found for this course.
                {isFaculty && " Click the + Assignment button to create one."}
              </ListGroup.Item>
            ) : (
              courseAssignments.map((assignmentItem: any) => (
                <ListGroup.Item key={assignmentItem._id} className="wd-lesson p-3 ps-1">
                  <div className="d-flex">
                    <div className="me-2 d-flex align-items-start">
                      <BsGripVertical className="fs-3" />
                    </div>

                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center">
                        <FaRegFileAlt className="me-2 text-success" />
                        <span className="fw-bold me-auto">
                          <Link
                            to={`/Kambaz/Courses/${cid}/Assignments/${assignmentItem._id}`}
                            style={{ textDecoration: "none", color: "inherit" }}
                          >
                            {assignmentItem.title}
                          </Link>
                        </span>
                        {isFaculty && (
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-warning"
                              onClick={() => handleEditAssignment(assignmentItem._id)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteAssignment(assignmentItem._id)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                        <LessonControlButtons />
                      </div>
                      <div className="mt-1 text-muted small">
                        Multiple Modules | <strong>Available from</strong>{" "}
                        {formatDate(assignmentItem.availableDate)}
                        {assignmentItem.availableUntilDate && (
                          <> | <strong>Until</strong> {formatDate(assignmentItem.availableUntilDate)}</>
                        )}
                      </div>
                      <div className="text-muted small">
                        Due {formatDate(assignmentItem.dueDate)} | {assignmentItem.points} pts
                      </div>
                    </div>
                  </div>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
}