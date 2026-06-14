import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Public Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import OrderSuccess from './pages/OrderSuccess';
import MyOrders from './pages/MyOrders';

// Admin
import AdminPanel from './pages/admin/AdminPanel';

// Layout wrapper
const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <main style={{ minHeight: 'calc(100vh - 200px)' }}>{children}</main>
    <Footer />
  </>
);

const AppRoutes = () => {
  const { loading } = useAuth();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{
          width: '40px', height: '40px', border: '4px solid var(--border)',
          borderTopColor: 'var(--primary)', borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (isAdminRoute) {
    return (
      <Routes>
        <Route path="/admin/*" element={<AdminPanel />} />
      </Routes>
    );
  }

  return (
    <PublicLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/category/:slug" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/admin/*" element={<AdminPanel />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </PublicLayout>
  );
};

export default AppRoutes;
