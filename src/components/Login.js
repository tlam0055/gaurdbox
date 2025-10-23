import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

const Login = ({ onLogin, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data and token
        localStorage.setItem('user', JSON.stringify({
          email: formData.email,
          token: data.token,
          pqcPublicKey: data.pqc_public_key
        }));
        onLogin(data);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Connection error. Please check if the server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                    <div className="bg-primary text-white rounded d-flex align-items-center justify-content-center" 
                         style={{ width: '40px', height: '40px', fontSize: '18px', fontWeight: '600' }}>
                      GB
                    </div>
                    <h2 className="h4 fw-bold text-dark mb-0">GuardBox</h2>
                  </div>
                  <p className="text-muted">Sign in to your secure email account</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  {/* Email Field */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-medium">
                      Email Address
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <Mail size={18} className="text-muted" />
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-medium">
                      Password
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <Lock size={18} className="text-muted" />
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ) : (
                      <LogIn size={18} className="me-2" />
                    )}
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>

                {/* Switch to Register */}
                <div className="text-center mt-4">
                  <p className="text-muted mb-0">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      className="btn btn-link p-0 text-decoration-none"
                      onClick={onSwitchToRegister}
                    >
                      Create one here
                    </button>
                  </p>
                </div>

                {/* Demo Users Info */}
                <div className="mt-4 p-3 bg-light rounded">
                  <h6 className="fw-medium text-dark mb-2">Demo Users:</h6>
                  <div className="small text-muted">
                    <div><strong>testuser1@guardbox.com</strong> / password123</div>
                    <div><strong>testuser2@guardbox.com</strong> / password123</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
