// src/components/layout/AppHeader.jsx
import React from 'react'
import { Layout, Dropdown, Avatar, Badge } from 'antd'
import { Bell, Home, User, LogOut } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const { Header } = Layout

const HeaderLayout = () => {
    const location = useLocation()

    const headerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#fff',
        padding: '0 16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        height: 64,
    }

    const leftStyle = {
        display: 'flex',
        alignItems: 'center',
    }

    const centerStyle = {
        flex: 1,
        marginLeft: 5,
        color: '#666',
    }

    const rightStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    }

    const userInfoStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
    }

    return (
        <Header style={headerStyle}>
            <div style={leftStyle}>
                <Home size={22} color="#1677ff" />
                <span style={{ fontWeight: 600, fontSize: 16, color: '#333' }}>Home</span>
            </div>

            <div style={centerStyle}>
                <span>{location.pathname}</span>
            </div>

            <div style={rightStyle}>
                <Badge count={5} size="small">
                    <Bell size={20} style={{ cursor: 'pointer', color: '#555' }} />
                </Badge>

                <Dropdown
                    menu={{
                        items: [
                            { key: 'profile', label: 'Profile', icon: <User size={16} /> },
                            { key: 'logout', label: 'Logout', icon: <LogOut size={16} /> },
                        ],
                    }}
                    placement="bottomRight"
                    arrow
                >
                    <div style={userInfoStyle}>
                        <Avatar style={{ backgroundColor: '#1677ff' }}>D</Avatar>
                        <span style={{ fontSize: 14, color: '#333' }}>Dev</span>
                    </div>
                </Dropdown>
            </div>
        </Header>
    )
}

export default HeaderLayout
