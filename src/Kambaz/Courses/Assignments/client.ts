import axios from "axios";

const HTTP_SERVER = import.meta.env.VITE_HTTP_SERVER;
const ASSIGNMENTS_API = `${HTTP_SERVER}/api/courses`;

export const createAssignment = async (assignment: any) => {
  const response = await axios.post(
    `${ASSIGNMENTS_API}/${assignment.course}/assignments`,
    assignment
  );
  return response.data;
};

export const findAssignmentsForCourse = async (courseId: string) => {
  const response = await axios.get(
    `${ASSIGNMENTS_API}/${courseId}/assignments`
  );
  return response.data;
};

export const updateAssignment = async (
  courseId: string,
  assignmentId: string,
  updates: any
) => {
  const response = await axios.put(
    `${ASSIGNMENTS_API}/${courseId}/assignments/${assignmentId}`,
    updates
  );
  return response.data;
};

export const deleteAssignment = async (
  courseId: string,
  assignmentId: string
) => {
  const response = await axios.delete(
    `${ASSIGNMENTS_API}/${courseId}/assignments/${assignmentId}`
  );
  return response.data;
};
