import React, { useEffect, useState } from 'react'
import { Table, Button, Space, Modal, Form, Input, Switch, Upload, Select, message } from 'antd'
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons'
import {
    getCategories,
    getCategoryParents,
    createCategory,
    updateCategory,
    deleteCategory,
} from '@src/services/categoryService'
import { uploadImage } from '@src/services/uploadService'

const { Search } = Input

const CategoryPage = () => {
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState([])
    const [categoryParents, setCategoryParents] = useState([])
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    })
    const [searchValue, setSearchValue] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [modalType, setModalType] = useState('add')
    const [currentRecord, setCurrentRecord] = useState(null)
    const [form] = Form.useForm()

    // Fetch categories với debounce để tránh call API liên tục
    const fetchData = async (page = 1, pageSize = 10, searchQuery = '') => {
        try {
            setLoading(true)
            const res = await getCategories({
                page,
                limit: pageSize,
                search: searchQuery.trim(),
            })
            setCategories(res.data?.metadata || [])
            setPagination((prev) => ({
                ...prev,
                current: page,
                pageSize: pageSize,
                total: res.data?.total || 0,
            }))
        } catch (err) {
            console.error('Fetch categories error:', err)
            message.error('Lỗi khi tải danh mục')
        } finally {
            setLoading(false)
        }
    }

    // Fetch category parents
    const fetchParents = async () => {
        try {
            const res = await getCategoryParents()
            setCategoryParents(res.data?.metadata || [])
        } catch (err) {
            console.error('Fetch parents error:', err)
            message.error('Không tải được danh mục cha')
        }
    }

    // Load data khi component mount
    useEffect(() => {
        fetchParents()
    }, [])

    // Load categories khi pagination hoặc search thay đổi
    useEffect(() => {
        fetchData(pagination.current, pagination.pageSize, searchValue)
    }, [pagination.current, pagination.pageSize, searchValue])

    // Handle pagination change
    const handleTableChange = (page, pageSize) => {
        setPagination((prev) => ({
            ...prev,
            current: page,
            pageSize: pageSize || prev.pageSize,
        }))
    }

    // Handle search
    const handleSearch = (value) => {
        setSearchValue(value)
        // Reset về trang đầu khi search
        setPagination((prev) => ({
            ...prev,
            current: 1,
        }))
    }

    // Handle modal open
    const handleOpenModal = (type, record = null) => {
        setModalType(type)
        setCurrentRecord(record)

        if (type === 'edit' || type === 'view') {
            form.setFieldsValue({
                ...record,
                parentId: record?.parentId?._id,
                isActive: record?.isActive ?? true,
                image: record?.image
                    ? [
                          {
                              uid: '-1',
                              name: 'image.png',
                              status: 'done',
                              url: record.image,
                          },
                      ]
                    : [],
            })
        } else {
            form.resetFields()
            // Set default values cho form add
            form.setFieldsValue({
                isActive: true,
                image: [],
            })
        }
        setModalOpen(true)
    }

    // Handle delete với confirm
    const handleDelete = (record) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc muốn xóa danh mục "${record.name}"?`,
            okText: 'Xóa',
            cancelText: 'Hủy',
            okType: 'danger',
            onOk: async () => {
                try {
                    await deleteCategory(record._id)
                    message.success('Xóa danh mục thành công')
                    // Reload current page
                    await fetchData(pagination.current, pagination.pageSize, searchValue)
                } catch (err) {
                    console.error('Delete error:', err)
                    message.error('Xóa thất bại')
                }
            },
        })
    }

    // Handle submit form
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields()

            // Xử lý upload ảnh
            let imageUrl = ''
            if (values.image && values.image.length > 0) {
                const file = values.image[0]

                if (file.originFileObj) {
                    // File mới được upload
                    const uploadRes = await uploadImage(file.originFileObj)
                    imageUrl = uploadRes.data?.imageUrl || uploadRes.imageUrl || ''
                } else if (file.url) {
                    // File đã tồn tại (khi edit)
                    imageUrl = file.url
                }
            }

            const submitData = {
                ...values,
                image: imageUrl,
            }

            // Xóa slug vì backend tự generate
            delete submitData.slug

            if (modalType === 'add') {
                await createCategory(submitData)
                message.success('Thêm danh mục thành công')
            } else if (modalType === 'edit') {
                await updateCategory(currentRecord._id, submitData)
                message.success('Cập nhật danh mục thành công')
            }

            setModalOpen(false)
            form.resetFields()

            // Reload data
            await fetchData(pagination.current, pagination.pageSize, searchValue)
        } catch (err) {
            console.error('Submit error:', err)
            if (err.errorFields) {
                message.error('Vui lòng kiểm tra lại thông tin')
            } else {
                message.error('Có lỗi xảy ra')
            }
        }
    }

    // Upload props
    const uploadProps = {
        beforeUpload: (file) => {
            const isImage = file.type.startsWith('image/')
            if (!isImage) {
                message.error('Chỉ được upload file ảnh!')
                return false
            }
            const isLt5M = file.size / 1024 / 1024 < 5
            if (!isLt5M) {
                message.error('Ảnh phải nhỏ hơn 5MB!')
                return false
            }
            return false // Prevent auto upload
        },
        maxCount: 1,
    }

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
            title: 'Ảnh',
            dataIndex: 'image',
            width: 80,
            align: 'center',
            render: (img) =>
                img ? (
                    <img
                        src={img}
                        alt=""
                        style={{
                            width: 50,
                            height: 50,
                            objectFit: 'cover',
                            borderRadius: 4,
                        }}
                    />
                ) : (
                    '-'
                ),
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            ellipsis: true,
            render: (text) => text || '-',
        },
        {
            title: 'Danh mục cha',
            dataIndex: 'parentId',
            ellipsis: true,
            render: (parent) => parent?.name || '-',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            width: 100,
            align: 'center',
            render: (val) => (
                <span
                    style={{
                        color: val ? '#52c41a' : '#ff4d4f',
                        fontWeight: 500,
                    }}
                >
                    {val ? 'Active' : 'Inactive'}
                </span>
            ),
        },
        {
            title: 'Hành động',
            width: 120,
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => handleOpenModal('view', record)}
                        title="Xem chi tiết"
                    />
                    <Button
                        size="small"
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleOpenModal('edit', record)}
                        title="Chỉnh sửa"
                    />
                    <Button
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record)}
                        title="Xóa"
                    />
                </Space>
            ),
        },
    ]

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal('add')} size="middle">
                    Thêm danh mục
                </Button>

                <Search
                    placeholder="Tìm kiếm theo tên..."
                    allowClear
                    style={{ width: 300 }}
                    onSearch={handleSearch}
                    onChange={(e) => {
                        if (!e.target.value) {
                            handleSearch('')
                        }
                    }}
                />
            </div>

            <Table
                rowKey="_id"
                columns={columns}
                dataSource={categories}
                loading={loading}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mục`,
                    onChange: handleTableChange,
                    onShowSizeChange: handleTableChange,
                }}
                scroll={{ x: 800 }}
            />

            <Modal
                open={modalOpen}
                title={
                    modalType === 'add'
                        ? 'Thêm danh mục mới'
                        : modalType === 'edit'
                        ? 'Chỉnh sửa danh mục'
                        : 'Chi tiết danh mục'
                }
                onCancel={() => {
                    setModalOpen(false)
                    form.resetFields()
                }}
                onOk={modalType !== 'view' ? handleSubmit : undefined}
                okText={modalType === 'add' ? 'Thêm' : 'Cập nhật'}
                cancelText="Hủy"
                width={600}
                footer={
                    modalType === 'view'
                        ? [
                              <Button key="close" onClick={() => setModalOpen(false)}>
                                  Đóng
                              </Button>,
                          ]
                        : undefined
                }
            >
                <Form form={form} layout="vertical" disabled={modalType === 'view'}>
                    <Form.Item
                        label="Tên danh mục"
                        name="name"
                        rules={[
                            { required: true, message: 'Vui lòng nhập tên danh mục' },
                            { min: 2, message: 'Tên phải có ít nhất 2 ký tự' },
                        ]}
                    >
                        <Input placeholder="Nhập tên danh mục" />
                    </Form.Item>

                    <Form.Item
                        label="Mô tả"
                        name="description"
                        rules={[{ max: 500, message: 'Mô tả không được quá 500 ký tự' }]}
                    >
                        <Input.TextArea
                            rows={3}
                            placeholder="Nhập mô tả danh mục (tùy chọn)"
                            showCount
                            maxLength={500}
                        />
                    </Form.Item>

                    <Form.Item label="Danh mục cha" name="parentId">
                        <Select
                            placeholder="Chọn danh mục cha (tùy chọn)"
                            allowClear
                            options={categoryParents
                                .filter((c) => modalType !== 'edit' || c._id !== currentRecord?._id)
                                .map((c) => ({
                                    value: c._id,
                                    label: c.name,
                                }))}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Ảnh danh mục"
                        name="image"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                    >
                        <Upload {...uploadProps} listType="picture-card">
                            <div>
                                <UploadOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        </Upload>
                    </Form.Item>

                    <Form.Item label="Trạng thái" name="isActive" valuePropName="checked">
                        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default CategoryPage
