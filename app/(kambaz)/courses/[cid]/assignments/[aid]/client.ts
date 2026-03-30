import axios from "axios";
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const ASSIGNMENTS_API = `${HTTP_SERVER}/api/assignments`;

export const getAllAssignments = async () => {
  const { data } = await axios.get(ASSIGNMENTS_API);
  return data;
};

export const getAssignmentsByCourse = async (cid: string) => {
  const { data } = await axios.get(`${ASSIGNMENTS_API}/course/${cid}`);
  return data;
};

export const getAssignmentById = async (aid: string) => {
  const { data } = await axios.get(`${ASSIGNMENTS_API}/${aid}`);
  return data;
};

export const createAssignment = async (assignment: any) => {
  const { data } = await axios.post(`${ASSIGNMENTS_API}`, assignment);
  return data;
};

export const updateAssignment = async (assignment: any) => {
  const { data } = await axios.put(
    `${ASSIGNMENTS_API}/${assignment._id}`,
    assignment,
  );
  return data;
};

export const deleteAssignment = async (assignmentId: string) => {
  const { data } = await axios.delete(`${ASSIGNMENTS_API}/${assignmentId}`);
  return data;
};
