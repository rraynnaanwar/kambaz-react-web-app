import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Card, Col, Row, FormControl } from "react-bootstrap";
import {
  addCourse,
  deleteCourse as deleteReduxCourse,
  updateCourse as updateReduxCourse,
  setCurrentCourse,
  toggleShowAllCourses,
  enrollInCourse,
  unenrollFromCourse,
  setEnrollments,
  type Course,
} from "./Courses/reducer";
import * as enrollmentClient from "./client";

export default function Dashboard({
  addNewCourse: addNewCourseProp,
  deleteCourse: deleteCourseProp,
  updateCourse: updateCourseProp,
  courses: coursesProp,
  enrolling,
  setEnrolling,
  updateEnrollment,
}: {
  addNewCourse?: (course: any) => Promise<any>;
  deleteCourse?: (courseId: string) => Promise<void>;
  updateCourse?: (course: any) => Promise<any>;
  courses?: any[];
  enrolling: boolean;
  setEnrolling: (enrolling: boolean) => void;
  updateEnrollment: (courseId: string, enrolled: boolean) => void;
}) {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const {
    courses: reduxCourses,
    currentCourse,
    enrollments,
    showAllCourses,
  } = useSelector((state: any) => state.courseReducer);
  const dispatch = useDispatch();

  const courses = coursesProp || reduxCourses;

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (currentUser?._id) {
        try {
          const userEnrollments = await enrollmentClient.findEnrollmentsForUser(
            currentUser._id
          );
          dispatch(setEnrollments(userEnrollments));
          console.log("Fetched enrollments:", userEnrollments);
        } catch (error) {
          console.error("Error fetching enrollments:", error);
        }
      }
    };

    fetchEnrollments();
  }, [currentUser?._id, dispatch]);
  
  const isEnrolled = (courseId: string) => {
    if (!currentUser?._id || !Array.isArray(enrollments)) return false;

    return enrollments.some(
      (enrollment: any) =>
        enrollment?.user === currentUser._id && enrollment?.course === courseId
    );
  };

  const isFaculty = currentUser?.role === "FACULTY";
  
  // Determine which courses to display
  const displayedCourses = (() => {
    if (!Array.isArray(courses)) return [];

    if (isFaculty) return courses;

    if (enrolling || showAllCourses) return courses;

    return courses.filter(
      (course: any) => course?._id && isEnrolled(course._id)
    );
  })();

  const addNewCourse = async () => {
    if (addNewCourseProp) {
      try {
        await addNewCourseProp(currentCourse);
        dispatch(
          setCurrentCourse({
            _id: "",
            name: "",
            description: "",
            number: "",
            startDate: "",
            endDate: "",
          })
        );
      } catch (error) {
        console.error("Failed to add course:", error);
        alert("Failed to add course. Please try again.");
      }
    } else {
      dispatch(addCourse({}));
    }
  };

  const deleteCourseHandler = async (courseId: string) => {
    if (deleteCourseProp) {
      try {
        const confirmDelete = window.confirm(
          "Are you sure you want to delete this course? This action cannot be undone."
        );
        if (confirmDelete) {
          await deleteCourseProp(courseId);
          alert("Course deleted successfully!");
        }
      } catch (error) {
        console.error("Failed to delete course:", error);
        alert("Failed to delete course. Please try again.");
      }
    } else {
      dispatch(deleteReduxCourse(courseId));
    }
  };

  const updateCourseHandler = async () => {
    if (updateCourseProp) {
      try {
        if (!currentCourse._id) {
          alert("Please select a course to update.");
          return;
        }

        if (!currentCourse.name?.trim()) {
          alert("Please enter a course name.");
          return;
        }

        await updateCourseProp(currentCourse);
        dispatch(
          setCurrentCourse({
            _id: "",
            name: "",
            description: "",
            number: "",
            startDate: "",
            endDate: "",
          })
        );

        alert("Course updated successfully!");
      } catch (error) {
        console.error("Failed to update course:", error);
        alert("Failed to update course. Please try again.");
      }
    } else {
      dispatch(updateReduxCourse(currentCourse));
    }
  };

  const setCourse = (course: Course) => {
    dispatch(setCurrentCourse(course));
  };

  const handleEnrollmentToggle = () => {
    dispatch(toggleShowAllCourses());
  };

  const handleEnroll = async (courseId: string) => {
    try {
      const enrollment = await enrollmentClient.enrollUserInCourse(
        currentUser._id,
        courseId
      );
      dispatch(enrollInCourse({ userId: currentUser._id, courseId }));
      console.log("Successfully enrolled:", enrollment);

      // Refresh enrollments after successful enrollment
      const userEnrollments = await enrollmentClient.findEnrollmentsForUser(
        currentUser._id
      );
      dispatch(setEnrollments(userEnrollments));
    } catch (error: any) {
      console.error("Error enrolling:", error);
      if (
        error.response?.status === 409 ||
        error.message?.includes("E11000") ||
        error.message?.includes("already enrolled")
      ) {
        alert("You are already enrolled in this course.");
      } else {
        alert("Failed to enroll. Please try again.");
      }
    }
  };

  const handleUnenroll = async (courseId: string) => {
    try {
      const confirmUnenroll = window.confirm(
        "Are you sure you want to unenroll from this course?"
      );
      if (confirmUnenroll) {
        await enrollmentClient.unenrollUserFromCourse(
          currentUser._id,
          courseId
        );
        dispatch(unenrollFromCourse({ userId: currentUser._id, courseId }));
        console.log("Successfully unenrolled");

        // Refresh enrollments after successful unenrollment
        const userEnrollments = await enrollmentClient.findEnrollmentsForUser(
          currentUser._id
        );
        dispatch(setEnrollments(userEnrollments));
      }
    } catch (error: any) {
      console.error("Error unenrolling:", error);
      if (error.response?.status === 404) {
        alert("Enrollment not found.");
      } else {
        alert("Failed to unenroll. Please try again.");
      }
    }
  };

  // Debug logging
  console.log("Dashboard state:", {
    currentUser: currentUser?._id,
    isFaculty,
    enrolling,
    showAllCourses,
    totalCourses: courses.length,
    displayedCourses: displayedCourses.length,
    enrollments: enrollments.length,
  });

  // Debug logging for null courses
  console.log("Courses before filtering:", displayedCourses);
  console.log("Null courses:", displayedCourses.filter(c => !c || !c._id));

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>

      {/* Toggle button between "All Courses" and "My Courses" modes */}
      {!isFaculty && (
        <button
          onClick={() => setEnrolling(!enrolling)}
          className="float-end btn btn-primary"
        >
          {enrolling ? "My Courses" : "All Courses"}
        </button>
      )}
      <hr />

      {isFaculty && (
        <>
          <h5>
            {currentCourse._id ? "Edit Course" : "New Course"}
            <button
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={addNewCourse}
              disabled={!currentCourse.name?.trim()}
              style={{ display: currentCourse._id ? "none" : "inline-block" }}
            >
              Add
            </button>
            <button
              className="btn btn-success float-end me-2"
              id="wd-update-course-click"
              onClick={updateCourseHandler}
              disabled={!currentCourse._id || !currentCourse.name?.trim()}
              style={{ display: currentCourse._id ? "inline-block" : "none" }}
            >
              Update
            </button>
            {currentCourse._id && (
              <button
                className="btn btn-secondary float-end me-2"
                onClick={() =>
                  dispatch(
                    setCurrentCourse({
                      _id: "",
                      name: "",
                      description: "",
                      number: "",
                      startDate: "",
                      endDate: "",
                    })
                  )
                }
              >
                Cancel
              </button>
            )}
          </h5>
          <br />
          <FormControl
            value={currentCourse.name || ""}
            className="mb-2"
            placeholder="Course Name"
            onChange={(e) =>
              setCourse({ ...currentCourse, name: e.target.value })
            }
          />
          <FormControl
            value={currentCourse.description || ""}
            rows={3}
            as="textarea"
            placeholder="Course Description"
            onChange={(e) =>
              setCourse({ ...currentCourse, description: e.target.value })
            }
          />
          <hr />
        </>
      )}

      <div className="d-flex justify-content-between align-items-center">
        <h2 id="wd-dashboard-published">
          {enrolling || showAllCourses ? "All Courses" : "My Courses"} (
          {displayedCourses.filter((courseItem: Course) => courseItem && courseItem._id).length})
        </h2>

        {/* Show enrolled/all toggle only when not in enrolling mode and not faculty */}
        {!isFaculty && !enrolling && (
          <button
            className="btn btn-secondary"
            onClick={handleEnrollmentToggle}
          >
            {showAllCourses ? "Show My Courses" : "Show All Courses"}
          </button>
        )}
      </div>
      <hr />

      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {displayedCourses
            .filter((courseItem: Course) => courseItem && courseItem._id) // Filter out null/undefined courses
            .map((courseItem: Course) => {
              const userIsEnrolled = isEnrolled(courseItem._id);

              return (
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
                        {/* Faculty controls */}
                        {isFaculty && (
                          <>
                            <Link to={`/Kambaz/Courses/${courseItem._id}/Home`}>
                              <Button variant="primary">Go</Button>
                            </Link>
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

                        {/* Student controls */}
                        {!isFaculty && (
                          <>
                            {/* Show "Go" button only if enrolled */}
                            {userIsEnrolled && (
                              <Link to={`/Kambaz/Courses/${courseItem._id}/Home`}>
                                <Button variant="primary">Go</Button>
                              </Link>
                            )}

                            {/* Show enrollment controls based on mode */}
                            {enrolling ? (
                              // In enrolling mode, show toggle button
                              <button
                                onClick={(event) => {
                                  event.preventDefault();
                                  updateEnrollment(
                                    courseItem._id,
                                    !userIsEnrolled
                                  );
                                }}
                                className={`btn float-end ${
                                  userIsEnrolled ? "btn-danger" : "btn-success"
                                }`}
                              >
                                {userIsEnrolled ? "Unenroll" : "Enroll"}
                              </button>
                            ) : (
                              // In normal mode, show appropriate button
                              <>
                                {userIsEnrolled ? (
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
                                  // Only show enroll button if viewing all courses and not enrolled
                                  showAllCourses && (
                                    <button
                                      onClick={(event) => {
                                        event.preventDefault();
                                        handleEnroll(courseItem._id);
                                      }}
                                      className="btn btn-success float-end"
                                    >
                                      Enroll
                                    </button>
                                  )
                                )}
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
        </Row>
      </div>
    </div>
  );
}