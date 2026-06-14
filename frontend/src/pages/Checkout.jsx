import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiPhone, FiUser, FiCreditCard } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/api';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || 'Dhaka',
    district: user?.address?.district || '',
    postalCode: user?.address?.postalCode || '',
    note: '',
    paymentMethod: 'cod'
  });

  const deliveryCharge = cartTotal >= 2000 ? 0 : 60;
  const total = cartTotal + deliveryCharge;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderData = {
        items: cart.map(item => ({
          product: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.images?.[0] || item.thumbnail
        })),
        shippingAddress: {
          name: form.name,
          phone: form.phone,
          street: form.street,
          city: form.city,
          district: form.district,
          postalCode: form.postalCode,
          note: form.note
        },
        subtotal: cartTotal,
        deliveryCharge,
        discount: 0,
        total,
        paymentMethod: form.paymentMethod
      };

      const res = await createOrder(orderData);
      clearCart();
      navigate(`/order-success?id=${res.data._id}`);
    } catch (err) {
      alert('Order failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container" style={{ padding: '24px 16px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }} className="checkout-grid">
          <div>
            {/* Shipping Address */}
            <div style={{
              background: '#fff', borderRadius: 'var(--radius)',
              padding: '24px', boxShadow: 'var(--shadow)', marginBottom: '16px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiMapPin /> Shipping Address
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Full Name</label>
                  <input type="text" name="name" className="form-input" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input type="tel" name="phone" className="form-input" value={form.phone} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input type="text" name="city" className="form-input" value={form.city} onChange={handleChange} required />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Street Address</label>
                  <input type="text" name="street" className="form-input" placeholder="House, road, area" value={form.street} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">District</label>
                  <input type="text" name="district" className="form-input" value={form.district} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Postal Code</label>
                  <input type="text" name="postalCode" className="form-input" value={form.postalCode} onChange={handleChange} />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Order Note (Optional)</label>
                  <textarea name="note" className="form-input" placeholder="Any special instructions..." value={form.note} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div style={{
              background: '#fff', borderRadius: 'var(--radius)',
              padding: '24px', boxShadow: 'var(--shadow)'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiCreditCard /> Payment Method
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { value: 'cod', label: 'Cash on Delivery', icon: '💵' },
                  { value: 'bkash', label: 'bKash', icon: '📱' },
                  { value: 'nagad', label: 'Nagad', icon: '📱' }
                ].map(pm => (
                  <label key={pm.value} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 16px', border: `2px solid ${form.paymentMethod === pm.value ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-sm)', cursor: 'pointer'
                  }}>
                    <input
                      type="radio" name="paymentMethod" value={pm.value}
                      checked={form.paymentMethod === pm.value}
                      onChange={handleChange} style={{ display: 'none' }}
                    />
                    <span>{pm.icon}</span>
                    <span style={{ fontWeight: '500' }}>{pm.label}</span>
                    {form.paymentMethod === pm.value && (
                      <span style={{ marginLeft: 'auto', color: 'var(--primary)', fontWeight: '700' }}>✓</span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div style={{
              background: '#fff', borderRadius: 'var(--radius)',
              padding: '24px', boxShadow: 'var(--shadow)', position: 'sticky', top: '100px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Order Summary</h3>

              {cart.map(item => (
                <div key={item._id} style={{
                  display: 'flex', gap: '12px', marginBottom: '12px', paddingBottom: '12px',
                  borderBottom: '1px solid var(--border)'
                }}>
                  <img
                    src={item.images?.[0] || item.thumbnail || 'https://via.placeholder.com/60'}
                    alt={item.name}
                    style={{ width: '50px', height: '50px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/60'; }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: '500' }}>{item.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>x{item.quantity}</div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>৳{(item.price * item.quantity).toLocaleString()}</div>
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '14px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                <span>৳{cartTotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '14px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Delivery</span>
                <span>{deliveryCharge === 0 ? <span style={{ color: 'var(--primary-dark)' }}>Free</span> : `৳${deliveryCharge}`}</span>
              </div>
              <div style={{ height: '1px', background: 'var(--border)', margin: '12px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '20px', fontWeight: '700' }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary-dark)' }}>৳{total.toLocaleString()}</span>
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Placing Order...' : `Place Order - ৳${total.toLocaleString()}`}
              </button>
            </div>
          </div>
        </div>
      </form>

      <style>{`
        @media (max-width: 768px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default Checkout;
