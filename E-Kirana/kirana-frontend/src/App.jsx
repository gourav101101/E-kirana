import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Page Imports
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import HomePage from './pages/HomePage.jsx';
import AdminLoginPage from './pages/AdminLoginPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderConfirmationPage from './pages/OrderConfirmationPage.jsx';
import MyOrdersPage from './pages/MyOrdersPage.jsx';
import AdminProductPage from './pages/AdminProductPage.jsx';
import AdminOrderPage from './pages/AdminOrderPage.jsx';
import AdminUserPage from './pages/AdminUserPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';

// Layout and Route Protection Imports
import UserLayout from './components/UserLayout.jsx';
import ProtectedRoute from './services/ProtectedRoute.jsx';
import AdminRoute from './services/AdminRoute.jsx';
import AdminLayout from './components/AdminLayout.jsx';

function App() {
    return (
        <div className="App">
            <Routes>
                {/* === Public User Routes === */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* === Admin Login Route === */}
                <Route path="/admin/login" element={<AdminLoginPage />} />

                {/* === Protected User Routes === */}
                <Route path="/" element={<ProtectedRoute />}>
                    <Route element={<UserLayout />}>
                        <Route index element={<HomePage />} />
                        <Route path="cart" element={<CartPage />} />
                        <Route path="checkout" element={<CheckoutPage />} />
                        <Route path="order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                        <Route path="my-orders" element={<MyOrdersPage />} />
                        <Route path="product/:id" element={<ProductDetailPage />} />
                    </Route>
                </Route>

                {/* === Protected Admin Routes === */}
                <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="products" element={<AdminProductPage />} />
                        <Route path="users" element={<AdminUserPage />} />
                        <Route path="orders" element={<AdminOrderPage />} />
                    </Route>
                </Route>

            </Routes>
        </div>
    );
}

export default App;
