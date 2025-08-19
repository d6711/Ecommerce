import axiosClient from "@src/config/axiosClient"

// Upload 1 ảnh
export const uploadImage = async (file) => {
    const formData = new FormData()
    formData.append('file', file)

    const res = await axiosClient.post('/upload/file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })

    return res.data?.imageUrl || null
}

// Upload nhiều ảnh
export const uploadMultipleFiles = async (files) => {
    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i])
    }

    const res = await axiosClient.post('/upload/files', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })

    // response dạng array → map chỉ lấy imageUrl
    return (res.data || []).map(item => item.imageUrl)
}
