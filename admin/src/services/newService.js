import axiosClient from "@src/config/axiosClient";

export const getNews = async ({ page = 1, limit = 10, search = "" }) => {
    return await axiosClient.get(
        `/news?page=${page}&limit=${limit}&search=${search}`
    )
}

export const createNews = async (body) => {
    return await axiosClient.post(`/news`, body)
}

export const updateNews = async (id, body) => {
    return await axiosClient.patch(`/news/${id}`, body)
}

export const deleteNews = async (id) => {
    return await axiosClient.delete(`/news/${id}`)
}


export const getCatalogs = async ({ page = 1, limit = 10 }) => {
    return await axiosClient.get(`/catalog?page=${page}&limit=${limit}`)
}

export const getAllCatalogs = async () => {
    return await axiosClient.get(`/catalog/all`)
}

export const createCatalog = async (body) => {
    return await axiosClient.post(`/catalog`, body)
}

export const updateCatalog = async (id, body) => {
    return await axiosClient.patch(`/catalog/${id}`, body)
}

export const deleteCatalog = async (id) => {
    return await axiosClient.delete(`/catalog/${id}`)
}