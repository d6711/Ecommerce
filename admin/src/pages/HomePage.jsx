import React, { useEffect, useState } from 'react'
import { Card, Col, Row, Statistic, Table, Tag, List, Avatar, Spin, Button } from 'antd'
import { ShoppingCartOutlined, UserOutlined, DatabaseOutlined, DollarOutlined } from '@ant-design/icons'
import { getOrders } from '@src/services/orderService'
import { getProductBestSellers } from '@src/services/productService'
import { getDashboard } from '@src/services/dashboardService'
import { statusMap } from '@src/pages/OrderPage'
import { exportToExcel } from '@src/utils/exportToExcel'

const HomePage = () => {
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState(null)
    const [orders, setOrders] = useState([])
    const [bestSellers, setBestSellers] = useState([])

    const exportReport = () => {
        const sheets = [
            {
                name: 'Thống kê',
                data: [
                    ['Chỉ số', 'Giá trị'],
                    ['Tổng Doanh Thu', stats?.revenue || 0],
                    ['Tổng Đơn Hàng', stats?.orders || 0],
                    ['Tổng Người Dùng', stats?.users || 0],
                    ['Tổng Sản Phẩm', stats?.products || 0],
                ],
            },
            {
                name: 'Đơn hàng',
                data: [
                    ['Mã ĐH', 'Khách hàng', 'Ngày', 'Tổng tiền', 'Trạng thái'],
                    ...orders.map((o) => [
                        o._id,
                        o.user?.name || 'N/A',
                        new Date(o.createdAt).toLocaleString(),
                        o.totalAmount,
                        o.status,
                    ]),
                ],
            },
            {
                name: 'Sản phẩm bán chạy',
                data: [['Tên sản phẩm', 'Đã bán', 'Giá'], ...bestSellers.map((p) => [p.name, p.soldCount, p.price])],
            },
        ]
        exportToExcel(sheets, 'BaoCaoDashboard.xlsx')
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const [statsRes, ordersRes, productsRes] = await Promise.all([
                    getDashboard(),
                    getOrders({ page: 1, limit: 5 }),
                    getProductBestSellers(3),
                ])

                setStats(statsRes.data.metadata)
                setOrders(ordersRes.data.metadata || ordersRes.data)
                setBestSellers(productsRes.data.metadata)
            } catch (error) {
                console.error('Lỗi load dashboard:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const orderColumns = [
        { title: 'Mã ĐH', dataIndex: '_id' },
        { title: 'Khách hàng', dataIndex: 'user', render: (user) => `${user?.name}` },
        { title: 'Ngày', dataIndex: 'createdAt', render: (val) => new Date(val).toLocaleString() },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalAmount',
            render: (value) => value.toLocaleString() + ' ₫',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status) => {
                const { text, color } = statusMap[status] || { text: status, color: 'default' }
                return <Tag color={color}>{text}</Tag>
            },
        },
    ]

    if (loading) {
        return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }} />
    }

    return (
        <div style={{ padding: 20 }}>
            {/* Header */}
            <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
                <Col>
                    <h1 style={{ fontWeight: 'bold', fontSize: 28, margin: 0 }}>Bảng Điều Khiển Admin</h1>
                </Col>
                <Col>
                    <Button type="primary" onClick={exportReport}>
                        Xuất báo cáo Excel
                    </Button>
                </Col>
            </Row>

            {/* Stats */}
            <Row gutter={16} style={{ marginBottom: 20 }}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Tổng Doanh Thu"
                            value={stats?.revenue || 0}
                            prefix={<DollarOutlined />}
                            suffix=" ₫"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Tổng Đơn Hàng" value={stats?.orders || 0} prefix={<ShoppingCartOutlined />} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Tổng Người Dùng" value={stats?.users || 0} prefix={<UserOutlined />} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Tổng Sản Phẩm" value={stats?.products || 0} prefix={<DatabaseOutlined />} />
                    </Card>
                </Col>
            </Row>

            {/* Orders & Best sellers */}
            <Row gutter={16}>
                <Col span={16}>
                    <Card title="Đơn Hàng Gần Đây" bordered={false}>
                        <Table
                            columns={orderColumns}
                            dataSource={orders}
                            pagination={false}
                            rowKey="_id"
                            size="middle"
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Sản Phẩm Bán Chạy" bordered={false}>
                        <List
                            itemLayout="horizontal"
                            dataSource={bestSellers}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.images[0]} size={56} shape="square" />}
                                        title={<b>{item.name}</b>}
                                        description={`${item.soldCount} đã bán • ${item.price.toLocaleString()} ₫`}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default HomePage
