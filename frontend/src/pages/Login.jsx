import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('Bangalore');
  const [role, setRole] = useState('customer'); // Default role
  const [error, setError] = useState('');
  const [loadingMsg, setLoadingMsg] = useState('');

  const { user, login, register } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/portal');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password || (!isLoginTab && !name)) {
      setError('Please fill in all fields');
      return;
    }

    setLoadingMsg(isLoginTab ? 'Authenticating...' : 'Creating account...');

    try {
      let result;
      if (isLoginTab) {
        result = await login(email, password);
      } else {
        result = await register(name, email, password, role, city);
      }

      if (!result.success) {
        setError(result.message || 'Verification failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoadingMsg('');
    }
  };

  // Helper to prefill test credentials
  const fillTestCredentials = (type) => {
    if (type === 'admin') {
      setEmail('admin@rentease.com');
      setPassword('admin123');
      setIsLoginTab(true);
    } else {
      setEmail('user@rentease.com');
      setPassword('user123');
      setIsLoginTab(true);
    }
  };

  return (
    <div className="container" style={{
      minHeight: '75vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 0',
    }}>
      <div className="glass fade-in" style={{
        width: '100%',
        maxWidth: '450px',
        padding: '36px',
        boxShadow: 'var(--shadow-lg), var(--shadow-neon)',
        borderRadius: 'var(--radius-lg)',
      }}>
        {/* Tab Headers */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '28px',
        }}>
          <button
            onClick={() => { setIsLoginTab(true); setError(''); }}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              borderBottom: isLoginTab ? '3px solid var(--color-primary)' : 'none',
              color: isLoginTab ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '1.1rem',
              paddingBottom: '12px',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsLoginTab(false); setError(''); }}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              borderBottom: !isLoginTab ? '3px solid var(--color-primary)' : 'none',
              color: !isLoginTab ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '1.1rem',
              paddingBottom: '12px',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            Register
          </button>
        </div>

        <h2 style={{
          fontFamily: 'var(--font-secondary)',
          fontSize: '1.6rem',
          fontWeight: 700,
          marginBottom: '20px',
          textAlign: 'center',
        }}>
          {isLoginTab ? 'Welcome Back' : 'Join RentEase'}
        </h2>

        {error && (
          <div className="badge badge-danger" style={{
            display: 'block',
            padding: '10px',
            marginBottom: '20px',
            textAlign: 'center',
            borderRadius: 'var(--radius-sm)',
            textTransform: 'none',
            fontWeight: '600',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!isLoginTab && (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {!isLoginTab && (
            <>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Default City</label>
                <select
                  className="form-control"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  <option value="Bangalore">Bangalore</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Pune">Pune</option>
                  <option value="Chennai">Chennai</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Account Role</label>
                <select
                  className="form-control"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="customer">Customer (Renter)</option>
                  <option value="admin">Platform Administrator</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '10px', height: '46px' }}
            disabled={loadingMsg !== ''}
          >
            {loadingMsg || (isLoginTab ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        {/* Demo Fast Login Tooltips */}
        <div style={{
          marginTop: '32px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-color)',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '12px' }}>
            ⚡ Demo Quick Sign In
          </span>
          <div className="flex-center" style={{ gap: '12px' }}>
            <button
              onClick={() => fillTestCredentials('customer')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.8rem' }}
            >
              Customer Account
            </button>
            <button
              onClick={() => fillTestCredentials('admin')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.8rem' }}
            >
              Admin Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
