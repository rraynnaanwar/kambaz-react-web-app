import axios from "axios";

export const HTTP_SERVER = import.meta.env.VITE_HTTP_SERVER;
export const QUIZZES_API = `${HTTP_SERVER}/api/quizzes`;
const axiosWithCredentials = axios.create({ withCredentials: true });

export const setQuizPublished = async (quiz_id: string, published: boolean) => {
  const response = await axiosWithCredentials.put(
    `${QUIZZES_API}/${quiz_id}`,
    { published }
  );
  return response.data;
};

export const createQuiz = async (quiz: any) => {
  const response = await axiosWithCredentials.post(
    `${QUIZZES_API}/create`,
    { quiz }
  );
  return response.data;
};

export const getQuizzesByCourse = async (course_id: string) => {
  const response = await axiosWithCredentials.get(
    `${QUIZZES_API}/courses/getQuizzesByCourse/${course_id}`
  );
  return response.data;
};

export const getQuizById = async (quiz_id: string) => {
  const response = await axiosWithCredentials.get(
    `${QUIZZES_API}/courses/getQuizById/${quiz_id}`
  );
  return response.data;
};

export const deleteQuiz = async (quiz_id: string) => {
  const response = await axiosWithCredentials.delete(
    `${QUIZZES_API}/courses/deleteQuiz/${quiz_id}`
  );
  return response.data;
}
