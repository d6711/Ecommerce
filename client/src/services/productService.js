import axiosClient from "@config/axiosClient"

// export const getProducts = async ({ query }) => {
//     const { search, page, limit, minPrice, maxPrice, tags, sortBy, order } = query
//     return await axiosClient.get(`/products?search=${search}&page=${page}&limit=${limit}&maxPrice=${maxPrice}&minPrice=${minPrice}&tags=${tags}&sortBy=${sortBy}&order=${order}`)
// }

export const getProducts = async () => {
    return await axiosClient.get(`/products`)
}