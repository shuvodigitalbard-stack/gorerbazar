import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match');
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
      <div style={{
        width: '100%', maxWidth: '420px', background: '#fff',
        borderRadius: 'var(--radius)', padding: '32px', boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', fontWeight: '800', color: '#fff', margin: '0 auto 12px'
          }}>G</div>
          <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Join Gorerbazar today</p>
        </div>

        {error && (
          <div style={{
            padding: '12px', background: '#fee2e2', borderRadius: 'var(--radius-sm)',
            color: '#dc2626', fontSize: '14px', marginBottom: '16px'
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <FiUser style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input type="text" name="name" className="form-input" placeholder="Your name"
                value={form.name} onChange={handleChange} style={{ paddingLeft: '40px' }} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <div style={{ position: 'relative' }}>
              <FiMail style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input type="email" name="email" className="form-input" placeholder="your@email.com"
                value={form.email} onChange={handleChange} style={{ paddingLeft: '40px' }} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Phone</label>
            <div style={{ position: 'relative' }}>
              <FiPhone style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input type="tel" name="phone" className="form-input" placeholder="01XXXXXXXXX"
                value={form.phone} onChange={handleChange} style={{ paddingLeft: '40px' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <FiLock style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input type={showPass ? 'text' : 'password'} name="password" className="form-input"
                placeholder="Min 6 characters" value={form.password} onChange={handleChange}
                style={{ paddingLeft: '40px', paddingRight: '40px' }} required minLength={6} />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{
                position: 'absolute', right: '12px', top: '10px', background: 'none', border: 'none'
              }}>
                {showPass ? <FiEyeOff color="var(--text-muted)" /> : <FiEye color="var(--text-muted)" />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input type="password" name="confirmPassword" className="form-input"
              placeholder="Confirm password" value={form.confirmPassword}
              onChange={handleChange} required minLength={6} />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary-dark)', fontWeight: '600' }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
