import { useEffect, useState } from 'react'
import { Table, Space, Button, Modal, Descriptions, Input, Tag } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import { useToast } from '@src/context/ToastContext'
import { getAllCustomers } from '@src/services/authService'

const CustomerPage = () => {
    const [loading, setLoading] = useState(false)
    const [customers, setCustomers] = useState([])
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    })
    const [searchQuery, setSearchQuery] = useState('')

    // modal
    const [modalOpen, setModalOpen] = useState(false)
    const [selected, setSelected] = useState(null)

    const toast = useToast()

    // fetch customers
    const fetchCustomers = async ({ page = 1, pageSize = 10, searchQuery = '' }) => {
        setLoading(true)
        try {
            const res = await getAllCustomers({
                page,
                limit: pageSize,
                search: searchQuery.trim(),
            })
            setCustomers(res.data?.metadata || [])
            setPagination((prev) => ({
                ...prev,
                current: page,
                pageSize: pageSize,
                total: res.data?.pagination.totalDocuments || 0,
            }))
        } catch (err) {
            console.error('Fetch customers error:', err)
            toast.error('Lỗi khi tải khách hàng')
        }
        setLoading(false)
    }

    const handleTableChange = (newPagination) => {
        setPagination((prev) => ({
            ...prev,
            current: newPagination.current,
            pageSize: newPagination.pageSize,
        }))
    }

    // columns
    // columns
    const columns = [
        {
            title: 'STT',
            width: 60,
            align: 'center',
            render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
        },
        {
            title: 'Tên khách hàng',
            dataIndex: 'name',
            ellipsis: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            ellipsis: true,
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            ellipsis: true,
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            ellipsis: true,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: 100,
            align: 'center',
            render: (val) => <Tag color={val ? 'green' : 'red'}>{val ? 'Hoạt động' : 'Ngưng'}</Tag>,
        },
        {
            title: 'Hành động',
            width: 100,
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Button type="default" icon={<EyeOutlined />} onClick={() => handleView(record)} />
                </Space>
            ),
        },
    ]

    const handleView = (record) => {
        setSelected(record)
        setModalOpen(true)
    }

    useEffect(() => {
        fetchCustomers({
            page: pagination.current,
            pageSize: pagination.pageSize,
            searchQuery,
        })
    }, [pagination.current, pagination.pageSize, searchQuery])

    return (
        <div>
            <Space style={{ marginBottom: 16 }}>
                <Input.Search placeholder="Tìm kiếm khách hàng" onSearch={(val) => setSearchQuery(val)} enterButton />
            </Space>

            <Table
                columns={columns}
                dataSource={customers}
                loading={loading}
                pagination={{
                    ...pagination,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20', '50'],
                }}
                onChange={handleTableChange}
                rowKey="_id"
            />

            <Modal
                title="Chi tiết khách hàng"
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                footer={null}
                width={800}
            >
                <Descriptions bordered column={2} size="middle">
                    <Descriptions.Item label="Tên">{selected?.name}</Descriptions.Item>
                    <Descriptions.Item label="Email">{selected?.email}</Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">{selected?.phone}</Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ">{selected?.address}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">{selected?.status ? 'Hoạt động' : 'Ngưng'}</Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">
                        {selected?.createdAt ? new Date(selected.createdAt).toLocaleString() : ''}
                    </Descriptions.Item>
                </Descriptions>
            </Modal>
        </div>
    )
}

export default CustomerPage
