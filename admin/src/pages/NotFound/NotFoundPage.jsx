import React from 'react'
import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
    const navigate = useNavigate()
    return (
        <Result
            status="404"
            title="404"
            subTitle="Rất tiếc, trang bạn đã truy cập không tồn tại."
            extra={
                <Button type="primary" onClick={() => navigate(-1)}>
                    Quay lại
                </Button>
            }
        />
    )
}
export default NotFoundPage
