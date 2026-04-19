import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

const QUIZZES_API = `${HTTP_SERVER}/api/quizzes`;
const ATTEMPTS_API = `${QUIZZES_API}/attempts`;

export const getQuizzesByCourse = async (
  courseId: string,
  onlyPublished: boolean,
) => {
  const { data } = await axios.get(
    `${QUIZZES_API}?courseId=${courseId}${onlyPublished ? "&published=true" : ""}`,
    {withCredentials: true}
  );
  return data;
};

export const getQuizzesByUser = async (userId: string) => {
  const { data } = await axiosWithCredentials.get(
    `${QUIZZES_API}?userId=${userId}`,
    {withCredentials: true}
  );
  return data;
};

export const getQuizById = async (quizId: string) => {
  const { data } = await axios.get(`${QUIZZES_API}/${quizId}`,
  );
  return data;
};

export const createQuiz = async (quiz: object) => {
  const { data } = await axiosWithCredentials.post(QUIZZES_API, {quiz: quiz});
  return data;
};

export const updateQuiz = async (quiz: object) => {
  const { data } = await axios.put(QUIZZES_API, {updates: quiz});
  return data;
};

export const deleteQuiz = async (quizId: string) => {
  const { data } = await axios.delete(`${QUIZZES_API}/${quizId}`);
  return data;
};

export const addQuizAttempt = async (quizId: string, attempt: object) => {
  const { data } = await axiosWithCredentials.post(
    `${QUIZZES_API}/${quizId}/attempts`,
    {attempt: attempt},
  );
  return data;
};

export const getQuizAttempts = async (quizId: string) => {
  const { data } = await axios.get(`${QUIZZES_API}/${quizId}/attempts`, {withCredentials: true});
  return data;
};

export const getQuizAttemptsByCourse = async (courseId: string) => {
  const { data } = await axios.get(`${ATTEMPTS_API}?courseId=${courseId}`);
  return data;
};

export const getQuizAttemptsByUser = async () => {
  const { data } = await axiosWithCredentials.get(`${ATTEMPTS_API}`);
  return data;
};

export const deleteQuizAttempt = async (attemptId: string) => {
  const { data } = await axios.delete(`${ATTEMPTS_API}/${attemptId}`);
  return data;
};

export const deleteAllQuizAttempts = async (quizId: string) => {
  const { data } = await axios.delete(`${QUIZZES_API}/${quizId}`);
  return data;
};
