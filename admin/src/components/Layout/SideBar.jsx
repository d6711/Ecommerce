import { Layout, Menu } from 'antd'
import {
    HomeOutlined,
    UserOutlined,
    SettingOutlined,
    AccountBookOutlined,
    UsergroupAddOutlined,
    AppstoreOutlined,
    MenuUnfoldOutlined,
    PicCenterOutlined,
    ShopOutlined,
    TagsOutlined,
    BarcodeOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import logo from '@assets/images/logox.webp'
import styles from './styles.module.scss'
import { useState } from 'react'
import cls from 'classnames'

const { Sider } = Layout

const SideBar = () => {
    const { logoImg, hide } = styles
    const navigate = useNavigate()
    const location = useLocation()
    const [collapsed, setCollapsed] = useState(false)

    const menuItems = [
        { key: '/', icon: <HomeOutlined />, label: 'Thống kê' },
        { key: '/users', icon: <UserOutlined />, label: 'QL Nhân sự' },
        {
            key: '/customers',
            icon: <UsergroupAddOutlined />,
            label: 'QL Khách hàng',
        },
        {
            key: 'products_management',
            icon: <AppstoreOutlined />,
            label: 'QL Sản phẩm',
            children: [
                {
                    key: '/brands',
                    icon: <ShopOutlined />,
                    label: 'Thương hiệu',
                },
                {
                    key: '/categories',
                    icon: <TagsOutlined />,
                    label: 'Danh mục',
                },
                {
                    key: '/products',
                    icon: <BarcodeOutlined />,
                    label: 'Sản phẩm',
                },
            ],
        },
        {
            key: '/suppliers',
            icon: <AccountBookOutlined />,
            label: 'QL Nhà cung cấp',
        },
        {
            key: 'orders_manegement',
            icon: <PicCenterOutlined />,
            label: 'QL Đơn hàng',
            children: [
                {
                    key: '/orders',
                    icon: <MenuUnfoldOutlined />,
                    label: 'QL Đơn hàng',
                },
                {
                    key: '/payments',
                    icon: <PicCenterOutlined />,
                    label: 'QL thanh toán',
                },
            ],
        },
        {
            key: '/discounts',
            icon: <SettingOutlined />,
            label: 'QL Khuyến mại',
        },
        {
            key: '/inventories',
            icon: <PicCenterOutlined />,
            label: 'QL Tồn kho',
        },
        { key: '/stores', icon: <PicCenterOutlined />, label: 'QL Cửa hàng' },
        { key: '/settings', icon: <SettingOutlined />, label: 'Cài đặt' },
    ]

    return (
        <div>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={() => setCollapsed(!collapsed)}
                style={{ minHeight: '100vh' }}
            >
                <div className={cls(logoImg, { [hide]: collapsed })}>
                    <img src={logo} alt="logo" />
                </div>

                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]} // Đảm bảo selectedKeys đúng route
                    onClick={({ key }) => navigate(key)}
                    items={menuItems}
                />
            </Sider>
        </div>
    )
}

export default SideBar
