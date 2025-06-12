import axiosClient from "@config/axiosClient"

export const getCategories = async ({ page = 1, limit = 10 }) => {
    return await axiosClient.get('/categories', { params: { page, limit } })
}

export const getCategoryChild = async (parentId) => {
    return await axiosClient.get(`/categories/${parentId}/child`)
}

export const createCategory = async (body) => {
    return await axiosClient.post('/categories', body)
}

export const deleteCategory = async (id) => {
    return await axiosClient.delete(`/categories/${id}`)
}
