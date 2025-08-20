import { useEffect, useState } from 'react'
import { Button, Form, Input, Modal, Popconfirm, Space, Table, Tag, Switch } from 'antd'
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useToast } from '@src/context/ToastContext'
import { getCatalogs, createCatalog, updateCatalog, deleteCatalog } from '@src/services/newService'

const NewsCatalogPage = () => {
    const [loading, setLoading] = useState(false)
    const [catalogs, setCatalogs] = useState([])
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

    // fetch catalogs
    const fetchCatalogs = async ({ page = 1, pageSize = 10, searchQuery = '' }) => {
        setLoading(true)
        try {
            const res = await getCatalogs({
                page,
                limit: pageSize,
                search: searchQuery.trim(),
            })
            setCatalogs(res.data?.metadata || [])
            setPagination((prev) => ({
                ...prev,
                current: page,
                pageSize,
                total: res.data?.pagination.totalDocuments || 0,
            }))
        } catch (err) {
            console.error('Fetch catalogs error:', err)
            toast.error('Lỗi khi tải danh mục tin tức')
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
        form.setFieldsValue(record)
        setModalOpen(true)
    }

    const handleDelete = async (id) => {
        await deleteCatalog(id)
        toast.success('Đã xoá danh mục tin tức')
        fetchCatalogs({
            page: pagination.current,
            pageSize: pagination.pageSize,
            searchQuery,
        })
    }

    const handleSave = async () => {
        try {
            const values = await form.validateFields()

            if (modalType === 'add') {
                await createCatalog(values)
                toast.success('Đã thêm danh mục tin tức')
            } else if (modalType === 'edit' && selected?._id) {
                await updateCatalog(selected._id, values)
                toast.success('Đã cập nhật danh mục tin tức')
            }

            setModalOpen(false)
            fetchCatalogs({
                page: pagination.current,
                pageSize: pagination.pageSize,
                searchQuery,
            })
        } catch (err) {
            console.error(err)
            toast.error('Có lỗi khi lưu danh mục')
        }
    }

    useEffect(() => {
        fetchCatalogs({
            page: pagination.current,
            pageSize: pagination.pageSize,
            searchQuery,
        })
    }, [pagination.current, pagination.pageSize, searchQuery])

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
            title: 'Slug',
            dataIndex: 'slug',
            ellipsis: true,
        },
        {
            title: 'Thứ tự',
            dataIndex: 'order',
            width: 100,
            align: 'center',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            width: 120,
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

    return (
        <div>
            <Space style={{ marginBottom: 16 }}>
                <Input.Search
                    placeholder="Tìm kiếm danh mục tin tức"
                    onSearch={(val) => setSearchQuery(val)}
                    enterButton
                />
                <Button type="primary" onClick={handleAdd}>
                    + Thêm danh mục
                </Button>
            </Space>

            <Table
                columns={columns}
                dataSource={catalogs}
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
                        ? 'Thêm danh mục tin tức'
                        : modalType === 'edit'
                        ? 'Chỉnh sửa danh mục tin tức'
                        : 'Chi tiết danh mục tin tức'
                }
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onOk={modalType === 'view' ? undefined : handleSave}
                okButtonProps={{ disabled: modalType === 'view' }}
                width={600}
            >
                {modalType === 'view' ? (
                    <div>
                        <p>
                            <b>Tên:</b> {selected?.name}
                        </p>
                        <p>
                            <b>Thứ tự:</b> {selected?.order}
                        </p>
                        <p>
                            <b>Slug:</b> {selected?.slug}
                        </p>
                        <p>
                            <b>Trạng thái:</b> {selected?.isActive ? 'Hoạt động' : 'Ẩn'}
                        </p>
                    </div>
                ) : (
                    <Form form={form} layout="vertical">
                        <Form.Item label="Tên danh mục" name="name" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Thứ tự" name="order" initialValue={0}>
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item label="Trạng thái" name="isActive" valuePropName="checked" initialValue={true}>
                            <Switch checkedChildren="Hoạt động" unCheckedChildren="Ẩn" />
                        </Form.Item>
                    </Form>
                )}
            </Modal>
        </div>
    )
}

export default NewsCatalogPage
