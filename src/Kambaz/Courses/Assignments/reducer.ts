import { createSlice } from "@reduxjs/toolkit";
import * as db from "../../Database";

const initialState = {
  assignments: db.assignments,
};

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    setAssignments: (state, action) => {
      state.assignments = action.payload;
    },
    addAssignment: (state, action) => {
      const newAssignment = {
        _id: new Date().getTime().toString(),
        ...action.payload,
      };
      state.assignments = [...state.assignments, newAssignment];
    },
    deleteAssignment: (state, action) => {
      state.assignments = state.assignments.filter(
        (assignment) => assignment._id !== action.payload
      );
    },
    updateAssignment: (state, action) => {
      state.assignments = state.assignments.map((assignment) =>
        assignment._id === action.payload._id ? action.payload : assignment
      );
    },
    editAssignment: (state, action) => {
      state.assignments = state.assignments.map((assignment) =>
        assignment._id === action.payload._id 
          ? { ...assignment, ...action.payload } 
          : assignment
      );
    },
  },
});

export const { 
  setAssignments, 
  addAssignment, 
  deleteAssignment, 
  updateAssignment,
  editAssignment 
} = assignmentsSlice.actions;

export default assignmentsSlice.reducer;