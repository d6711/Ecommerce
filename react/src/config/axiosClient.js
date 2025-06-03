import { env } from '@config/env'
import axios from 'axios'

const axiosClient = axios.create({
    baseURL: env.BASE_URL,
    timeout: 10000,
    withCredentials: true, // ✅ Cookie sẽ tự được gửi kèm request
    headers: {
        'Content-Type': 'application/json'
    }
})

// Optional: thêm log, loading, xử lý lỗi ở đây nếu muốn

axiosClient.interceptors.request.use(
    (config) => {
        // Không cần thêm Authorization header nữa nếu bạn dùng cookie
        return config
    },
    (error) => Promise.reject(error)
)

axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Tuỳ bạn xử lý lỗi, nhưng nếu dùng cookie thì không có token để refresh
        if (error.response?.status === 401) {
            // Có thể redirect to login hoặc gọi logout logic
            console.error('Unauthorized. Please login again.')
        }

        return Promise.reject(error)
    }
)

export default axiosClient
