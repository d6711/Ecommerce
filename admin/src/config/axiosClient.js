import { env } from '@config/env'
import axios from 'axios'
import Cookies from 'js-cookie'

const axiosClient = axios.create({
    baseURL: env.URL_SERVER,
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
const axiosRefresh = axios.create({ baseURL: env.URL_SERVER })

const handleResponseErr = async (err) => {
    const originalRequest = err.config
    if (originalRequest && err.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true
        const refreshToken = Cookies.get('refreshToken')
        if (!refreshToken) return Promise.reject(err)

        try {
            const res = await axiosRefresh.post('/auth/refresh-token', null, {
                headers: {
                    'x-rtoken-key': refreshToken
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


// Bạn gọi handleLogout → xóa cookies.

// Sau đó window.location.href = '/login' sẽ reload page.

// Nhưng trong khoảng thời gian giữa việc xóa cookies và reload, có thể một request API bị 401 → trigger axios interceptor để gọi lại /auth/refresh-token.

// Khi đó refreshToken vẫn còn trong memory (hoặc chưa bị xóa kịp do delay giữa các tác vụ JS), nên axios vẫn gọi refresh và set lại token mới.