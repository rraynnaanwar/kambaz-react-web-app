import { NavLink } from "react-router-dom";
import "../styles.css";

export default function CourseNavigation() {
  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      <NavLink
        to="/Kambaz/Courses/1234/Home"
        id="wd-course-home-link"
        className={({ isActive }) =>
          `list-group-item border border-0 ${
            isActive ? "active text-danger fw-bold" : "text-danger"
          }`
        }
      >
        Home
      </NavLink>

      <NavLink
        to="/Kambaz/Courses/1234/Modules"
        id="wd-course-modules-link"
        className={({ isActive }) =>
          `list-group-item border border-0 ${
            isActive ? "active text-danger fw-bold" : "text-danger"
          }`
        }
      >
        Modules
      </NavLink>

      <NavLink
        to="/Kambaz/Courses/1234/Piazza"
        id="wd-course-piazza-link"
        className={({ isActive }) =>
          `list-group-item border border-0 ${
            isActive ? "active text-danger fw-bold" : "text-danger"
          }`
        }
      >
        Piazza
      </NavLink>

      <NavLink
        to="/Kambaz/Courses/1234/Zoom"
        id="wd-course-zoom-link"
        className={({ isActive }) =>
          `list-group-item border border-0 ${
            isActive ? "active text-danger fw-bold" : "text-danger"
          }`
        }
      >
        Zoom
      </NavLink>

      <NavLink
        to="/Kambaz/Courses/1234/Assignments"
        id="wd-course-quizzes-link"
        className={({ isActive }) =>
          `list-group-item border border-0 ${
            isActive ? "active text-danger fw-bold" : "text-danger"
          }`
        }
      >
        Assignments
      </NavLink>

      <NavLink
        to="/Kambaz/Courses/1234/Quizzes"
        id="wd-course-assignments-link"
        className={({ isActive }) =>
          `list-group-item border border-0 ${
            isActive ? "active text-danger fw-bold" : "text-danger"
          }`
        }
      >
        Quizzes
      </NavLink>

      <NavLink
        to="/Kambaz/Courses/1234/People"
        id="wd-course-people-link"
        className={({ isActive }) =>
          `list-group-item border border-0 ${
            isActive ? "active text-danger fw-bold" : "text-danger"
          }`
        }
      >
        People
      </NavLink>
    </div>
  );
}
