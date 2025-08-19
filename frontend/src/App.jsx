import MainLayout from '@src/components/layout/MainLayout'
import { AuthProvider } from '@src/context/AuthContext'
import { ToastProvider } from '@src/context/ToastContext'
import CategoryPage from '@src/pages/CategoryPage'
import CustomerPage from '@src/pages/CustomerPage'
import HomePage from '@src/pages/HomePage'
import InventoryPage from '@src/pages/InventoryPage'
import LoginPage from '@src/pages/LoginPage'
import NewsPage from '@src/pages/NewsPage'
import NotFoundPage from '@src/pages/NotFoundPage'
import OrderPage from '@src/pages/OrderPage'
import ProductPage from '@src/pages/ProductPage'
import Setting from '@src/pages/SettingPage'
import UserPage from '@src/pages/UserPage'
import Cookies from 'js-cookie'
import React from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'

const ProtectedRoutes = () => {
    const user = Cookies.get('userId')
    if (!user) return <Navigate to="/login" replace={true} />
    return <Outlet />
}
const UnauthorizedRoutes = () => {
    const user = Cookies.get('userId')
    if (user) return <Navigate to="/" replace={true} />
    return <Outlet />
}

const App = () => {
    return (
        <ToastProvider>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route element={<UnauthorizedRoutes />}>
                            <Route path="/login" element={<LoginPage />} />
                        </Route>
                        <Route element={<ProtectedRoutes />}>
                            <Route path="/" element={<MainLayout />}>
                                <Route index element={<HomePage />} /> <Route path="users" element={<UserPage />} />
                                <Route path="orders" element={<OrderPage />} />
                                <Route path="products" element={<ProductPage />} />
                                <Route path="categories" element={<CategoryPage />} />
                                <Route path="news" element={<NewsPage />} />
                                <Route path="inventories" element={<InventoryPage />} />
                                <Route path="customers" element={<CustomerPage />} />
                                <Route path="settings" element={<Setting />} />
                            </Route>
                        </Route>
                        <Route path="*" element={<NotFoundPage />} replace />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </ToastProvider>
    )
}

export default App
