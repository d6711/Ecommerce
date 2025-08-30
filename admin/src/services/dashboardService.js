import axiosClient from "@src/config/axiosClient"

export const getDashboard = async () => {
    return await axiosClient.get(`/dashboard/stats`)
}