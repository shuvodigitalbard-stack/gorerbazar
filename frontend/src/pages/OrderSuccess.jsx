import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id');

  return (
    <div style={{ textAlign: 'center', padding: '80px 16px' }}>
      <FiCheckCircle size={80} color="var(--primary)" style={{ marginBottom: '16px' }} />
      <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '12px' }}>Order Placed Successfully!</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
        Thank you for your order. We'll deliver it soon.
      </p>
      {orderId && (
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
          Order ID: {orderId}
        </p>
      )}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/orders" className="btn btn-primary">View My Orders</Link>
        <Link to="/products" className="btn btn-outline">Continue Shopping</Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
