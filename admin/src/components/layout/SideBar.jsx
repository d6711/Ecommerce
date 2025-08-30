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
        { key: '/categories', icon: <Tag size={18} />, label: 'QL Danh mục SP' },
        { key: '/products', icon: <Package size={18} />, label: 'Quản lý Sản phẩm' },
        { key: '/orders', icon: <PanelRightOpen size={18} />, label: 'QL Đơn hàng' },
        { key: '/discounts', icon: <BookUser size={18} />, label: 'QL Khuyến mại' },
        { key: '/catalogs', icon: <Package size={18} />, label: 'Danh mục tin tức' },
        { key: '/news', icon: <ShoppingCart size={18} />, label: 'QL Tin tức' },
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
