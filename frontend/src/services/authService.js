import axiosClient from "@src/config/axiosClient"

export const login = async (body) => {
    return await axiosClient.post('/auth/user/login', body)
}

export const register = async (body) => {
    return await axiosClient.post('/auth/user/register', body)
}

export const getInfo = async () => {
    return await axiosClient.get('/auth/user/me')
}

export const logout = async () => {
    return await axiosClient.post('/auth/user/logout')
}