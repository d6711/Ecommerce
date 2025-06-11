import Header from '@components/layout/Header'
import SideBar from '@components/layout/SideBar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <SideBar />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default MainLayout
