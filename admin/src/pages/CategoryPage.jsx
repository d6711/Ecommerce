import { useEffect, useState } from 'react'
import {
    Button,
    Form,
    Input,
    Modal,
    Popconfirm,
    Space,
    Table,
    Upload,
    Tag,
    Select,
    Switch,
    Image,
    Descriptions,
} from 'antd'
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, FileExcelOutlined } from '@ant-design/icons'
import { useToast } from '@src/context/ToastContext'
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryParents,
} from '@src/services/categoryService'
import { uploadImage } from '@src/services/uploadService'
import { exportToExcel } from '@src/utils/exportToExcel'

const CategoryPage = () => {
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState([])
    const [parentCategories, setParentCategories] = useState([])
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    })
    const [searchQuery, setSearchQuery] = useState('')

    // modal
    const [modalOpen, setModalOpen] = useState(false)
    const [modalType, setModalType] = useState('add') // add | view | edit
    const [selected, setSelected] = useState(null)

    const toast = useToast()
    const [form] = Form.useForm()

    // fetch categories
    const fetchCategories = async ({ page = 1, pageSize = 10, searchQuery = '' }) => {
        setLoading(true)
        try {
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
                total: res.data?.pagination.totalDocuments || 0,
            }))
        } catch (err) {
            console.error('Fetch categories error:', err)
            toast.error('Lỗi khi tải danh mục')
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
            title: 'Tên',
            dataIndex: 'name',
            ellipsis: true,
        },

        {
            title: 'Mô tả',
            dataIndex: 'description',
            ellipsis: true,
        },
        {
            title: 'Danh mục cha',
            dataIndex: 'parentId',
            ellipsis: true,
            render: (parent) => parent?.name || 'Không có',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            width: 100,
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

    // ✅ xuất excel tất cả categories
    const handleExportExcel = async () => {
        try {
            const res = await getCategories({ page: 1, limit: 10000, search: searchQuery })
            const allCategories = res.data?.metadata || []

            const headers = ['STT', 'Tên danh mục', 'Slug', 'Mô tả', 'Danh mục cha', 'Trạng thái', 'Ngày tạo']

            const data = allCategories.map((item, index) => [
                index + 1,
                item.name,
                item.slug,
                item.description,
                item.parentId?.name || '-',
                item.isActive ? 'Hoạt động' : 'Ẩn',
                new Date(item.createdAt).toLocaleString(),
            ])

            exportToExcel([{ name: 'DanhMuc', data: [headers, ...data] }], 'DanhSachDanhMuc.xlsx')

            toast.success('Xuất Excel thành công')
        } catch (err) {
            console.error('Export excel error:', err)
            toast.error('Lỗi khi xuất Excel')
        }
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
        form.setFieldsValue({
            ...record,
            parentId: record.parentId?._id,
            image: record.image
                ? [
                      {
                          uid: '-1',
                          name: 'image.jpg',
                          status: 'done',
                          url: record.image,
                      },
                  ]
                : [],
        })
        setModalOpen(true)
    }

    const handleDelete = async (id) => {
        await deleteCategory(id)
        toast.success(`Đã xoá danh mục`)
        fetchCategories({
            page: pagination.current,
            pageSize: pagination.pageSize,
            searchQuery,
        })
    }

    const handleSave = async () => {
        try {
            const values = await form.validateFields()

            // xử lý ảnh (1 ảnh duy nhất)
            if (values.image && values.image.length > 0) {
                const file = values.image[0]
                if (file.originFileObj) {
                    const uploadedUrl = await uploadImage(file.originFileObj)
                    values.image = uploadedUrl
                } else {
                    values.image = file.url
                }
            } else {
                values.image = ''
            }

            if (modalType === 'add') {
                await createCategory(values)
                toast.success('Đã thêm danh mục')
            } else if (modalType === 'edit' && selected?._id) {
                await updateCategory(selected._id, values)
                toast.success('Đã cập nhật danh mục')
            }

            setModalOpen(false)
            fetchCategories({
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
        fetchCategories({
            page: pagination.current,
            pageSize: pagination.pageSize,
            searchQuery,
        })
    }, [pagination.current, pagination.pageSize, searchQuery])

    useEffect(() => {
        if (modalOpen) {
            getCategoryParents() // gọi API lấy danh mục cha
                .then((res) => setParentCategories(res.data.metadata || []))
                .catch((err) => console.error('Fetch parent categories error:', err))
        }
    }, [modalOpen])

    return (
        <div>
            <Space style={{ marginBottom: 16 }}>
                <Input.Search placeholder="Tìm kiếm danh mục" onSearch={(val) => setSearchQuery(val)} enterButton />
                <Button type="primary" onClick={handleAdd}>
                    + Thêm danh mục
                </Button>
                <Button icon={<FileExcelOutlined />} onClick={handleExportExcel}>
                    Xuất Excel
                </Button>
            </Space>

            <Table
                columns={columns}
                dataSource={categories}
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
                        ? 'Thêm danh mục'
                        : modalType === 'edit'
                        ? 'Chỉnh sửa danh mục'
                        : 'Chi tiết danh mục'
                }
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onOk={modalType === 'view' ? undefined : handleSave}
                okButtonProps={{ disabled: modalType === 'view' }}
                width={800}
            >
                {modalType === 'view' ? (
                    <Descriptions title="Chi tiết danh mục" bordered column={1} size="middle">
                        <Descriptions.Item label="Tên">{selected?.name}</Descriptions.Item>
                        <Descriptions.Item label="Slug">{selected?.slug}</Descriptions.Item>
                        <Descriptions.Item label="Mô tả">{selected?.description}</Descriptions.Item>
                        <Descriptions.Item label="Danh mục cha">{selected?.parentId?.name || '-'}</Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            {selected?.isActive ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Ẩn</Tag>}
                        </Descriptions.Item>
                        {selected?.image && (
                            <Descriptions.Item label="Hình ảnh">
                                <Image src={selected.image} width={100} />
                            </Descriptions.Item>
                        )}
                    </Descriptions>
                ) : (
                    <Form form={form} layout="vertical">
                        <Form.Item label="Tên danh mục" name="name" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Slug" name="slug" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Mô tả" name="description">
                            <Input.TextArea rows={3} />
                        </Form.Item>
                        <Form.Item label="Danh mục cha" name="parentId">
                            <Select allowClear placeholder="Chọn danh mục cha">
                                {parentCategories.map((cat) => (
                                    <Select.Option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Ảnh"
                            name="image"
                            valuePropName="fileList"
                            getValueFromEvent={(e) => e && e.fileList}
                        >
                            <Upload
                                listType="picture-card"
                                beforeUpload={() => false} // không auto upload
                                maxCount={1}
                            >
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            </Upload>
                        </Form.Item>
                        <Form.Item label="Trạng thái" name="status" valuePropName="checked">
                            <Switch checkedChildren="Hoạt động" unCheckedChildren="Ẩn" />
                        </Form.Item>
                    </Form>
                )}
            </Modal>
        </div>
    )
}

export default CategoryPage
