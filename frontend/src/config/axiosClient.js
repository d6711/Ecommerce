import { URL_SERVER } from '@src/utils/env'
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
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
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
    if (originalRequest && err.response?.status === 401 && err.response?.data?.message === 'Failed to verify token: jwt expired' && !originalRequest._retry) {
        originalRequest._retry = true
        const refreshToken = Cookies.get('refreshToken')
        const userId = Cookies.get('userId') // Lấy client-id từ cookie

        if (!refreshToken || !userId) return Promise.reject(err)

        try {
            const res = await axiosRefresh.post('/auth/refresh-token', null, {
                headers: {
                    'x-rtoken-key': refreshToken,
                }
            })

            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.data?.metadata

            Cookies.set('accessToken', newAccessToken)
            Cookies.set('refreshToken', newRefreshToken)

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
            return axiosClient(originalRequest)
        } catch (error) {
            Cookies.remove('accessToken')
            Cookies.remove('refreshToken')
            Cookies.remove('userId')
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

