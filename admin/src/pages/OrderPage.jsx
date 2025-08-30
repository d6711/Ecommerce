import { useEffect, useState } from 'react'
import { Button, Modal, Space, Table, Tag, Descriptions, Select } from 'antd'
import { EyeOutlined, EditOutlined, FileExcelOutlined } from '@ant-design/icons'
import { useToast } from '@src/context/ToastContext'
import { getOrders, updateStatusOrder } from '@src/services/orderService'
import { exportToExcel } from '@src/utils/exportToExcel'

export const statusMap = {
    Pending: { text: 'Đang chờ', color: 'orange' },
    Confirmed: { text: 'Đã xác nhận', color: 'blue' },
    Paid: { text: 'Đã thanh toán', color: 'green' },
    Shipped: { text: 'Đã giao hàng', color: 'purple' },
    Cancelled: { text: 'Đã hủy', color: 'red' },
}

const OrderPage = () => {
    const [loading, setLoading] = useState(false)
    const [orders, setOrders] = useState([])
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    })

    const [modalOpen, setModalOpen] = useState(false)
    const [modalType, setModalType] = useState('view') // view | edit
    const [selected, setSelected] = useState(null)

    const toast = useToast()

    const handleExportExcel = () => {
        const data = [
            ['Mã Đơn', 'Khách hàng', 'Email', 'Tổng tiền', 'Trạng thái', 'Phương thức', 'Ngày tạo'],
            ...orders.map((o) => [
                o._id,
                o.user?.name || 'N/A',
                o.user?.email || 'N/A',
                new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(o.totalAmount),
                statusMap[o.status]?.text || o.status,
                o.paymentMethod,
                new Date(o.createdAt).toLocaleString(),
            ]),
        ]

        exportToExcel([{ name: 'Đơn hàng', data }], 'DanhSachDonHang.xlsx')
    }

    // fetch orders
    const fetchOrders = async ({ page = 1, pageSize = 10 }) => {
        setLoading(true)
        try {
            const res = await getOrders({ page, limit: pageSize })
            setOrders(res.data?.metadata || [])
            setPagination((prev) => ({
                ...prev,
                current: page,
                pageSize,
                total: res.data?.pagination.totalDocuments || 0,
            }))
        } catch (err) {
            console.error('Fetch orders error:', err)
            toast.error('Lỗi khi tải đơn hàng')
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
    const columns = [
        {
            title: 'STT',
            width: 60,
            align: 'center',
            render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
        },
        {
            title: 'Khách hàng',
            dataIndex: 'user',
            render: (user) => `${user?.name} (${user?.email})`,
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalAmount',
            render: (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status) => {
                const { text, color } = statusMap[status] || { text: status, color: 'default' }
                return <Tag color={color}>{text}</Tag>
            },
        },
        {
            title: 'Phương thức',
            dataIndex: 'paymentMethod',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            render: (val) => new Date(val).toLocaleString(),
        },
        {
            title: 'Hành động',
            width: 120,
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Button type="default" icon={<EyeOutlined />} onClick={() => handleView(record)} />
                    <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                </Space>
            ),
        },
    ]

    // modal actions
    const handleView = (record) => {
        setModalType('view')
        setSelected(record)
        setModalOpen(true)
    }

    const handleEdit = (record) => {
        setModalType('edit')
        setSelected(record)
        setModalOpen(true)
    }

    const handleUpdateStatus = async (status) => {
        if (!selected?._id) return
        try {
            await updateStatusOrder(selected._id, { status })
            toast.success('Cập nhật trạng thái đơn hàng thành công')
            setModalOpen(false)
            fetchOrders({ page: pagination.current, pageSize: pagination.pageSize })
        } catch (err) {
            console.error(err)
            toast.error('Lỗi khi cập nhật trạng thái đơn hàng')
        }
    }

    useEffect(() => {
        fetchOrders({ page: pagination.current, pageSize: pagination.pageSize })
    }, [pagination.current, pagination.pageSize])

    return (
        <div>
            <Button type="primary" icon={<FileExcelOutlined />} onClick={handleExportExcel}>
                Xuất Excel
            </Button>
            <Table
                columns={columns}
                dataSource={orders}
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
                title={modalType === 'view' ? 'Chi tiết đơn hàng' : 'Cập nhật trạng thái'}
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                footer={null}
                width={800}
            >
                {modalType === 'view' && selected && (
                    <Descriptions bordered column={2} size="middle">
                        <Descriptions.Item label="Khách hàng">
                            {selected.user?.name} ({selected.user?.email})
                        </Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">{selected.shippingAddress?.phone}</Descriptions.Item>

                        <Descriptions.Item label="Địa chỉ" span={2}>
                            {`${selected.shippingAddress?.street}, ${selected.shippingAddress?.ward}, ${selected.shippingAddress?.district}, ${selected.shippingAddress?.city}, ${selected.shippingAddress?.country}`}
                        </Descriptions.Item>

                        <Descriptions.Item label="Ghi chú">{selected.note || '-'}</Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            {statusMap[selected.status]?.text || selected.status}
                        </Descriptions.Item>

                        <Descriptions.Item label="Phương thức">{selected.paymentMethod}</Descriptions.Item>
                        <Descriptions.Item label="Tổng đơn">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                selected.totalOrder,
                            )}
                        </Descriptions.Item>

                        <Descriptions.Item label="Mã giảm giá">{selected.discountCode || '-'}</Descriptions.Item>
                        <Descriptions.Item label="Số tiền giảm">
                            {selected.discountValue
                                ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                      selected.discountValue,
                                  )
                                : '0 ₫'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Thành tiền">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                selected.totalAmount,
                            )}
                        </Descriptions.Item>
                    </Descriptions>
                )}

                {modalType === 'view' && (
                    <div style={{ marginTop: 16 }}>
                        <h4>Sản phẩm trong đơn</h4>
                        <Table
                            dataSource={selected?.orderItems || []}
                            rowKey="_id"
                            pagination={false}
                            size="small"
                            columns={[
                                { title: 'Tên sản phẩm', dataIndex: 'name' },
                                { title: 'Số lượng', dataIndex: 'quantity' },
                                {
                                    title: 'Đơn giá',
                                    dataIndex: 'price',
                                    render: (val) =>
                                        new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        }).format(val),
                                },
                            ]}
                        />
                    </div>
                )}

                {modalType === 'edit' && (
                    <div>
                        <p>
                            <b>Đơn hàng của:</b> {selected.user?.name}
                        </p>
                        <Select
                            defaultValue={selected.status}
                            style={{ width: 200 }}
                            onChange={(val) => handleUpdateStatus(val)}
                        >
                            {Object.entries(statusMap).map(([key, { text }]) => (
                                <Select.Option key={key} value={key}>
                                    {text}
                                </Select.Option>
                            ))}
                        </Select>
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default OrderPage
