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
    Switch,
    Upload,
    Image,
    Descriptions,
} from 'antd'
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, FileExcelOutlined } from '@ant-design/icons'
import { useToast } from '@src/context/ToastContext'
import { getNews, createNews, updateNews, deleteNews, getAllCatalogs } from '@src/services/newService'
import { uploadImage } from '@src/services/uploadService'
import { exportToExcel } from '@src/utils/exportToExcel'

const NewsPage = () => {
    const [loading, setLoading] = useState(false)
    const [newsList, setNewsList] = useState([])
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

    // fetch news
    const fetchNews = async ({ page = 1, pageSize = 10, searchQuery = '' }) => {
        setLoading(true)
        try {
            const res = await getNews({
                page,
                limit: pageSize,
                search: searchQuery.trim(),
            })
            setNewsList(res.data?.metadata || [])
            setPagination((prev) => ({
                ...prev,
                current: page,
                pageSize,
                total: res.data?.pagination.totalDocuments || 0,
            }))
        } catch (err) {
            console.error('Fetch news error:', err)
            toast.error('Lỗi khi tải tin tức')
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
        form.setFieldsValue({
            ...record,
            catalog: record.catalog?._id,
            tags: record.tags || [],
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
        await deleteNews(id)
        toast.success('Đã xoá tin tức')
        fetchNews({
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
                await createNews(values)
                toast.success('Đã thêm tin tức')
            } else if (modalType === 'edit' && selected?._id) {
                await updateNews(selected._id, values)
                toast.success('Đã cập nhật tin tức')
            }

            setModalOpen(false)
            fetchNews({
                page: pagination.current,
                pageSize: pagination.pageSize,
                searchQuery,
            })
        } catch (err) {
            console.error(err)
            toast.error('Có lỗi khi lưu tin tức')
        }
    }

    useEffect(() => {
        fetchNews({
            page: pagination.current,
            pageSize: pagination.pageSize,
            searchQuery,
        })
    }, [pagination.current, pagination.pageSize, searchQuery])

    useEffect(() => {
        if (modalOpen) {
            getAllCatalogs()
                .then((res) => setCatalogs(res.data.metadata || []))
                .catch((err) => console.error('Fetch catalogs error:', err))
        }
    }, [modalOpen])

    // columns
    const columns = [
        {
            title: 'STT',
            width: 60,
            align: 'center',
            render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            ellipsis: true,
        },
        {
            title: 'Slug',
            dataIndex: 'slug',
            width: 180,
            ellipsis: true,
        },
        {
            title: 'Danh mục',
            dataIndex: 'catalog',
            width: 150,
            render: (val) => (val ? val.name : '-'),
        },
        {
            title: 'Ảnh',
            dataIndex: 'image',
            width: 100,
            align: 'center',
            render: (img) =>
                img ? <Image src={img} width={60} height={60} style={{ objectFit: 'cover', borderRadius: 6 }} /> : '-',
        },
        // {
        //     title: 'Tags',
        //     dataIndex: 'tags',
        //     render: (tags) =>
        //         tags?.length > 0 ? (
        //             <>
        //                 {tags.map((tag, i) => (
        //                     <Tag key={i} color="blue">
        //                         {tag}
        //                     </Tag>
        //                 ))}
        //             </>
        //         ) : (
        //             '-'
        //         ),
        // },
        {
            title: 'Ngày xuất bản',
            dataIndex: 'publishedAt',
            width: 160,
            render: (val) => (val ? new Date(val).toLocaleDateString('vi-VN') : ''),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            width: 120,
            align: 'center',
            render: (val) => (val ? <Tag color="green">Hiển thị</Tag> : <Tag color="red">Ẩn</Tag>),
        },
        {
            title: 'Lượt xem',
            dataIndex: 'views',
            width: 100,
            align: 'center',
        },
        {
            title: 'Hành động',
            width: 160,
            fixed: 'right',
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Button
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => {
                            setSelected(record)
                            setModalType('view')
                            setModalOpen(true)
                        }}
                    />
                    <Button
                        size="small"
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)} // ✅ gọi hàm handleEdit
                    />

                    <Popconfirm title="Bạn có chắc muốn xóa tin tức này?" onConfirm={() => handleDelete(record._id)}>
                        <Button size="small" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ]
    const handleExportExcel = () => {
        const sheetData = newsList.map((item, index) => ({
            STT: index + 1,
            Tiêu_đề: item.title,
            Slug: item.slug,
            Nội_dung: item.content,
            Danh_mục: item.catalog?.name || '',
            Ngày_xuất_bản: item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('vi-VN') : '',
            Trạng_thái: item.isActive ? 'Hiển thị' : 'Ẩn',
            Lượt_xem: item.views,
            Tags: item.tags?.join(', ') || '',
        }))

        exportToExcel(
            [
                {
                    name: 'TinTuc',
                    data: sheetData,
                },
            ],
            'danh_sach_tin_tuc.xlsx',
        )
    }

    return (
        <div>
            <Space style={{ marginBottom: 16 }}>
                <Input.Search placeholder="Tìm kiếm tin tức" onSearch={(val) => setSearchQuery(val)} enterButton />
                <Button type="primary" onClick={handleAdd}>
                    + Thêm tin tức
                </Button>
                <Button icon={<FileExcelOutlined />} onClick={handleExportExcel}>
                    Xuất Excel
                </Button>
            </Space>
            <Table
                columns={columns}
                dataSource={newsList}
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
                        ? 'Thêm tin tức'
                        : modalType === 'edit'
                        ? 'Chỉnh sửa tin tức'
                        : 'Chi tiết tin tức'
                }
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onOk={modalType === 'view' ? undefined : handleSave}
                okButtonProps={{ disabled: modalType === 'view' }}
                width={800}
            >
                {modalType === 'view' ? (
                    <Descriptions bordered column={2} size="middle">
                        <Descriptions.Item label="Tiêu đề">{selected?.title}</Descriptions.Item>
                        <Descriptions.Item label="Slug">{selected?.slug}</Descriptions.Item>

                        <Descriptions.Item label="Tóm tắt" span={2}>
                            {selected?.summary}
                        </Descriptions.Item>

                        <Descriptions.Item label="Ảnh minh họa" span={2}>
                            {selected?.image && (
                                <Image
                                    src={selected?.image}
                                    width={150}
                                    height={150}
                                    style={{ objectFit: 'cover', borderRadius: 6 }}
                                />
                            )}
                        </Descriptions.Item>

                        <Descriptions.Item label="Danh mục">{selected?.catalog?.name}</Descriptions.Item>
                        <Descriptions.Item label="Tác giả">{selected?.author?.name}</Descriptions.Item>

                        <Descriptions.Item label="Trạng thái">
                            {selected?.isActive ? 'Đang hiển thị' : 'Ẩn'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày xuất bản">
                            {selected?.publishedAt ? new Date(selected?.publishedAt).toLocaleString('vi-VN') : ''}
                        </Descriptions.Item>

                        <Descriptions.Item label="Lượt xem">{selected?.views}</Descriptions.Item>

                        <Descriptions.Item label="Tags" span={2}>
                            {selected?.tags?.length > 0 ? selected.tags.join(', ') : 'Không có'}
                        </Descriptions.Item>

                        <Descriptions.Item label="Nội dung" span={2}>
                            <div
                                style={{ whiteSpace: 'pre-wrap' }}
                                dangerouslySetInnerHTML={{ __html: selected?.content }}
                            />
                        </Descriptions.Item>
                    </Descriptions>
                ) : (
                    <Form form={form} layout="vertical">
                        <Form.Item label="Tiêu đề" name="title" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>

                        <Form.Item label="Tóm tắt" name="summary">
                            <Input.TextArea rows={3} />
                        </Form.Item>
                        <Form.Item label="Nội dung" name="content">
                            <Input.TextArea rows={6} />
                        </Form.Item>
                        <Form.Item
                            label="Danh mục"
                            name="catalog"
                            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
                        >
                            <Select allowClear placeholder="Chọn danh mục" optionFilterProp="children" showSearch>
                                {catalogs.map((cat) => (
                                    <Select.Option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item label="Tags" name="tags">
                            <Select mode="tags" placeholder="Nhập tags" />
                        </Form.Item>
                        <Form.Item
                            label="Ảnh"
                            name="image"
                            valuePropName="fileList"
                            getValueFromEvent={(e) => e && e.fileList}
                        >
                            <Upload listType="picture-card" beforeUpload={() => false} maxCount={1}>
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            </Upload>
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

export default NewsPage
