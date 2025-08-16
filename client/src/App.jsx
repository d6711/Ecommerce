import MainLayout from '@components/layout/MainLayout'
import { AuthProvider } from '@context/AuthContext'
import { ToastProvider } from '@context/ToastContext'
import Login from '@pages/LoginPage'
import CustomerPage from '@pages/CustomerPage'
import HomePage from '@pages/HomePage'
import InventoryPage from '@pages/InventoryPage'
import NewsPage from '@pages/NewsPage'
import NotFound from '@pages/NotFoundPage'
import OrderPage from '@pages/OrderPage'
import ProductPage from '@pages/ProductPage'
import Setting from '@pages/SettingPage'
import UserPage from '@pages/UserPage'
import Cookies from 'js-cookie'
import React from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import CategoryPage from '@pages/CategoryPage'

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
                            <Route path="/login" element={<Login />} />
                        </Route>
                        <Route element={<ProtectedRoutes />}>
                            <Route path="/" element={<MainLayout />}>
                                <Route index element={<HomePage />} /> {/* tức là / -> HomePage */}
                                <Route path="users" element={<UserPage />} />
                                <Route path="orders" element={<OrderPage />} />
                                <Route path="products" element={<ProductPage />} />
                                <Route path="categories" element={<CategoryPage />} />
                                <Route path="news" element={<NewsPage />} />
                                <Route path="inventories" element={<InventoryPage />} />
                                <Route path="customers" element={<CustomerPage />} />
                                <Route path="settings" element={<Setting />} />
                            </Route>
                        </Route>
                        <Route path="*" element={<NotFound />} replace />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </ToastProvider>
    )
}

export default App
