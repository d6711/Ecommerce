import axiosClient from "@src/config/axiosClient";

export const getAllDiscounts = async ({ page, limit }) => {
    return await axiosClient.get(`/discounts?page=${page}&limit=${limit}`)
}

export const createDiscount = async (body) => {
    return await axiosClient.post('/discounts', body)
}

export const updateDiscount = async (id, body) => {
    return await axiosClient.patch(`/discounts/${id}`, body)
}

export const deleteDiscount = async (id) => {
    return await axiosClient.delete(`/discounts/${id}`)
}