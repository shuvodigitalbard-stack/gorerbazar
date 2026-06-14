import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '80px 16px' }}>
        <FiShoppingBag size={64} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Your cart is empty</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Looks like you haven't added anything yet</p>
        <Link to="/products" className="btn btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '24px 16px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>Shopping Cart</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px' }} className="cart-grid">
        {/* Cart Items */}
        <div>
          {cart.map(item => (
            <div key={item._id} style={{
              display: 'flex', gap: '16px', padding: '16px',
              background: '#fff', borderRadius: 'var(--radius)',
              boxShadow: 'var(--shadow)', marginBottom: '12px'
            }}>
              <Link to={`/product/${item.slug}`} style={{
                width: '100px', height: '100px', borderRadius: 'var(--radius-sm)',
                overflow: 'hidden', flexShrink: 0, background: '#f8f9fa'
              }}>
                <img
                  src={item.images?.[0] || item.thumbnail || 'https://via.placeholder.com/100'}
                  alt={item.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=No+Image'; }}
                />
              </Link>
              <div style={{ flex: 1 }}>
                <Link to={`/product/${item.slug}`}>
                  <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>{item.name}</h3>
                </Link>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  ৳{item.price.toLocaleString()} x {item.quantity}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)'
                  }}>
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)} style={{
                      padding: '6px 10px', background: 'none', border: 'none'
                    }}><FiMinus size={14} /></button>
                    <span style={{ padding: '6px 12px', fontWeight: '600', fontSize: '14px' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)} style={{
                      padding: '6px 10px', background: 'none', border: 'none'
                    }}><FiPlus size={14} /></button>
                  </div>
                  <button onClick={() => removeFromCart(item._id)} style={{
                    background: 'none', border: 'none', color: '#dc2626', padding: '4px'
                  }}><FiTrash2 size={18} /></button>
                </div>
              </div>
              <div style={{ textAlign: 'right', fontWeight: '700', fontSize: '16px', color: 'var(--primary-dark)' }}>
                ৳{(item.price * item.quantity).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <div style={{
            background: '#fff', borderRadius: 'var(--radius)',
            padding: '24px', boxShadow: 'var(--shadow)', position: 'sticky', top: '100px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
              <span>৳{cartTotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Delivery</span>
              <span>{cartTotal >= 2000 ? <span style={{ color: 'var(--primary-dark)' }}>Free</span> : '৳60'}</span>
            </div>
            <div style={{ height: '1px', background: 'var(--border)', margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '18px', fontWeight: '700' }}>
              <span>Total</span>
              <span style={{ color: 'var(--primary-dark)' }}>
                ৳{(cartTotal + (cartTotal >= 2000 ? 0 : 60)).toLocaleString()}
              </span>
            </div>
            <button
              onClick={() => {
                if (!user) {
                  navigate('/login?redirect=checkout');
                } else {
                  navigate('/checkout');
                }
              }}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              Proceed to Checkout
            </button>
            <Link to="/products" className="btn btn-outline" style={{ width: '100%', marginTop: '8px' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .cart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default Cart;
