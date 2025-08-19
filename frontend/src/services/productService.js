import axiosClient from "@src/config/axiosClient"

export const getProducts = async (query) => {
    console.log(query)
    const { search, page, limit, minPrice, maxPrice, tags, sortBy, order } = query
    return await axiosClient.get(`/products?search=${search}&page=${page}&limit=${limit}`)
}

export const createProduct = async (data) => {
    return await axiosClient.post('/products', data)
}

export const updateProduct = async (id, data) => {
    return await axiosClient.patch(`/products/${id}`, data)
}

export const deleteProduct = async (id) => {
    return await axiosClient.delete(`/products/${id}`)
}

