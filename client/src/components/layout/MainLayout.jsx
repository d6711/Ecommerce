import Header from '@components/layout/Header'
import SideBar from '@components/layout/SideBar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <SideBar />
            <div className="flex-1 flex flex-col">
                <Header />
                <div className="flex-1 overflow-hidden">
                    <div className="h-full overflow-y-auto p-6">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainLayout
