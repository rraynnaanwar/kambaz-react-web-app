import axios from "axios";

export const HTTP_SERVER = import.meta.env.VITE_HTTP_SERVER;
export const QUIZZES_API = `${HTTP_SERVER}/api/quizzes`;
export const QUIZ_ATTEMPTS_API = `${HTTP_SERVER}/api/quiz-attempts`;

const axiosWithCredentials = axios.create({ withCredentials: true });

// Quiz Management Functions
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
};

export const updateQuiz = async (quiz_id: string, quiz: any) => {
  const response = await axiosWithCredentials.put(
    `${QUIZZES_API}/${quiz_id}`,
    { quiz }
  );
  return response.data;
};

// Question Management Functions
export const getQuestionsByQuiz = async (quiz_id: string) => {
  const response = await axiosWithCredentials.get(
    `${QUIZZES_API}/${quiz_id}/questions`
  );
  return response.data;
};

export const createQuestion = async (quiz_id: string, question: any) => {
  const response = await axiosWithCredentials.post(
    `${QUIZZES_API}/${quiz_id}/questions`,
    { question }
  );
  return response.data;
};

export const updateQuestion = async (quiz_id: string, question_id: string, question: any) => {
  const response = await axiosWithCredentials.put(
    `${QUIZZES_API}/${quiz_id}/questions/${question_id}`,
    { question }
  );
  return response.data;
};

export const deleteQuestion = async (quiz_id: string, question_id: string) => {
  const response = await axiosWithCredentials.delete(
    `${QUIZZES_API}/${quiz_id}/questions/${question_id}`
  );
  return response.data;
};

// Quiz Attempts Functions
export const getUserQuizAttempts = async (userId: string, quizId: string) => {
  const response = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}/attempts/user/${userId}`);
  return response.data;
};

export const createQuizAttempt = async (attemptData: any) => {
  const response = await axiosWithCredentials.post(`${QUIZZES_API}/${attemptData.quizId}/attempts`, attemptData);
  return response.data;
};

export const updateQuizAttempt = async (attemptId: string, updateData: any) => {
  const response = await axiosWithCredentials.put(`${QUIZ_ATTEMPTS_API}/${attemptId}`, updateData);
  return response.data;
};

export const getQuizAttempt = async (attemptId: string) => {
  const response = await axiosWithCredentials.get(`${QUIZ_ATTEMPTS_API}/${attemptId}`);
  return response.data;
};

export const getLatestAttempt = async (userId: string, quizId: string) => {
  const response = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}/latest-attempt/${userId}`);
  return response.data;
};

// Utility Functions
export const canUserTakeQuiz = async (userId: string, quizId: string) => {
  try {
    const [quiz, attempts] = await Promise.all([
      getQuizById(quizId),
      getUserQuizAttempts(userId, quizId)
    ]);
    
    const completedAttempts = attempts.filter((attempt: any) => attempt.isCompleted);
    
    if (!quiz.multipleAttempts && completedAttempts.length > 0) {
      return { canTake: false, reason: "Multiple attempts not allowed" };
    }
    
    if (quiz.multipleAttempts && completedAttempts.length >= quiz.maxAttempts) {
      return { canTake: false, reason: "Maximum attempts reached" };
    }
    
    return { canTake: true, attemptsUsed: completedAttempts.length, maxAttempts: quiz.maxAttempts };
  } catch (error) {
    console.error("Error checking if user can take quiz:", error);
    return { canTake: false, reason: "Error checking quiz availability" };
  }
};

export const calculateQuizScore = async (quizId: string, answers: {[key: string]: any}) => {
  try {
    const questions = await getQuestionsByQuiz(quizId);
    let score = 0;
    
    questions.forEach((question: any) => {
      const userAnswer = answers[question._id];
      let isCorrect = false;
      
      if (question.type === "MULTIPLE_CHOICE") {
        const correctAnswer = question.answers.find((a: any) => a.isCorrect);
        isCorrect = userAnswer === correctAnswer?._id;
      } else if (question.type === "TRUE_FALSE") {
        isCorrect = userAnswer === question.correctAnswer;
      } else if (question.type === "FILL_BLANK") {
        const userAnswerLower = userAnswer?.toString().toLowerCase().trim();
        isCorrect = question.possibleAnswers?.some((possible: string) => 
          possible.toLowerCase().trim() === userAnswerLower
        );
      }
      
      if (isCorrect) {
        score += question.points || 1;
      }
    });
    
    const maxScore = questions.reduce((sum: number, q: any) => sum + (q.points || 1), 0);
    return { score, maxScore, percentage: (score / maxScore) * 100 };
  } catch (error) {
    console.error("Error calculating quiz score:", error);
    return { score: 0, maxScore: 0, percentage: 0 };
  }
};