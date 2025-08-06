import { Routes, Route, Navigate } from "react-router";
import Account from "./Account";
import Dashboard from "./Dashboard";
import KambazNavigation from "./Navigation";
import Courses from "./Courses";
import ProtectedCourseRoute from "./Courses/ProtectedCourseRoute";
import ProtectedRoute from "./Account/ProtectedRoute";
import Session from "./Account/Session";
import * as userClient from "./Account/client";
import "./styles.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as courseClient from "./Courses/client";

export default function Kambaz() {
  const [courses, setCourses] = useState<any[]>([]);
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const addNewCourse = async (course: any) => {
    try {
      const newCourse = await userClient.createCourse(course);
      setCourses((prevCourses) => [...prevCourses, newCourse]);
      return newCourse;
    } catch (error) {
      console.error("Error creating course:", error);
      throw error;
    }
  };

  const deleteCourse = async (courseId: string) => {
    try {
      console.log("Deleting course with ID:", courseId);
      await courseClient.deleteCourse(courseId);
      setCourses((prevCourses) => prevCourses.filter((course) => course._id !== courseId));
      console.log("Course deleted successfully");
    } catch (error) {
      console.error("Error deleting course:", error);
      throw error;
    }
  };

  const updateCourse = async (course: any) => {
    try {
      console.log("Updating course:", course);
      const updatedCourse = await courseClient.updateCourse(course);
      setCourses((prevCourses) =>
        prevCourses.map((c) => (c._id === course._id ? updatedCourse : c))
      );
      return updatedCourse;
    } catch (error) {
      console.error("Error updating course:", error);
      throw error;
    }
  };



  const fetchCourses = async () => {
    try {
      const courses = await userClient.findMyCourses();
      setCourses(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchCourses();
    }
  }, [currentUser]);

  return (
    <Session>
      <div id="wd-kambaz">
        <KambazNavigation />
        <div className="wd-main-content-offset p-3">
          <Routes>
            <Route path="/" element={<Navigate to="/Kambaz/Account" />} />
            <Route path="/Account/*" element={<Account />} />
            <Route
              path="/Dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard 
                    addNewCourse={addNewCourse} 
                    courses={courses}
                    deleteCourse={deleteCourse}
                    updateCourse={updateCourse}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="Courses/:cid/*"
              element={
                <ProtectedRoute>
                  <ProtectedCourseRoute>
                    <Courses />
                  </ProtectedCourseRoute>
                </ProtectedRoute>
              }
            />
            <Route path="/Calendar" element={<h1>Calendar</h1>} />
            <Route path="/Inbox" element={<h1>Inbox</h1>} />
          </Routes>
        </div>
      </div>
    </Session>
  );
}