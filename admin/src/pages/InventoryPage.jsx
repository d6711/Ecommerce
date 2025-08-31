import { useEffect, useState } from 'react'
import { Button, Form, InputNumber, Modal, Space, Table, Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useToast } from '@src/context/ToastContext'
import { getProducts, updateProduct } from '@src/services/productService'
import { exportToExcel } from '@src/utils/exportToExcel'

const InventoryPage = () => {
    const [loading, setLoading] = useState(false)
    const [products, setProducts] = useState([])
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    })
    const [modalOpen, setModalOpen] = useState(false)
    const [selected, setSelected] = useState(null)
    const [form] = Form.useForm()
    const toast = useToast()

    // fetch products
    const fetchProducts = async ({ page = 1, pageSize = 10, searchQuery = '' }) => {
        setLoading(true)
        try {
            const res = await getProducts({ page, limit: pageSize, search: searchQuery.trim() })
            setProducts(res.data?.metadata || [])
            setPagination((prev) => ({
                ...prev,
                current: page,
                pageSize,
                total: res.data?.pagination?.totalDocuments || 0,
            }))
        } catch (err) {
            console.error(err)
            toast.error('Lỗi khi tải sản phẩm')
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

    const columns = [
        {
            title: 'STT',
            width: 60,
            align: 'center',
            render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
        },
        {
            title: 'Số lượng tồn',
            dataIndex: 'stock',
            align: 'center',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            align: 'center',
            render: (val) => <Tag color={val ? 'green' : 'red'}>{val ? 'Đang bán' : 'Tạm dừng'}</Tag>,
        },
        {
            title: 'Hành động',
            width: 120,
            align: 'center',
            render: (_, record) => (
                <Button type="primary" icon={<PlusOutlined />} onClick={() => handleImport(record)}>
                    Nhập hàng
                </Button>
            ),
        },
    ]

    const handleImport = (record) => {
        setSelected(record)
        form.resetFields()
        setModalOpen(true)
    }

    const handleSave = async () => {
        try {
            const values = await form.validateFields()
            const newStock = (selected?.stock || 0) + values.importQuantity

            await updateProduct(selected._id, { stock: newStock })
            toast.success(`Đã nhập thêm ${values.importQuantity} sản phẩm`)

            setModalOpen(false)
            fetchProducts({
                page: pagination.current,
                pageSize: pagination.pageSize,
            })
        } catch (err) {
            console.error(err)
            toast.error('Lỗi khi nhập hàng')
        }
    }

    const handleExportExcel = async () => {
        try {
            const res = await getProducts({ page: 1, limit: 10000, search: '' })
            const allProducts = res.data?.metadata || []

            const headers = ['STT', 'Tên sản phẩm', 'Số lượng tồn', 'Trạng thái']
            const data = allProducts.map((item, index) => [
                index + 1,
                item.name,
                item.stock,
                item.isActive ? 'Đang bán' : 'Tạm dừng',
            ])

            exportToExcel([{ name: 'TonKho', data: [headers, ...data] }], 'TonKho.xlsx')

            toast.success('Xuất Excel thành công')
        } catch (err) {
            console.error(err)
            toast.error('Lỗi khi xuất Excel')
        }
    }

    useEffect(() => {
        fetchProducts({
            page: pagination.current,
            pageSize: pagination.pageSize,
        })
    }, [pagination.current, pagination.pageSize])

    return (
        <div>
            <Space style={{ marginBottom: 16 }}>
                <Button onClick={handleExportExcel}>Xuất Excel</Button>
            </Space>

            <Table
                columns={columns}
                dataSource={products}
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
                title={`Nhập hàng - ${selected?.name || ''}`}
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onOk={handleSave}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Số lượng nhập thêm"
                        name="importQuantity"
                        rules={[{ required: true, message: 'Nhập số lượng' }]}
                    >
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default InventoryPage
