import React, { useState, useEffect } from 'react';
import { getOrders } from '../../services/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (statusFilter) params.status = statusFilter;
      const res = await getOrders(params);
      setOrders(res.data.orders);
      setTotal(res.data.total);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const statusColors = {
    pending: { bg: '#fef3c7', color: '#d97706' },
    confirmed: { bg: '#dbeafe', color: '#2563eb' },
    processing: { bg: '#e0e7ff', color: '#4f46e5' },
    shipped: { bg: '#cffafe', color: '#0891b2' },
    delivered: { bg: '#dcfce7', color: '#16a34a' },
    cancelled: { bg: '#fee2e2', color: '#dc2626' }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Orders ({total})</h1>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="form-input" style={{ width: 'auto' }}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div style={{ background: '#fff', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600' }}>Order #</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600' }}>Customer</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600' }}>Items</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600' }}>Total</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => {
                const sc = statusColors[o.orderStatus] || statusColors.pending;
                return (
                  <tr key={o._id} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '600' }}>{o.orderNumber}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: '500' }}>{o.shippingAddress?.name || o.user?.name || 'Guest'}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{o.shippingAddress?.phone}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>{o.items?.length || 0} item(s)</td>
                    <td style={{ padding: '12px 16px', fontWeight: '600' }}>৳{o.total?.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '4px 10px', borderRadius: '20px', fontSize: '12px',
                        fontWeight: '600', background: sc.bg, color: sc.color
                      }}>
                        {o.orderStatus}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-muted)' }}>
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {Math.ceil(total / 20) > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
          {Array.from({ length: Math.min(Math.ceil(total / 20), 10) }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} style={{
              width: '36px', height: '36px', borderRadius: 'var(--radius-sm)',
              border: 'none', fontWeight: '600',
              background: p === page ? 'var(--primary)' : 'var(--bg-secondary)',
              color: p === page ? '#fff' : 'var(--text-primary)'
            }}>{p}</button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
