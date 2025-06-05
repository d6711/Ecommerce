import MainLayout from '@components/Layout/MainLayout'
import { MessageProvider } from '@contexts/MessageContext'
import CategoryPage from '@pages/Category/Category'
import CustomerPage from '@pages/Customer/Customer'
import Dashboard from '@pages/Dashboard/Dashboard'
import DiscountPage from '@pages/Discount/Discount'
import InventoryPage from '@pages/Inventory/Inventory'
import Login from '@pages/Login/Login'
import NotFoundPage from '@pages/NotFound/NotFoundPage'
import OrderPage from '@pages/Order/Order'
import ProductPage from '@pages/Product/Product'
import Setting from '@pages/Setting/Setting'
import UserPage from '@pages/User/User'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'

const ProtectedRoutes = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  // if (!user) return <Navigate to={'/login'} replace={true} />
  return <Outlet />
}
const UnauthorizedRoutes = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  // if (user) return <Navigate to={'/'} replace={true} />
  return <Outlet />
}

function App() {
  return (
    <MessageProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<UnauthorizedRoutes />}>
            <Route path="/login" element={<Login />} />
          </Route>
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="/users" element={<UserPage />} />
              <Route path="/products" element={<ProductPage />} />
              <Route path="/discounts" element={<DiscountPage />} />
              <Route path="/categories" element={<CategoryPage />} />
              <Route path="/customers" element={<CustomerPage />} />
              <Route path="/orders" element={<OrderPage />} />
              <Route path="/inventories" element={<InventoryPage />} />
              <Route path="/settings" element={<Setting />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </MessageProvider>
  )
}

export default App
