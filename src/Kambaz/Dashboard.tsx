import { Link } from "react-router-dom";
export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (7)</h2> <hr />
      <div id="wd-dashboard-courses">
        <div className="wd-dashboard-course">
          <Link
            to="/Kambaz/Courses/1234/Home"
            className="wd-dashboard-course-link"
          >
            <img src="/images/reactjs.jpg" width={200} />
            <div>
              <h5>CS1234 React JS</h5>
              <p className="wd-dashboard-course-title">
                Full Stack software developer
              </p>
              <button>Go</button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link
            to="/Kambaz/Courses/2345/Home"
            className="wd-dashboard-course-link"
          >
            <img src="/images/nodejs.jpg" width={200} />
            <div>
              <h5>CS2345 Node JS</h5>
              <p className="wd-dashboard-course-title">
                Backend development with Node.js
              </p>
              <button>Go</button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link
            to="/Kambaz/Courses/3456/Home"
            className="wd-dashboard-course-link"
          >
            <img src="/images/python.jpg" width={200} />
            <div>
              <h5>CS3456 Python</h5>
              <p className="wd-dashboard-course-title">
                Python for Everybody
              </p>
              <button>Go</button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link
            to="/Kambaz/Courses/4567/Home"
            className="wd-dashboard-course-link"
          >
            <img src="/images/java.jpg" width={200} />
            <div>
              <h5>CS4567 Java</h5>
              <p className="wd-dashboard-course-title">
                Object-Oriented Programming in Java
              </p>
              <button>Go</button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link
            to="/Kambaz/Courses/5678/Home"
            className="wd-dashboard-course-link"
          >
            <img src="/images/htmlcss.jpg" width={200} />
            <div>
              <h5>CS5678 HTML & CSS</h5>
              <p className="wd-dashboard-course-title">
                Web Design Fundamentals
              </p>
              <button>Go</button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link
            to="/Kambaz/Courses/6789/Home"
            className="wd-dashboard-course-link"
          >
            <img src="/images/database.jpg" width={200} />
            <div>
              <h5>CS6789 Databases</h5>
              <p className="wd-dashboard-course-title">
                Introduction to Databases
              </p>
              <button>Go</button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link
            to="/Kambaz/Courses/7890/Home"
            className="wd-dashboard-course-link"
          >
            <img src="/images/typescript.jpg" width={200} />
            <div>
              <h5>CS7890 TypeScript</h5>
              <p className="wd-dashboard-course-title">
                TypeScript for Modern Web Apps
              </p>
              <button>Go</button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
