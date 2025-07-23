import { NavLink, useParams } from "react-router-dom";
import "../styles.css";
import { courses } from "../Database";

export default function CourseNavigation() {
  const { cid } = useParams();
  const course = courses.find((course) => course._id === cid);
  
  const links = [
    "Home",
    "Modules", 
    "Piazza",
    "Zoom",
    "Assignments",
    "Quizzes",
    "Grades",
    "People",
  ];

  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((link) => (
        <NavLink
          key={link}
          to={`/Kambaz/Courses/${cid}/${link}`}
          id={`wd-course-${link.toLowerCase()}-link`}
          className={({ isActive }) =>
            `list-group-item border border-0 ${
              isActive ? "active text-danger fw-bold" : "text-danger"
            }`
          }
        >
          {link}
        </NavLink>
      ))}
    </div>
  );
}