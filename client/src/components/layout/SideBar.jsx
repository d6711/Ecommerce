import { BarChart3, ChartBarStacked, Home, Layers, Menu, Settings, ShoppingCart, Users, Warehouse, X } from 'lucide-react'
import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

const SideBar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const menuItems = [
        { text: 'Trang chủ', icon: Home, path: '/' },
        { text: 'Nhân viên', icon: Users, path: '/users' },
        { text: 'Đơn hàng', icon: ShoppingCart, path: '/orders' },
        { text: 'Danh mục sản phẩm', icon: BarChart3, path: '/categories' },
        { text: 'Sản phẩm', icon: Layers, path: '/products' },
        { text: 'Kho hàng', icon: Warehouse, path: '/inventories' },
        { text: 'Khách hàng', icon: Users, path: '/customers' },
        { text: 'Bài viết', icon: ChartBarStacked, path: '/news' },
        { text: 'Cài đặt', icon: Settings, path: '/settings' },
    ]
    return (
        <div
            className={`${sidebarOpen ? 'w-64' : 'w-16'}
             bg-slate-900 text-white transition-all duration-300 ease-in-out`}
        >
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
                {sidebarOpen && (
                    <h1 className="text-xl font-bold text-center text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text">
                        X-Store
                    </h1>
                )}
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 transition-colors rounded-lg hover:bg-slate-700">
                    {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>
            <nav className="px-3 mt-6">
                {menuItems.map((item) => {
                    const IconComponent = item.icon
                    return (
                        <NavLink
                            key={item.text}
                            to={item.path}
                            className={({ isActive }) => `
                                w-full flex items-center px-3 py-3 mb-2 rounded-xl transition-all duration-200 group
                                ${
                                    isActive
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                        : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                                }
                            `}
                        >
                            <IconComponent size={20} className="flex-shrink-0" />
                            {sidebarOpen && <span className="ml-3 font-medium whitespace-nowrap">{item.text}</span>}
                            {!sidebarOpen && (
                                <div className="absolute px-2 py-1 text-sm text-white transition-opacity duration-200 rounded-md opacity-0 pointer-events-none left-16 bg-slate-800 group-hover:opacity-100">
                                    {item.text}
                                </div>
                            )}
                        </NavLink>
                    )
                })}
            </nav>
        </div>
    )
}

export default SideBar
