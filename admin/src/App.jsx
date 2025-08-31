import MainLayout from '@src/components/layout/MainLayout'
import { AuthContext, AuthProvider } from '@src/context/AuthContext'
import { PermissionProvider } from '@src/context/PermissionContext'
import { ToastProvider } from '@src/context/ToastContext'
import CategoryPage from '@src/pages/CategoryPage'
import CustomerPage from '@src/pages/CustomerPage'
import DiscountPage from '@src/pages/DiscountPage'
import HomePage from '@src/pages/HomePage'
import InventoryPage from '@src/pages/InventoryPage'
import LoginPage from '@src/pages/LoginPage'
import NewsCatalogPage from '@src/pages/NewsCatalogPage'
import NewsPage from '@src/pages/NewsPage'
import NotFoundPage from '@src/pages/NotFoundPage'
import OrderPage from '@src/pages/OrderPage'
import ProductPage from '@src/pages/ProductPage'
import Setting from '@src/pages/SettingPage'
import UserPage from '@src/pages/UserPage'
import React, { useContext } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'

// lấy userId từ AuthContext thay vì cookie
const ProtectedRoutes = () => {
    const { userId } = useContext(AuthContext)
    if (!userId) return <Navigate to="/login" replace={true} />
    return <Outlet />
}

const UnauthorizedRoutes = () => {
    const { userId } = useContext(AuthContext)
    if (userId) return <Navigate to="/" replace={true} />
    return <Outlet />
}

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<UnauthorizedRoutes />}>
                <Route path="/login" element={<LoginPage />} />
            </Route>
            <Route element={<ProtectedRoutes />}>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="users" element={<UserPage />} />
                    <Route path="orders" element={<OrderPage />} />
                    <Route path="products" element={<ProductPage />} />
                    <Route path="categories" element={<CategoryPage />} />
                    <Route path="discounts" element={<DiscountPage />} />
                    <Route path="news" element={<NewsPage />} />
                    <Route path="catalogs" element={<NewsCatalogPage />} />
                    <Route path="inventories" element={<InventoryPage />} />
                    <Route path="customers" element={<CustomerPage />} />
                    <Route path="settings" element={<Setting />} />
                </Route>
            </Route>
            <Route path="*" element={<NotFoundPage />} replace />
        </Routes>
    )
}

const App = () => {
    return (
        <ToastProvider>
            <AuthProvider>
                <PermissionWrapper>
                    <BrowserRouter>
                        <AppRoutes />
                    </BrowserRouter>
                </PermissionWrapper>
            </AuthProvider>
        </ToastProvider>
    )
}

// PermissionProvider bọc quanh Router để có userId từ Auth
const PermissionWrapper = ({ children }) => {
    const { userId } = useContext(AuthContext)
    return <PermissionProvider userId={userId}>{children}</PermissionProvider>
}

export default App
