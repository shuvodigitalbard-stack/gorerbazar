import React, { useState, useEffect } from 'react';
import { FiShoppingCart, FiPackage, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { getOrderStats, getProducts } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [sRes, pRes] = await Promise.all([getOrderStats(), getProducts({ limit: 1 })]);
        setStats(sRes.data);
        setProductCount(pRes.data.total);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>;

  const cards = [
    { title: 'Total Orders', value: stats?.totalOrders || 0, icon: <FiShoppingCart size={24} />, color: '#4ade80', bg: '#f0fdf4' },
    { title: 'Total Products', value: productCount, icon: <FiPackage size={24} />, color: '#2dd4bf', bg: '#f0fdfa' },
    { title: 'Total Revenue', value: `৳${(stats?.totalRevenue || 0).toLocaleString()}`, icon: <FiDollarSign size={24} />, color: '#fbbf24', bg: '#fefce8' },
    { title: 'Pending Orders', value: stats?.pendingOrders || 0, icon: <FiTrendingUp size={24} />, color: '#f97316', bg: '#fff7ed' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {cards.map((card, i) => (
          <div key={i} style={{
            background: '#fff', borderRadius: 'var(--radius)', padding: '20px',
            boxShadow: 'var(--shadow)', display: 'flex', alignItems: 'center', gap: '16px'
          }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '50%',
              background: card.bg, display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: card.color
            }}>{card.icon}</div>
            <div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{card.title}</div>
              <div style={{ fontSize: '24px', fontWeight: '700' }}>{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        background: '#fff', borderRadius: 'var(--radius)', padding: '24px', boxShadow: 'var(--shadow)'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Quick Stats</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', background: '#f0fdf4', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#16a34a' }}>{stats?.todayOrders || 0}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Today's Orders</div>
          </div>
          <div style={{ padding: '16px', background: '#fefce8', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#d97706' }}>৳{(stats?.todayRevenue || 0).toLocaleString()}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Today's Revenue</div>
          </div>
          <div style={{ padding: '16px', background: '#f0fdfa', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#0891b2' }}>{stats?.deliveredOrders || 0}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Delivered</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
