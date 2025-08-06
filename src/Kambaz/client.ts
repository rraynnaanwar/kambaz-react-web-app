import axios from "axios";

const HTTP_SERVER = import.meta.env.VITE_HTTP_SERVER;
const USERS_API = `${HTTP_SERVER}/api/users`;
const COURSES_API = `${HTTP_SERVER}/api/courses`;
const ENROLLMENTS_API = `${HTTP_SERVER}/api/enrollments`;

export const enrollUserInCourse = async (userId: string, courseId: string) => {
  const { data } = await axios.post(
    `${USERS_API}/${userId}/courses/${courseId}/enroll`
  );
  return data;
};

export const unenrollUserFromCourse = async (userId: string, courseId: string) => {
  const { data } = await axios.delete(
    `${USERS_API}/${userId}/courses/${courseId}/unenroll`
  );
  return data;
};

export const findEnrollmentsForUser = async (userId: string) => {
  const { data } = await axios.get(`${USERS_API}/${userId}/enrollments`);
  return data;
};

export const findEnrollmentsForCourse = async (courseId: string) => {
  const { data } = await axios.get(`${COURSES_API}/${courseId}/enrollments`);
  return data;
};

export const findAllEnrollments = async () => {
  const { data } = await axios.get(ENROLLMENTS_API);
  return data;
};

export const checkEnrollment = async (userId: string, courseId: string) => {
  const { data } = await axios.get(
    `${USERS_API}/${userId}/courses/${courseId}/enrollment`
  );
  return data;
};