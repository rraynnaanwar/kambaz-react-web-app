// src/Kambaz/Courses/reducer.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import * as db from "../Database"

export interface Course {
  _id: string;
  name: string;
  number: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Enrollment {
  _id: string;
  user: string;
  course: string;
}

export interface CoursesState {
  courses: Course[];
  currentCourse: Course;
  enrollments: Enrollment[];
  showAllCourses: boolean;
}

const initialState: CoursesState = {
  courses: db.courses,
  enrollments: db.enrollments,
  showAllCourses: false,
  currentCourse: {
    _id: "1234",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    description: "New Description",
  },
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setCourses: (state, action: PayloadAction<Course[]>) => {
      state.courses = action.payload;
    },
    setCurrentCourse: (state, action: PayloadAction<Course>) => {
      state.currentCourse = action.payload;
    },
    setEnrollments: (state, action: PayloadAction<Enrollment[]>) => {
      state.enrollments = action.payload;
    },
    toggleShowAllCourses: (state) => {
      state.showAllCourses = !state.showAllCourses;
    },
    addCourse: (state, action: PayloadAction<Partial<Course>>) => {
      const newCourse: Course = {
        _id: new Date().getTime().toString(),
        name: state.currentCourse.name,
        number: state.currentCourse.number,
        startDate: state.currentCourse.startDate,
        endDate: state.currentCourse.endDate,
        description: state.currentCourse.description,
        ...action.payload,
      };
      state.courses = [...state.courses, newCourse];
    },
    deleteCourse: (state, action: PayloadAction<string>) => {
      state.courses = state.courses.filter(
        (course) => course._id !== action.payload
      );
      // Also remove related enrollments
      state.enrollments = state.enrollments.filter(
        (enrollment) => enrollment.course !== action.payload
      );
    },
    updateCourse: (state, action: PayloadAction<Course>) => {
      state.courses = state.courses.map((course) =>
        course._id === action.payload._id ? action.payload : course
      );
    },
    editCourse: (state, action: PayloadAction<Partial<Course> & { _id: string }>) => {
      state.courses = state.courses.map((course) =>
        course._id === action.payload._id 
          ? { ...course, ...action.payload }
          : course
      );
    },
    enrollInCourse: (state, action: PayloadAction<{ userId: string; courseId: string }>) => {
      const newEnrollment: Enrollment = {
        _id: new Date().getTime().toString(),
        user: action.payload.userId,
        course: action.payload.courseId,
      };
      state.enrollments = [...state.enrollments, newEnrollment];
    },
    unenrollFromCourse: (state, action: PayloadAction<{ userId: string; courseId: string }>) => {
      state.enrollments = state.enrollments.filter(
        (enrollment) => 
          !(enrollment.user === action.payload.userId && 
            enrollment.course === action.payload.courseId)
      );
    },
    addEnrollment: (state, action: PayloadAction<{ userId: string; courseId: string }>) => {
      const newEnrollment: Enrollment = {
        _id: new Date().getTime().toString(),
        user: action.payload.userId,
        course: action.payload.courseId,
      };
      state.enrollments = [...state.enrollments, newEnrollment];
    },
    removeEnrollment: (state, action: PayloadAction<{ userId: string; courseId: string }>) => {
      state.enrollments = state.enrollments.filter(
        (enrollment) => 
          !(enrollment.user === action.payload.userId && 
            enrollment.course === action.payload.courseId)
      );
    },
  },
});

export const {
  setCourses,
  setCurrentCourse,
  setEnrollments,
  toggleShowAllCourses,
  addCourse,
  deleteCourse,
  updateCourse,
  editCourse,
  enrollInCourse,
  unenrollFromCourse,
  addEnrollment,
  removeEnrollment
} = coursesSlice.actions;

export default coursesSlice.reducer;