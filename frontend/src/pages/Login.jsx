import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(`/${redirect}` === '/login' ? '/' : `/${redirect}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
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
          <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Sign in to your account</p>
        </div>

        {error && (
          <div style={{
            padding: '12px', background: '#fee2e2', borderRadius: 'var(--radius-sm)',
            color: '#dc2626', fontSize: '14px', marginBottom: '16px'
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <div style={{ position: 'relative' }}>
              <FiMail style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type="email" className="form-input" placeholder="your@email.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '40px' }} required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <FiLock style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type={showPass ? 'text' : 'password'} className="form-input"
                placeholder="Enter password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '40px', paddingRight: '40px' }} required
              />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{
                position: 'absolute', right: '12px', top: '10px', background: 'none', border: 'none'
              }}>
                {showPass ? <FiEyeOff color="var(--text-muted)" /> : <FiEye color="var(--text-muted)" />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary-dark)', fontWeight: '600' }}>Register</Link>
        </div>

        <div style={{ marginTop: '16px', padding: '12px', background: '#f0fdf4', borderRadius: 'var(--radius-sm)', fontSize: '13px' }}>
          <strong>Demo Admin:</strong> admin@gorerbazar.com / admin123
        </div>
      </div>
    </div>
  );
};

export default Login;
