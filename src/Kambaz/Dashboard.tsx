import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Card, Col, Row, FormControl } from "react-bootstrap";
import { 
  addCourse, 
  deleteCourse, 
  updateCourse, 
  setCurrentCourse,
  toggleShowAllCourses,
  enrollInCourse,
  unenrollFromCourse,
  type Course 
} from "./Courses/reducer";

export default function Dashboard() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { courses, currentCourse, enrollments, showAllCourses } = useSelector((state: any) => state.courseReducer);
  const dispatch = useDispatch();

  const addNewCourse = () => {
    dispatch(addCourse({}));
  };

  const deleteCourseHandler = (courseId: string) => {
    dispatch(deleteCourse(courseId));
  };

  const updateCourseHandler = () => {
    dispatch(updateCourse(currentCourse));
  };

  const setCourse = (course: Course) => {
    dispatch(setCurrentCourse(course));
  };

  const handleEnrollmentToggle = () => {
    dispatch(toggleShowAllCourses());
  };

  const handleEnroll = (courseId: string) => {
    dispatch(enrollInCourse({ userId: currentUser._id, courseId }));
  };

  const handleUnenroll = (courseId: string) => {
    dispatch(unenrollFromCourse({ userId: currentUser._id, courseId }));
  };

  const isEnrolled = (courseId: string) => {
    return enrollments.some(
      (enrollment: any) =>
        enrollment.user === currentUser._id &&
        enrollment.course === courseId
    );
  };

  const isFaculty = currentUser.role === "FACULTY";
  const displayedCourses = showAllCourses 
    ? courses 
    : courses.filter((course: Course) =>
        enrollments.some(
          (enrollment: any) =>
            enrollment.user === currentUser._id &&
            enrollment.course === course._id
        )
      );

  const enrolledCoursesCount = courses.filter((course: Course) =>
    enrollments.some(
      (enrollment: any) =>
        enrollment.user === currentUser._id &&
        enrollment.course === course._id
    )
  ).length;

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> 
      <hr />
      
      {isFaculty && (
        <>
          <h5>
            New Course
            <button
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={addNewCourse}
            >
              Add
            </button>
            <button
              className="btn btn-success float-end me-2"
              id="wd-update-course-click"
              onClick={updateCourseHandler}
            >
              Update
            </button>
          </h5>
          <br />
          <FormControl
            value={currentCourse.name}
            className="mb-2"
            placeholder="Course Name"
            onChange={(e) => setCourse({ ...currentCourse, name: e.target.value })}
          />
          <FormControl
            value={currentCourse.description}
            rows={3}
            as="textarea"
            placeholder="Course Description"
            onChange={(e) => setCourse({ ...currentCourse, description: e.target.value })}
          />
          <hr />
        </>
      )}

      <div className="d-flex justify-content-between align-items-center">
        <h2 id="wd-dashboard-published">
          {showAllCourses ? "All Courses" : `Published Courses (${enrolledCoursesCount})`}
        </h2>
        <button
          className="btn btn-primary"
          onClick={handleEnrollmentToggle}
        >
          {showAllCourses ? "Show Enrolled Only" : "Show All Courses"}
        </button>
      </div>
      <hr />

      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {displayedCourses.map((courseItem: Course) => (
            <Col
              key={courseItem._id}
              className="wd-dashboard-course"
              style={{ width: "300px" }}
            >
              <Card>
                <Link
                  to={`/Kambaz/Courses/${courseItem._id}/Home`}
                  className="wd-dashboard-course-link text-decoration-none text-dark"
                >
                  <Card.Img
                    src="/images/reactjs.jpg"
                    variant="top"
                    width="100%"
                    height={160}
                  />
                </Link>
                <Card.Body className="card-body">
                  <Link
                    to={`/Kambaz/Courses/${courseItem._id}/Home`}
                    className="wd-dashboard-course-link text-decoration-none text-dark"
                  >
                    <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">
                      {courseItem.name}
                    </Card.Title>
                    <Card.Text
                      className="wd-dashboard-course-description overflow-hidden"
                      style={{ height: "100px" }}
                    >
                      {courseItem.description}
                    </Card.Text>
                  </Link>
                  
                  <div className="mt-2">
                    {(isEnrolled(courseItem._id) || isFaculty) && (
                      <Link to={`/Kambaz/Courses/${courseItem._id}/Home`}>
                        <Button variant="primary">Go</Button>
                      </Link>
                    )}
                    {isFaculty && (
                      <>
                        <button
                          onClick={(event) => {
                            event.preventDefault();
                            deleteCourseHandler(courseItem._id);
                          }}
                          className="btn btn-danger float-end"
                          id="wd-delete-course-click"
                        >
                          Delete
                        </button>
                        <button
                          id="wd-edit-course-click"
                          onClick={(event) => {
                            event.preventDefault();
                            setCourse(courseItem);
                          }}
                          className="btn btn-warning me-2 float-end"
                        >
                          Edit
                        </button>
                      </>
                    )}
                    
                    {!isFaculty && (
                      <>
                        {isEnrolled(courseItem._id) ? (
                          <button
                            onClick={(event) => {
                              event.preventDefault();
                              handleUnenroll(courseItem._id);
                            }}
                            className="btn btn-danger float-end"
                          >
                            Unenroll
                          </button>
                        ) : (
                          <button
                            onClick={(event) => {
                              event.preventDefault();
                              handleEnroll(courseItem._id);
                            }}
                            className="btn btn-success float-end"
                          >
                            Enroll
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}