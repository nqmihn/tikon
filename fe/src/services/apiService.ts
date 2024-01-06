import axios from "../utils/axios";
import { IPostCreateManyUser } from "../utils/type/user";

const postRegister = (email: string, name: string, password: string, address: string, phoneNumber: string) => {
    return axios.post("/api/v1/auth/register", { email, name, password, address, phoneNumber })
}
const postLogin = (email: string, password: string) => {
    return axios.post("/api/v1/auth/login", {
        username: email,
        password
    })
}
const getAccount = () => {
    return axios.get("/api/v1/auth/account")
}
const postLogout = () => {
    return axios.post("/api/v1/auth/logout")
}
const getAllUser = (query: string) => {
    return axios.get(`/api/v1/user?${query}`)
}
const getUserById = (_id: string) => {
    return axios.get(`/api/v1/user/${_id}`)
}
const postCreateUser = (email: string, password: string, name: string, phoneNumber: string, role: string) => {
    return axios.post('/api/v1/user', { email, password, name, phoneNumber, role })
}
const postCreateManyUser = (data: IPostCreateManyUser[]) => {
    return axios.post('/api/v1/user/bulk', data)
}
export {
    postRegister,
    postLogin,
    getAccount,
    postLogout,
    getAllUser,
    getUserById,
    postCreateUser,
    postCreateManyUser
}