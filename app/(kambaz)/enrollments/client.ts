import axios from "axios";
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const ENROLLMENTS_API = `${HTTP_SERVER}/api/enrollments`;

export const getEnrollments = async (userId: string) => {
    const {data} = await axios.get(`${ENROLLMENTS_API}/${userId}`);
    return data;
}

export const enrollUser = async (userId: string, courseId: string) => {
    const {data} = await axios.post(`${ENROLLMENTS_API}`, {userId: userId, courseId: courseId});
    return data;
}

export const unenrollUser = async (userId: string, courseId: string) => {
    const {data} = await axios.delete(`${ENROLLMENTS_API}/${userId}/${courseId}`);
    return data;
}
