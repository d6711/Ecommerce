import HeaderLayout from '@src/components/layout/Header'
import SideBar from '@src/components/layout/SideBar'
import { Layout } from 'antd'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'

const { Content } = Layout

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false)

    return (
        <Layout style={{ minHeight: '100vh', display: 'flex', overflow: 'hidden' }}>
            <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />

            <Layout style={{ display: 'flex', flexDirection: 'column', height: '100vh', flex: 1 }}>
                <HeaderLayout />

                <Content
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        backgroundColor: '#f9fafb', // bg-gray-50
                        padding: 24, // p-6 = 24px
                    }}
                >
                    <div style={{ margin: '0 auto' }}>
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </Layout>
    )
}

export default MainLayout
