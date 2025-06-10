import Header from '@components/layout/Header'
import SideBar from '@components/layout/SideBar'
import Dashboard from '@pages/Dashboard'
import Users from '@pages/Users'
import Analytics from '@pages/Analytics'
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

const MainLayout = () => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <SideBar />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 p-6">
                    <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/analytics" element={<Analytics />} />
                    </Routes>
                </main>
            </div>
        </div>
    )
}

export default MainLayout
