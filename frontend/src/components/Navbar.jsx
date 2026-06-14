import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiSearch, FiMenu, FiX, FiHeart, FiPackage } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  return (
    <>
      {/* Top Bar */}
      <div style={{ background: 'var(--bg-dark)', color: 'var(--text-light)', padding: '8px 0', fontSize: '13px' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>📞 01700-000000 | ✉️ info@gorerbazar.com</span>
          <span style={{ display: 'flex', gap: '16px' }}>
            <span>🚚 Free delivery over ৳2000</span>
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <nav style={{ background: '#fff', boxShadow: 'var(--shadow)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '50%',
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px', fontWeight: '800', color: '#fff'
            }}>G</div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                Gorerbazar
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Natural & Organic</div>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} style={{
            flex: 1, maxWidth: '500px', margin: '0 24px',
            display: 'flex', alignItems: 'center',
            border: '2px solid var(--border)', borderRadius: '25px',
            overflow: 'hidden', background: 'var(--bg-secondary)'
          }}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1, padding: '10px 16px', border: 'none',
                background: 'transparent', fontSize: '14px'
              }}
            />
            <button type="submit" style={{
              padding: '10px 16px', background: 'var(--gradient-primary)',
              color: '#fff', border: 'none', display: 'flex', alignItems: 'center'
            }}>
              <FiSearch size={18} />
            </button>
          </form>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link to="/wishlist" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <FiHeart size={20} />
              <span className="hide-mobile">Wishlist</span>
            </Link>

            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '12px', color: 'var(--text-secondary)', background: 'none', border: 'none' }}
                >
                  <FiUser size={20} />
                  <span className="hide-mobile">{user.name?.split(' ')[0]}</span>
                </button>
              </div>
            ) : (
              <Link to="/login" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <FiUser size={20} />
                <span className="hide-mobile">Login</span>
              </Link>
            )}

            <Link to="/cart" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '12px', color: 'var(--text-secondary)', position: 'relative' }}>
              <FiShoppingCart size={20} />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: -8, right: -8,
                  background: 'var(--primary)', color: '#fff',
                  borderRadius: '50%', width: '18px', height: '18px',
                  fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: '700'
                }}>{cartCount}</span>
              )}
              <span className="hide-mobile">Cart</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ display: 'none', background: 'none', border: 'none', padding: '4px' }}
              className="mobile-menu-btn"
            >
              {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Category Bar - Desktop */}
        <div style={{ borderTop: '1px solid var(--border)' }} className="hide-mobile">
          <div className="container" style={{ display: 'flex', gap: '24px', padding: '0 16px', overflowX: 'auto' }}>
            <Link to="/products" style={{ padding: '10px 0', fontSize: '14px', fontWeight: '500', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>All Products</Link>
            <Link to="/category/honey" style={{ padding: '10px 0', fontSize: '14px', fontWeight: '500', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>Honey</Link>
            <Link to="/category/oil-ghee" style={{ padding: '10px 0', fontSize: '14px', fontWeight: '500', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>Oil & Ghee</Link>
            <Link to="/category/dates" style={{ padding: '10px 0', fontSize: '14px', fontWeight: '500', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>Dates</Link>
            <Link to="/category/spices" style={{ padding: '10px 0', fontSize: '14px', fontWeight: '500', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>Spices</Link>
            <Link to="/category/organic" style={{ padding: '10px 0', fontSize: '14px', fontWeight: '500', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>Organic</Link>
            <Link to="/category/mango" style={{ padding: '10px 0', fontSize: '14px', fontWeight: '500', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>Mango</Link>
            <Link to="/category/nuts-seeds" style={{ padding: '10px 0', fontSize: '14px', fontWeight: '500', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>Nuts & Seeds</Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 200
        }} onClick={() => setMobileOpen(false)}>
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0,
            width: '280px', background: '#fff', padding: '24px',
            overflowY: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '18px', fontWeight: '700' }}>Menu</span>
              <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none' }}>
                <FiX size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Link to="/products" onClick={() => setMobileOpen(false)} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)', fontWeight: '500' }}>All Products</Link>
              <Link to="/category/honey" onClick={() => setMobileOpen(false)} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>Honey</Link>
              <Link to="/category/oil-ghee" onClick={() => setMobileOpen(false)} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>Oil & Ghee</Link>
              <Link to="/category/dates" onClick={() => setMobileOpen(false)} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>Dates</Link>
              <Link to="/category/spices" onClick={() => setMobileOpen(false)} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>Spices</Link>
              <Link to="/category/organic" onClick={() => setMobileOpen(false)} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>Organic</Link>
              <Link to="/category/mango" onClick={() => setMobileOpen(false)} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>Mango</Link>

              <div style={{ height: '1px', background: 'var(--border)', margin: '8px 0' }} />

              {user ? (
                <>
                  <Link to="/account" onClick={() => setMobileOpen(false)} style={{ padding: '12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiUser /> My Account
                  </Link>
                  <Link to="/orders" onClick={() => setMobileOpen(false)} style={{ padding: '12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiPackage /> My Orders
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setMobileOpen(false)} style={{ padding: '12px 0', color: 'var(--primary-dark)', fontWeight: '600' }}>
                      Admin Panel
                    </Link>
                  )}
                  <button onClick={handleLogout} style={{
                    padding: '12px 0', background: 'none', border: 'none',
                    textAlign: 'left', color: '#dc2626', fontWeight: '500'
                  }}>Logout</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMobileOpen(false)} style={{ padding: '12px 0', color: 'var(--primary-dark)', fontWeight: '600' }}>
                  Login / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
