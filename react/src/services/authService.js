import axiosClient from "@config/axiosClient"

export const login = async (body) => {
    return await axiosClient.post('/auth/login', body)
}

export const getMe = async () => {
    return await axiosClient.get('/auth/me')
}

export const logout = async () => {
    return await axiosClient.post('/auth/logout')
}