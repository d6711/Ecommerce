import axiosClient from "@config/axiosClient"

export const getCategories = async ({ page = 1, limit = 10 }) => {
    return await axiosClient.get(`/categories?page=${page}&limit=${limit}`)
}

export const getCategoryParents = () => {
    return axiosClient.get('/categories/parent')
}


export const getCategoryChild = async (parentId) => {
    return await axiosClient.get(`/categories/${parentId}/child`)
}

export const createCategory = async (body) => {
    return await axiosClient.post('/categories', body)
}

export const updateCategory = (id, data) => {
    return axiosClient.patch(`/categories/${id}`, data)
}

export const deleteCategory = async (id) => {
    return await axiosClient.delete(`/categories/${id}`)
}
