import { Layout, Menu } from 'antd'
import {
    Home,
    User,
    Settings,
    BookUser,
    Users,
    AppWindow,
    PanelRightOpen,
    Package,
    Tag,
    ShoppingCart,
    CreditCard,
    Warehouse,
} from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import logo from '@src/assets/react.svg'

const { Sider } = Layout

const SideBar = ({ collapsed, setCollapsed }) => {
    const navigate = useNavigate()
    const location = useLocation()

    const menuItems = [
        { key: '/', icon: <Home size={18} />, label: 'Thống kê' },
        { key: '/users', icon: <User size={18} />, label: 'QL Nhân sự' },
        { key: '/customers', icon: <Users size={18} />, label: 'QL Khách hàng' },
        {
            key: 'products_management',
            icon: <AppWindow size={18} />,
            label: 'QL Sản phẩm',
            children: [
                { key: '/categories', icon: <Tag size={18} />, label: 'Danh mục' },
                { key: '/products', icon: <Package size={18} />, label: 'Sản phẩm' },
            ],
        },
        { key: '/suppliers', icon: <BookUser size={18} />, label: 'QL Nhà cung cấp' },
        {
            key: 'orders_management',
            icon: <ShoppingCart size={18} />,
            label: 'QL Đơn hàng',
            children: [
                { key: '/orders', icon: <PanelRightOpen size={18} />, label: 'QL Đơn hàng' },
                { key: '/payments', icon: <CreditCard size={18} />, label: 'QL Thanh toán' },
            ],
        },
        { key: '/discounts', icon: <Settings size={18} />, label: 'QL Khuyến mại' },
        { key: '/inventories', icon: <Warehouse size={18} />, label: 'QL Tồn kho' },
        { key: '/settings', icon: <Settings size={18} />, label: 'Cài đặt' },
    ]

    return (
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
            <div
                className="logo"
                onClick={() => navigate('/')}
                style={{
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                    margin: 10,
                    paddingBottom: 20,
                    borderBottom: '1px solid #fff',
                }}
            >
                <img width={30} src={logo} alt="Logo" />
            </div>
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[location.pathname]} // Đảm bảo selectedKeys đúng route
                onClick={({ key }) => navigate(key)}
                items={menuItems}
            />
        </Sider>
    )
}

export default SideBar
