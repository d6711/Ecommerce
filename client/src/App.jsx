import MainLayout from '@components/layout/MainLayout'
import { AuthProvider } from '@context/AuthContext'
import { ToastProvider } from '@context/ToastContext'
import Login from '@pages/Auth/Login'
import CategoryPage from '@pages/Category/Category'
import CustomerPage from '@pages/Customer/Customer'
import HomePage from '@pages/Home/HomePage'
import InventoryPage from '@pages/Inventory/Inventory'
import NewsPage from '@pages/News/News'
import NotFound from '@pages/NotFound/NotFound'
import OrderPage from '@pages/Order/Order'
import ProductPage from '@pages/Product/Product'
import Setting from '@pages/Setting/Setting'
import UserPage from '@pages/User/User'
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
