import { FaSearch } from "react-icons/fa";
import AssignmentControls from "./AssignmentControls";
import { FormControl, InputGroup, ListGroup } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import AssignmentControlButtons from "./AssignmentControlButtons";
import LessonControlButtons from "../Modules/LessonControlButtons";
import { FaRegFileAlt } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import * as db from "../../Database";

export default function Assignments() {
  const { cid } = useParams();
  const courseAssignments = db.assignments.filter(assignment => assignment.course === cid);

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
          <AssignmentControls />
        </div>
      </div>

      <ListGroup className="rounded-0" id="wd-modules">
        <ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary d-flex align-items-center">
            <BsGripVertical className="me-2 fs-3" />
            <span className="me-auto">Assignments</span>
            <AssignmentControlButtons />
          </div>

          <ListGroup className="wd-lessons rounded-0">
            {courseAssignments.map((assignment) => (
              <ListGroup.Item key={assignment._id} className="wd-lesson p-3 ps-1">
                <div className="d-flex">
                  <div className="me-2 d-flex align-items-start">
                    <BsGripVertical className="fs-3" />
                  </div>

                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center">
                      <FaRegFileAlt className="me-2 text-success" />
                      <span className="fw-bold me-auto">
                        <Link
                          to={`/Kambaz/Courses/${cid}/Assignments/${assignment._id}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          {assignment.title}
                        </Link>
                      </span>
                      <LessonControlButtons />
                    </div>
                    <div className="mt-1 text-muted small">
                      Multiple Modules | <strong>Not available until</strong> May
                      6 at 12:00am
                    </div>
                    <div className="text-muted small">
                      Due May 13 at 11:59pm | 100 pts
                    </div>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
            
          </ListGroup>
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
}