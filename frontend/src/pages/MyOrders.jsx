import React, { useState, useEffect } from 'react';
import { getMyOrders } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      getMyOrders().then(res => {
        setOrders(res.data);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [user]);

  if (!user) return null;

  const statusColors = {
    pending: { bg: '#fef3c7', color: '#d97706' },
    confirmed: { bg: '#dbeafe', color: '#2563eb' },
    processing: { bg: '#e0e7ff', color: '#4f46e5' },
    shipped: { bg: '#cffafe', color: '#0891b2' },
    delivered: { bg: '#dcfce7', color: '#16a34a' },
    cancelled: { bg: '#fee2e2', color: '#dc2626' }
  };

  return (
    <div className="container" style={{ padding: '24px 16px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>My Orders</h1>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <h3>No orders yet</h3>
          <Link to="/products" className="btn btn-primary" style={{ marginTop: '16px' }}>Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map(order => {
            const sc = statusColors[order.orderStatus] || statusColors.pending;
            return (
              <div key={order._id} style={{
                background: '#fff', borderRadius: 'var(--radius)', padding: '20px', boxShadow: 'var(--shadow)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <span style={{ fontWeight: '700', fontSize: '16px' }}>#{order.orderNumber}</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: '12px' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span style={{
                    padding: '4px 12px', borderRadius: '20px', fontSize: '12px',
                    fontWeight: '600', background: sc.bg, color: sc.color
                  }}>
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {order.items.slice(0, 3).map((item, i) => (
                    <img key={i} src={item.image || 'https://via.placeholder.com/60'} alt={item.name}
                      style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/60'; }}
                    />
                  ))}
                  {order.items.length > 3 && (
                    <div style={{
                      width: '60px', height: '60px', borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-secondary)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600'
                    }}>+{order.items.length - 3}</div>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    {order.items.length} item(s)
                  </span>
                  <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--primary-dark)' }}>
                    ৳{order.total.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
