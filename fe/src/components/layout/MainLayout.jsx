import HeaderLayout from '@src/components/layout/Header'
import SideBar from '@src/components/layout/SideBar'
import { Layout } from 'antd'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'

const { Content } = Layout

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false)

    return (
        <Layout className="min-h-screen flex overflow-hidden">
            <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />

            <Layout className="flex flex-col h-screen flex-1">
                <HeaderLayout />

                <Content className="flex-1 overflow-y-auto bg-gray-50 p-6">
                    <div className="mx-auto">
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </Layout>
    )
}

export default MainLayout
