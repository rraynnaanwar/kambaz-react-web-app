import { Routes, Route, Navigate } from "react-router";
import Account from "./Account";
import Dashboard from "./Dashboard";
import KambazNavigation from "./Navigation";
import Courses from "./Courses";
import ProtectedCourseRoute from "./Courses/ProtectedCourseRoute";
import ProtectedRoute from "./Account/ProtectedRoute";
import Session from "./Account/Session";
import "./styles.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as courseClient from "./Courses/client";
import * as userClient from "./Account/client";

export default function Kambaz() {
  const [courses, setCourses] = useState<any[]>([]);
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const addNewCourse = async (course: any) => {
    try {
      const newCourse = await courseClient.createCourse(course);
      setCourses((prevCourses) => [...prevCourses, newCourse]);
      return newCourse;
    } catch (error) {
      console.error("Error creating course:", error);
      throw error;
    }
  };

  const deleteCourse = async (courseId: string) => {
    try {
      const status = await courseClient.deleteCourse(courseId);
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course._id !== courseId)
      );
    } catch (error) {
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

  const [enrolling, setEnrolling] = useState<boolean>(false);

  const findCoursesForUser = async () => {
    try {
      // Add null check here!
      if (!currentUser || !currentUser._id) {
        console.log("No currentUser found in findCoursesForUser");
        return;
      }
      console.log("Finding courses for user:", currentUser._id);
      const courses = await userClient.findCoursesForUser(currentUser._id);
      setCourses(courses);
    } catch (error) {
      console.error("Error in findCoursesForUser:", error);
    }
  };

  const updateEnrollment = async (courseId: string, enrolled: boolean) => {
    try {
      // Add null check here!
      if (!currentUser || !currentUser._id) {
        console.error("No currentUser found in updateEnrollment");
        return;
      }
      
      if (enrolled) {
        await userClient.enrollIntoCourse(currentUser._id, courseId);
      } else {
        await userClient.unenrollFromCourse(currentUser._id, courseId);
      }
      setCourses(
        courses.map((course) => {
          if (course._id === courseId) {
            return { ...course, enrolled: enrolled };
          } else {
            return course;
          }
        })
      );
    } catch (error) {
      console.error("Error in updateEnrollment:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      // Add null check here!
      if (!currentUser || !currentUser._id) {
        console.log("No currentUser found in fetchCourses");
        return;
      }
      
      console.log("Fetching all courses for user:", currentUser._id);
      const allCourses = await courseClient.fetchAllCourses();
      const enrolledCourses = await userClient.findCoursesForUser(
        currentUser._id
      );
      const courses = allCourses.map((course: any) => {
        if (enrolledCourses.find((c: any) => c._id === course._id)) {
          return { ...course, enrolled: true };
        } else {
          return course;
        }
      });
      setCourses(courses);
    } catch (error) {
      console.error("Error in fetchCourses:", error);
    }
  };

  useEffect(() => {
    console.log("useEffect running - currentUser:", currentUser, "enrolling:", enrolling);
    
    // Only run if currentUser exists
    if (currentUser && currentUser._id) {
      if (enrolling) {
        fetchCourses();
      } else {
        findCoursesForUser();
      }
    } else {
      console.log("Skipping course fetch - no valid user");
      // Clear courses if no user
      setCourses([]);
    }
  }, [currentUser, enrolling]);

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
                    enrolling={enrolling}
                    setEnrolling={setEnrolling}
                    updateEnrollment={updateEnrollment}
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