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
    Descriptions,
    Image,
    Row,
    Col,
    Select,
    Switch,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useToast } from '@src/context/ToastContext'
import { getProducts, createProduct, updateProduct, deleteProduct } from '@src/services/productService'
import { uploadMultipleFiles } from '@src/services/uploadService'
import { getCategoryChild } from '@src/services/categoryService'
import { BRANDS } from '@src/utils/constants'
import { exportToExcel } from '@src/utils/exportToExcel'
import { usePermission } from '@src/context/PermissionContext'

const ProductPage = () => {
    const [loading, setLoading] = useState(false)
    const [products, setProducts] = useState([])
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
    const { canAccess, roleName } = usePermission()
    const [form] = Form.useForm()

    const [categories, setCategories] = useState([])

    // fetch products
    const fetchProducts = async ({ page = 1, pageSize = 10, searchQuery = '' }) => {
        setLoading(true)
        try {
            const res = await getProducts({
                page,
                limit: pageSize,
                search: searchQuery.trim(),
            })
            setProducts(res.data?.metadata || [])
            setPagination((prev) => ({
                ...prev,
                current: page,
                pageSize: pageSize,
                total: res.data?.pagination.totalDocuments || 0,
            }))
        } catch (err) {
            console.error('Fetch products error:', err)
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
            title: 'Ảnh',
            dataIndex: 'images',
            width: 80,
            align: 'center',
            render: (imgs) =>
                imgs?.length ? (
                    <img
                        src={imgs[0]}
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
            title: 'Giá tiền',
            dataIndex: 'price',
            ellipsis: true,
            render: (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value),
        },
        {
            title: 'Số lượng',
            dataIndex: 'stock',
            ellipsis: true,
        },
        {
            title: 'Danh mục sản phẩm',
            dataIndex: 'categoryId',
            ellipsis: true,
            render: (cat) => cat?.name || '-',
        },

        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            width: 100,
            align: 'center',
            render: (val) => <Tag color={val ? 'green' : 'red'}>{val ? 'Đang bán' : 'Đang tạm ngưng'}</Tag>,
        },

        {
            title: 'Hành động',
            width: 150,
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Button type="default" icon={<EyeOutlined />} onClick={() => handleView(record)} />
                    {canAccess('update:any', 'product') && (
                        <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    )}
                    {canAccess('delete:any', 'product') && (
                        <Popconfirm title="Xác nhận xoá?" onConfirm={() => handleDelete(record._id)}>
                            <Button danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ]

    const handleExportExcel = async () => {
        try {
            // gọi tất cả sản phẩm (limit lớn hoặc API hỗ trợ lấy all)
            const res = await getProducts({ page: 1, limit: 10000, search: '' })
            const allProducts = res.data?.metadata || []

            const headers = [
                'STT',
                'Tên sản phẩm',
                'Giá',
                'Số lượng',
                'Danh mục',
                'Thương hiệu',
                'Trạng thái',
                'Nổi bật',
                'Đã bán',
                'Tags',
                'Ngày tạo',
            ]

            const data = allProducts.map((item, index) => [
                index + 1,
                item.name,
                item.price,
                item.stock,
                item.categoryId?.name || '',
                item.brand,
                item.isActive ? 'Đang bán' : 'Tạm dừng',
                item.isFeatured ? 'Có' : 'Không',
                item.soldCount,
                item.tags?.join(', ') || '',
                new Date(item.createdAt).toLocaleString(),
            ])

            exportToExcel(
                [
                    {
                        name: 'DanhSachSanPham',
                        data: [headers, ...data],
                    },
                ],
                'DanhSachSanPham.xlsx',
            )

            toast.success('Xuất Excel thành công')
        } catch (error) {
            console.error('Export excel error:', error)
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
            categoryId: record.categoryId?._id,
            images: record.images?.map((url, idx) => ({
                uid: idx,
                name: `image-${idx}.jpg`,
                status: 'done',
                url,
            })),
        })
        setModalOpen(true)
    }

    const handleDelete = async (id) => {
        await deleteProduct(id)
        toast.success(`Đã xoá sản phẩm`)
        fetchProducts({
            page: pagination.current,
            pageSize: pagination.pageSize,
            searchQuery,
        })
    }

    const handleSave = async () => {
        try {
            const values = await form.validateFields()

            // xử lý ảnh
            if (values.images && values.images.length > 0) {
                const filesToUpload = values.images
                    .filter((f) => f.originFileObj) // chỉ file mới
                    .map((f) => f.originFileObj)

                let uploadedUrls = []
                if (filesToUpload.length > 0) {
                    uploadedUrls = await uploadMultipleFiles(filesToUpload)
                }

                // giữ lại ảnh cũ + merge ảnh mới
                const existingUrls = values.images.filter((f) => f.url).map((f) => f.url)
                values.images = [...existingUrls, ...uploadedUrls]
            } else {
                values.images = []
            }

            if (modalType === 'add') {
                await createProduct(values)
                toast.success('Đã thêm sản phẩm')
            } else if (modalType === 'edit' && selected?._id) {
                await updateProduct(selected._id, values)
                toast.success('Đã cập nhật sản phẩm')
            }

            setModalOpen(false)
            fetchProducts({
                page: pagination.current,
                pageSize: pagination.pageSize,
                searchQuery,
            })
        } catch (err) {
            console.error(err)
            toast.error('Có lỗi khi lưu sản phẩm')
        }
    }

    useEffect(() => {
        fetchProducts({
            page: pagination.current,
            pageSize: pagination.pageSize,
            searchQuery,
        })
    }, [pagination.current, pagination.pageSize, searchQuery])

    useEffect(() => {
        if (modalOpen) {
            getCategoryChild()
                .then((res) => setCategories(res.data.metadata || []))
                .catch((err) => console.error('Fetch categories error:', err))
        }
    }, [modalOpen])

    return (
        <div>
            <Space style={{ marginBottom: 16 }}>
                <Input.Search placeholder="Tìm kiếm sản phẩm" onSearch={(val) => setSearchQuery(val)} enterButton />

                {canAccess('create:any', 'product') && (
                    <Button type="primary" onClick={handleAdd}>
                        + Thêm sản phẩm
                    </Button>
                )}
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
                title={
                    modalType === 'add'
                        ? 'Thêm sản phẩm'
                        : modalType === 'edit'
                        ? 'Chỉnh sửa sản phẩm'
                        : 'Chi tiết sản phẩm'
                }
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onOk={modalType === 'view' ? undefined : handleSave}
                okButtonProps={{ disabled: modalType === 'view' }}
                width={1000}
            >
                {modalType === 'view' ? (
                    <Descriptions bordered column={2} size="middle">
                        <Descriptions.Item label="Tên sản phẩm">{selected?.name}</Descriptions.Item>
                        <Descriptions.Item label="Số lượng trong kho">{selected?.stock}</Descriptions.Item>
                        <Descriptions.Item label="Ảnh">
                            <Space wrap>
                                {selected?.images?.map((img, i) => (
                                    <Image
                                        key={i}
                                        src={img}
                                        width={80}
                                        height={80}
                                        style={{ objectFit: 'cover', borderRadius: 6 }}
                                    />
                                ))}
                            </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="Danh mục sản phẩm">{selected?.categoryId?.name}</Descriptions.Item>
                        <Descriptions.Item label="Mô tả">{selected?.description}</Descriptions.Item>
                        <Descriptions.Item label="Số sao trung bình">{selected?.ratingAvg}</Descriptions.Item>
                        <Descriptions.Item label="Thông số kỹ thuật">{selected?.specification}</Descriptions.Item>
                        <Descriptions.Item label="Số lượt đánh giá">{selected?.ratingCount}</Descriptions.Item>
                        <Descriptions.Item label="Tags">{selected?.tags.join(', ')}</Descriptions.Item>
                        <Descriptions.Item label="Thương hiệu">{selected?.brand}</Descriptions.Item>

                        <Descriptions.Item label="Giá">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                selected?.price,
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Sản phẩm nổi bật">
                            {selected?.isFeatured ? 'Có' : 'Không'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Số lượng đã bán">{selected?.soldCount}</Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            {selected?.isActive ? 'Đang bán' : 'Đang tạm dừng'}
                        </Descriptions.Item>
                    </Descriptions>
                ) : (
                    <Form form={form} layout="vertical">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Giá" name="price" rules={[{ required: true }]}>
                                    <Input type="number" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Thương hiệu" name="brand" rules={[{ required: true }]}>
                                    <Select placeholder="Chọn thương hiệu">
                                        {BRANDS.map((brand) => (
                                            <Select.Option key={brand.id} value={brand.name}>
                                                {brand.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Danh mục sản phẩm" name="categoryId" rules={[{ required: true }]}>
                                    <Select placeholder="Chọn danh mục">
                                        {categories.map((cat) => (
                                            <Select.Option key={cat._id} value={cat._id}>
                                                {cat.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item label="Mô tả" name="description">
                                    <Input.TextArea rows={3} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item label="Thông số kỹ thuật" name="specification">
                                    <Input.TextArea rows={3} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item label="Tags" name="tags">
                                    <Select mode="tags" placeholder="Nhập hoặc chọn tag" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={4}>
                                <Form.Item label="Sản phẩm nổi bật" name="isFeatured" valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="Trạng thái" name="isActive" valuePropName="checked">
                                    <Switch checkedChildren="Đang bán" unCheckedChildren="Tạm dừng" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    label="Ảnh sản phẩm"
                                    name="images"
                                    valuePropName="fileList"
                                    getValueFromEvent={(e) => e && e.fileList}
                                >
                                    <Upload
                                        listType="picture-card"
                                        beforeUpload={() => false} // không auto upload
                                        multiple
                                    >
                                        <div>
                                            <PlusOutlined />
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                    </Upload>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                )}
            </Modal>
        </div>
    )
}

export default ProductPage
