import { axiosInstance } from "./Axiospath.js";

export const singupUser = async (user) => {
    try {
        const response = await axiosInstance.post('/api/singup', user);
        return response.data;

    } catch (error) {

        return error
    }
}

export const loginUser = async (user) => {
    try {
        const response = await axiosInstance.post('/api/login', user);
        return response.data;

    } catch (error) {

        return error
    }
}