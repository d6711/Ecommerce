import { Layout, Menu } from 'antd'
import {
    Home,
    User,
    Settings,
    BookUser,
    Users,
    PanelRightOpen,
    Package,
    Tag,
    ShoppingCart,
    Warehouse,
} from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import logo from '@src/assets/angular.jpg'
import { usePermission } from '@src/context/PermissionContext'

const { Sider } = Layout

const SideBar = ({ collapsed, setCollapsed }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const { canAccess } = usePermission()

    const menuItems = [
        // dashboard và setting ko cần quyền
        { key: '/', icon: <Home size={18} />, label: 'Thống kê', skipCheck: true },
        {
            key: '/categories',
            icon: <Tag size={18} />,
            label: 'QL Danh mục SP',
            action: 'read:any',
            resource: 'category',
        },
        {
            key: '/products',
            icon: <Package size={18} />,
            label: 'Quản lý Sản phẩm',
            action: 'read:any',
            resource: 'product',
        },
        {
            key: '/orders',
            icon: <PanelRightOpen size={18} />,
            label: 'QL Đơn hàng',
            action: 'read:any',
            resource: 'order',
        },
        {
            key: '/discounts',
            icon: <BookUser size={18} />,
            label: 'QL Khuyến mại',
            action: 'read:any',
            resource: 'discount',
        },
        {
            key: '/catalogs',
            icon: <Package size={18} />,
            label: 'Danh mục tin tức',
            action: 'read:any',
            resource: 'catalog',
        },
        { key: '/news', icon: <ShoppingCart size={18} />, label: 'QL Tin tức', action: 'read:any', resource: 'news' },
        {
            key: '/inventories',
            icon: <Warehouse size={18} />,
            label: 'QL Tồn kho',
            action: 'read:any',
            resource: 'product',
        },
        {
            key: '/customers',
            icon: <Users size={18} />,
            label: 'QL Khách hàng',
            action: 'read:any',
            resource: 'user',
        },
        { key: '/users', icon: <User size={18} />, label: 'QL Nhân sự', action: 'read:any', resource: 'user' },
        { key: '/settings', icon: <Settings size={18} />, label: 'Cài đặt', skipCheck: true },
    ]

    // lọc theo quyền, nhưng giữ lại những cái skipCheck
    const filteredMenuItems = menuItems.filter((item) => item.skipCheck || canAccess(item.action, item.resource))

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
                selectedKeys={[location.pathname]}
                onClick={({ key }) => navigate(key)}
                items={filteredMenuItems}
            />
        </Sider>
    )
}

export default SideBar
