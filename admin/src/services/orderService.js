import axiosClient from "@src/config/axiosClient"

export const getOrders = async ({ page, limit }) => {
    return await axiosClient.get(`/order?page=${page}&limit=${limit}`)
}

export const updateStatusOrder = async (id, body) => {
    return await axiosClient.patch(`/order/${id}`, body)
}