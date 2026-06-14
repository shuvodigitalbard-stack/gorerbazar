import React from 'react';
import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiFacebook, FiInstagram } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer style={{ background: 'var(--bg-dark)', color: 'var(--text-light)', marginTop: '48px' }}>
      {/* Main Footer */}
      <div className="container" style={{ padding: '48px 16px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px' }}>
          {/* About */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'var(--gradient-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', fontWeight: '800', color: '#fff'
              }}>G</div>
              <span style={{ fontSize: '20px', fontWeight: '700' }}>Gorerbazar</span>
            </div>
            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.7, marginBottom: '16px' }}>
              Your trusted source for 100% natural and organic products. We bring the finest honey, ghee, dates, spices, and more directly to your doorstep.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="#" style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: '#fff'
              }}><FiFacebook size={18} /></a>
              <a href="#" style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: '#fff'
              }}><FiInstagram size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/" style={{ color: '#94a3b8', fontSize: '14px' }}>Home</Link>
              <Link to="/products" style={{ color: '#94a3b8', fontSize: '14px' }}>All Products</Link>
              <Link to="/category/honey" style={{ color: '#94a3b8', fontSize: '14px' }}>Honey</Link>
              <Link to="/category/dates" style={{ color: '#94a3b8', fontSize: '14px' }}>Dates</Link>
              <Link to="/category/organic" style={{ color: '#94a3b8', fontSize: '14px' }}>Organic</Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Categories</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/category/oil-ghee" style={{ color: '#94a3b8', fontSize: '14px' }}>Oil & Ghee</Link>
              <Link to="/category/spices" style={{ color: '#94a3b8', fontSize: '14px' }}>Spices</Link>
              <Link to="/category/nuts-seeds" style={{ color: '#94a3b8', fontSize: '14px' }}>Nuts & Seeds</Link>
              <Link to="/category/mango" style={{ color: '#94a3b8', fontSize: '14px' }}>Mango</Link>
              <Link to="/category/flours-lentils" style={{ color: '#94a3b8', fontSize: '14px' }}>Flours & Lentils</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Contact Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '14px' }}>
                <FiPhone size={16} /> 01700-000000
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '14px' }}>
                <FiMail size={16} /> info@gorerbazar.com
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#94a3b8', fontSize: '14px' }}>
                <FiMapPin size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <h5 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Payment Methods</h5>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '12px' }}>COD</span>
                <span style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '12px' }}>bKash</span>
                <span style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '12px' }}>Nagad</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '16px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <p style={{ fontSize: '13px', color: '#64748b' }}>
            &copy; 2026 Gorerbazar. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link to="/privacy" style={{ fontSize: '13px', color: '#64748b' }}>Privacy Policy</Link>
            <Link to="/terms" style={{ fontSize: '13px', color: '#64748b' }}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
