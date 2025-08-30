import React from 'react'
import { Result, Button } from 'antd'
import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
    const navigate = useNavigate()

    return (
        <Result
            status="404"
            title="404"
            subTitle="Xin lỗi, trang bạn tìm không tồn tại."
            extra={
                <Button type="primary" onClick={() => navigate('/')}>
                    Quay về Trang chủ
                </Button>
            }
        />
    )
}

export default NotFoundPage
