import axiosClient from '@config/axiosClient'

export const uploadImage = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return await axiosClient.post('/upload/file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
}
