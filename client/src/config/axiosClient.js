import { URL_SERVER } from '@utils/env'
import axios from 'axios'
import Cookies from 'js-cookie'

const axiosClient = axios.create({
    baseURL: `${URL_SERVER}/v1/api`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})
const handleRequestSuccess = async (config) => {
    const accessToken = Cookies.get('accessToken')
    const userId = Cookies.get('userId')
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
    if (userId) config.headers['client-id'] = userId
    return config
}

const handleRequestErr = (err) => {
    return Promise.reject(err)
}

const handleResponseSuccess = (res) => {
    return res
}

// Tạo 1 axios instance riêng để gọi refresh-token
const axiosRefresh = axios.create({ baseURL: `${URL_SERVER}/v1/api` })

const handleResponseErr = async (err) => {
    const originalRequest = err.config
    if (originalRequest && err.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true
        const refreshToken = Cookies.get('refreshToken')
        const userId = Cookies.get('userId') // Lấy client-id từ cookie

        if (!refreshToken) return Promise.reject(err)

        try {
            const res = await axiosRefresh.post('/auth/user/refresh-token', null, {
                headers: {
                    'x-rtoken-key': refreshToken,
                    ...(userId && { 'client-id': userId }) // Đính kèm nếu có
                }
            })

            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.data?.metadata

            Cookies.set('accessToken', newAccessToken)
            Cookies.set('refreshToken', newRefreshToken)

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
            originalRequest.headers['client-id'] = userId
            return axiosClient(originalRequest)
        } catch (error) {
            Cookies.remove('accessToken')
            Cookies.remove('refreshToken')
            return Promise.reject(error)
        }
    }
    return Promise.reject(err)
}


axiosClient.interceptors.request.use(
    (config) => handleRequestSuccess(config),
    (err) => handleRequestErr(err)
)

axiosClient.interceptors.response.use(
    (config) => handleResponseSuccess(config),
    (err) => handleResponseErr(err)
)

export default axiosClient

