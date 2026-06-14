import React, { useState } from 'react';
import { Link, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { FiPackage, FiShoppingCart, FiGrid, FiImage, FiMenu, FiX, FiLogOut, FiBarChart } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminCategories from './AdminCategories';
import AdminBanners from './AdminBanners';

const AdminPanel = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const menuItems = [
    { path: '/admin', icon: <FiBarChart size={20} />, label: 'Dashboard' },
    { path: '/admin/products', icon: <FiPackage size={20} />, label: 'Products' },
    { path: '/admin/orders', icon: <FiShoppingCart size={20} />, label: 'Orders' },
    { path: '/admin/categories', icon: <FiGrid size={20} />, label: 'Categories' },
    { path: '/admin/banners', icon: <FiImage size={20} />, label: 'Banners' },
  ];

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar - Desktop */}
      <aside style={{
        width: '240px', background: 'var(--bg-dark)', color: '#fff',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100,
        display: 'flex', flexDirection: 'column'
      }} className="admin-sidebar">
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', fontWeight: '800', color: '#fff'
            }}>G</div>
            Gorerbazar
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Admin Panel</p>
        </div>

        <nav style={{ flex: 1, padding: '12px 0' }}>
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 20px', fontSize: '14px', fontWeight: '500',
                background: isActive(item.path) ? 'rgba(74, 222, 128, 0.15)' : 'transparent',
                color: isActive(item.path) ? 'var(--primary)' : '#94a3b8',
                borderLeft: isActive(item.path) ? '3px solid var(--primary)' : '3px solid transparent'
              }}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600' }}>{user.name}</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Admin</div>
            </div>
            <button onClick={handleLogout} style={{
              background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer'
            }}><FiLogOut size={18} /></button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div style={{
        display: 'none', position: 'fixed', top: 0, left: 0, right: 0,
        background: 'var(--bg-dark)', color: '#fff', padding: '12px 16px',
        zIndex: 99, alignItems: 'center', justifyContent: 'space-between'
      }} className="admin-mobile-header">
        <h2 style={{ fontSize: '16px', fontWeight: '700' }}>Gorerbazar Admin</h2>
        <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: '#fff' }}>
          <FiMenu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div style={{
          display: 'none', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 101
        }} className="admin-mobile-overlay" onClick={() => setSidebarOpen(false)}>
          <aside style={{
            width: '240px', background: 'var(--bg-dark)', color: '#fff',
            height: '100vh', padding: '20px'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Menu</h2>
              <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: '#fff' }}>
                <FiX size={24} />
              </button>
            </div>
            {menuItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 0', fontSize: '14px', fontWeight: '500',
                  color: isActive(item.path) ? 'var(--primary)' : '#94a3b8',
                  borderBottom: '1px solid rgba(255,255,255,0.05)'
                }}
              >
                {item.icon} {item.label}
              </Link>
            ))}
            <button onClick={handleLogout} style={{
              marginTop: '20px', background: 'none', border: 'none',
              color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <FiLogOut /> Logout
            </button>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main style={{ marginLeft: '240px', flex: 1, background: 'var(--bg-secondary)', minHeight: '100vh' }} className="admin-main">
        <div style={{ padding: '24px' }}>
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="banners" element={<AdminBanners />} />
          </Routes>
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar { display: none !important; }
          .admin-mobile-header { display: flex !important; }
          .admin-mobile-overlay { display: block !important; }
          .admin-main { margin-left: 0 !important; padding-top: 56px; }
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;
