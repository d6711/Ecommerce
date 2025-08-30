import { useEffect, useState } from 'react'
import {
    Button,
    Form,
    Input,
    Modal,
    Popconfirm,
    Space,
    Table,
    Tag,
    Select,
    InputNumber,
    DatePicker,
    Switch,
    Descriptions,
} from 'antd'
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useToast } from '@src/context/ToastContext'
import { getAllDiscounts, createDiscount, updateDiscount, deleteDiscount } from '@src/services/discountService'
import dayjs from 'dayjs'
import { exportToExcel } from '@src/utils/exportToExcel'

const { RangePicker } = DatePicker

const DiscountPage = () => {
    const [loading, setLoading] = useState(false)
    const [discounts, setDiscounts] = useState([])
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    })
    const [searchQuery, setSearchQuery] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [modalType, setModalType] = useState('add') // add | view | edit
    const [selected, setSelected] = useState(null)

    const toast = useToast()
    const [form] = Form.useForm()

    // fetch discounts
    const fetchDiscounts = async ({ page = 1, pageSize = 10, searchQuery = '' }) => {
        setLoading(true)
        try {
            const res = await getAllDiscounts({
                page,
                limit: pageSize,
                search: searchQuery.trim(),
            })
            setDiscounts(res.data?.metadata || [])
            setPagination((prev) => ({
                ...prev,
                current: page,
                pageSize: pageSize,
                total: res.data?.pagination.totalDocuments || 0,
            }))
        } catch (err) {
            console.error('Fetch discounts error:', err)
            toast.error('Lỗi khi tải mã giảm giá')
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
            title: 'Tên',
            dataIndex: 'name',
            ellipsis: true,
        },
        {
            title: 'Code',
            dataIndex: 'code',
            render: (code) => <Tag color="blue">{code}</Tag>,
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            render: (val) => (val === 'Percent' ? <Tag color="green">Percent</Tag> : <Tag color="orange">Fixed</Tag>),
        },
        {
            title: 'Giá trị',
            render: (record) =>
                record.type === 'Percent'
                    ? `${record.value}% (tối đa: ${record.maxValue?.toLocaleString() || 0} đ)`
                    : `${record.value?.toLocaleString()} đ`,
        },
        {
            title: 'Thời gian',
            render: (record) =>
                `${dayjs(record.startDate).format('DD/MM/YYYY')} - ${dayjs(record.endDate).format('DD/MM/YYYY')}`,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            align: 'center',
            render: (val) => <Tag color={val ? 'green' : 'red'}>{val ? 'Hoạt động' : 'Ẩn'}</Tag>,
        },
        {
            title: 'Hành động',
            width: 150,
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Button type="default" icon={<EyeOutlined />} onClick={() => handleView(record)} />
                    <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Popconfirm title="Xác nhận xoá?" onConfirm={() => handleDelete(record._id)}>
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ]

    // modal actions
    const handleAdd = () => {
        setModalType('add')
        setSelected(null)
        form.resetFields()
        setModalOpen(true)
    }

    const handleView = (record) => {
        setModalType('view')
        setSelected(record)
        setModalOpen(true)
    }

    const handleEdit = (record) => {
        setModalType('edit')
        setSelected(record)
        form.setFieldsValue({
            ...record,
            dateRange: [dayjs(record.startDate), dayjs(record.endDate)],
        })
        setModalOpen(true)
    }

    const handleDelete = async (id) => {
        await deleteDiscount(id)
        toast.success(`Đã xoá mã giảm giá`)
        fetchDiscounts({
            page: pagination.current,
            pageSize: pagination.pageSize,
            searchQuery,
        })
    }

    const handleSave = async () => {
        try {
            const values = await form.validateFields()

            if (values.dateRange && values.dateRange.length === 2) {
                values.startDate = values.dateRange[0]
                values.endDate = values.dateRange[1]
            }
            delete values.dateRange

            if (modalType === 'add') {
                await createDiscount(values)
                toast.success('Đã thêm mã giảm giá')
            } else if (modalType === 'edit' && selected?._id) {
                await updateDiscount(selected._id, values)
                toast.success('Đã cập nhật mã giảm giá')
            }

            setModalOpen(false)
            fetchDiscounts({
                page: pagination.current,
                pageSize: pagination.pageSize,
                searchQuery,
            })
        } catch (err) {
            console.error(err)
            toast.error('Có lỗi khi lưu mã giảm giá')
        }
    }

    useEffect(() => {
        fetchDiscounts({
            page: pagination.current,
            pageSize: pagination.pageSize,
            searchQuery,
        })
    }, [pagination.current, pagination.pageSize, searchQuery])
    const handleExportExcel = () => {
        const headers = [
            'STT',
            'Mã giảm giá',
            'Tên chương trình',
            'Loại giảm',
            'Giá trị giảm',
            'Giá trị tối thiểu',
            'Số lượng',
            'Đã dùng',
            'Ngày bắt đầu',
            'Ngày kết thúc',
            'Trạng thái',
        ]

        const data = discounts.map((item, index) => [
            index + 1,
            item.code,
            item.name,
            item.type === 'Percent' ? 'Phần trăm' : 'Số tiền',
            item.value,
            item.minOrderValue,
            item.quantity,
            item.used,
            new Date(item.startDate).toLocaleDateString(),
            new Date(item.endDate).toLocaleDateString(),
            item.isActive ? 'Đang hoạt động' : 'Ngừng',
        ])

        exportToExcel(
            [
                {
                    name: 'Danh sách mã giảm giá',
                    data: [headers, ...data],
                },
            ],
            'discounts.xlsx',
        )
    }

    return (
        <div>
            <Space style={{ marginBottom: 16 }}>
                <Input.Search placeholder="Tìm kiếm mã giảm giá" onSearch={(val) => setSearchQuery(val)} enterButton />
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Thêm mã giảm giá
                </Button>
                <Button onClick={handleExportExcel} type="primary">
                    Xuất Excel
                </Button>
            </Space>

            <Table
                columns={columns}
                dataSource={discounts}
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
                title={
                    modalType === 'add'
                        ? 'Thêm mã giảm giá'
                        : modalType === 'edit'
                        ? 'Chỉnh sửa mã giảm giá'
                        : 'Chi tiết mã giảm giá'
                }
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onOk={modalType === 'view' ? undefined : handleSave}
                okButtonProps={{ disabled: modalType === 'view' }}
                width={900}
            >
                {modalType === 'view' ? (
                    <Descriptions bordered column={2} size="middle">
                        <Descriptions.Item label="Tên">{selected?.name}</Descriptions.Item>
                        <Descriptions.Item label="Code">
                            <Tag color="blue">{selected?.code}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Mô tả">{selected?.description}</Descriptions.Item>
                        <Descriptions.Item label="Loại">{selected?.type}</Descriptions.Item>
                        <Descriptions.Item label="Giá trị">
                            {selected?.type === 'Percent'
                                ? `${selected?.value}% (Tối đa: ${selected?.maxValue} đ)`
                                : `${selected?.value} đ`}
                        </Descriptions.Item>
                        <Descriptions.Item label="Giá trị tối thiểu đơn hàng">
                            {selected?.minOrderValue}
                        </Descriptions.Item>
                        <Descriptions.Item label="Số lượng">{selected?.quantity}</Descriptions.Item>
                        <Descriptions.Item label="Đã dùng">{selected?.usedCount}</Descriptions.Item>
                        <Descriptions.Item label="Tối đa / Người">{selected?.maxUsePerUser}</Descriptions.Item>
                        <Descriptions.Item label="Áp dụng">{selected?.applyTo}</Descriptions.Item>
                        <Descriptions.Item label="Sản phẩm">{selected?.productId?.join(', ')}</Descriptions.Item>
                        <Descriptions.Item label="Danh mục">{selected?.categoryId?.join(', ')}</Descriptions.Item>
                        <Descriptions.Item label="Ngày áp dụng">
                            {dayjs(selected?.startDate).format('DD/MM/YYYY')} -{' '}
                            {dayjs(selected?.endDate).format('DD/MM/YYYY')}
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            {selected?.isActive ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Ẩn</Tag>}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày tạo">
                            {dayjs(selected?.createdAt).format('DD/MM/YYYY HH:mm')}
                        </Descriptions.Item>
                        <Descriptions.Item label="Cập nhật lần cuối">
                            {dayjs(selected?.updatedAt).format('DD/MM/YYYY HH:mm')}
                        </Descriptions.Item>
                    </Descriptions>
                ) : (
                    <Form form={form} layout="vertical">
                        <Form.Item label="Tên" name="name" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Mã Code" name="code" rules={[{ required: true }]}>
                            <Input style={{ textTransform: 'uppercase' }} />
                        </Form.Item>
                        <Form.Item label="Mô tả" name="description">
                            <Input.TextArea rows={3} />
                        </Form.Item>
                        <Form.Item label="Loại" name="type" rules={[{ required: true }]}>
                            <Select
                                options={[
                                    { value: 'Percent', label: 'Phần trăm' },
                                    { value: 'Fixed', label: 'Cố định' },
                                ]}
                            />
                        </Form.Item>
                        <Form.Item label="Giá trị" name="value" rules={[{ required: true, type: 'number', min: 0 }]}>
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                        {form.getFieldValue('type') === 'Percent' && (
                            <Form.Item label="Giá trị tối đa" name="maxValue" rules={[{ type: 'number', min: 0 }]}>
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        )}
                        <Form.Item label="Giá trị tối thiểu đơn hàng" name="minOrderValue">
                            <InputNumber style={{ width: '100%' }} min={0} />
                        </Form.Item>
                        <Form.Item label="Số lượng" name="quantity">
                            <InputNumber style={{ width: '100%' }} min={0} />
                        </Form.Item>
                        <Form.Item label="Tối đa / Người" name="maxUsePerUser">
                            <InputNumber style={{ width: '100%' }} min={0} />
                        </Form.Item>
                        <Form.Item
                            label="Khoảng thời gian"
                            name="dateRange"
                            rules={[{ required: true, message: 'Chọn thời gian' }]}
                        >
                            <RangePicker style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item label="Áp dụng" name="applyTo">
                            <Select
                                options={[
                                    { value: 'All', label: 'Tất cả' },
                                    { value: 'Product', label: 'Sản phẩm' },
                                    { value: 'Category', label: 'Danh mục' },
                                ]}
                            />
                        </Form.Item>
                        <Form.Item label="Sản phẩm" name="productId">
                            <Select mode="tags" placeholder="Nhập ID sản phẩm" />
                        </Form.Item>
                        <Form.Item label="Danh mục" name="categoryId">
                            <Select mode="tags" placeholder="Nhập ID danh mục" />
                        </Form.Item>
                        <Form.Item label="Trạng thái" name="isActive" valuePropName="checked">
                            <Switch checkedChildren="Hoạt động" unCheckedChildren="Ẩn" />
                        </Form.Item>
                    </Form>
                )}
            </Modal>
        </div>
    )
}

export default DiscountPage
