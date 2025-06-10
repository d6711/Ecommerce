import { BarChart3, Home, Menu, Settings, ShoppingCart, Users, X } from 'lucide-react'
import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

const SideBar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const menuItems = [
        { text: 'Dashboard', icon: Home, path: '/dashboard' },
        { text: 'Users', icon: Users, path: '/users' },
        { text: 'Analytics', icon: BarChart3, path: '/analytics' },
        { text: 'Orders', icon: ShoppingCart, path: '/orders' },
        { text: 'Settings', icon: Settings, path: '/settings' },
    ]
    return (
        <div
            className={`${sidebarOpen ? 'w-64' : 'w-16'}
             bg-slate-900 text-white transition-all duration-300 ease-in-out`}
        >
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
                {sidebarOpen && (
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        AdminPanel
                    </h1>
                )}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-1 rounded-lg hover:bg-slate-700 transition-colors"
                >
                    {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>
            <nav className="mt-6 px-3">
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
                            {sidebarOpen && <span className="ml-3 font-medium">{item.text}</span>}
                            {!sidebarOpen && (
                                <div className="absolute left-16 bg-slate-800 text-white px-2 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
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
