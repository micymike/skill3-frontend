import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLinkedin, FaEye, FaEyeSlash } from 'react-icons/fa';

const apiUrl = ''; // Empty string to use proxy

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLinkedInLogin = () => {
    localStorage.setItem('loginRedirectUrl', window.location.href);
    window.location.href = '/v1/auth/linkedin/login';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', email);

        // Navigate based on next step
        if (data.nextStep) {
          navigate(`/onboarding/${data.nextStep}`);
        } else {
          navigate('/dashboard');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || errorData.msg || 'Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden md:flex w-1/2 bg-black relative overflow-hidden">
        <img
          src="/login.jpeg"
          alt="Login Illustration"
          className="absolute w-full h-full object-cover"
        />
      </div>

      {/* Right side - Login Form */}
      <div className="w-full md:w-1/2 bg-black p-8 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="space-y-8">
            {/* Logo and Header */}
            <div className="text-center space-y-4">
              <img
                src="/logo.png"
                alt="Skill3 Logo"
                className="h-20 w-20 mx-auto object-contain"
              />
              <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
              <p className="text-gray-400 text-lg">
                Sign in to continue your journey
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* LinkedIn Button */}
              <button
                type="button"
                onClick={handleLinkedInLogin}
                className="w-full flex items-center justify-center gap-2 bg-[#0077b5] text-white py-3 px-4 rounded-lg hover:bg-[#006291] transition-colors"
              >
                <FaLinkedin className="text-xl" />
                Sign in with LinkedIn
              </button>

              {/* Divider */}
              <div className="relative flex items-center">
                <div className="flex-grow border-t border-gray-700"></div>
                <span className="flex-shrink mx-4 text-gray-400">or</span>
                <div className="flex-grow border-t border-gray-700"></div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>

              {/* Sign Up Link */}
              <p className="text-center text-gray-400">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="text-blue-500 hover:text-blue-400 font-medium"
                >
                  Sign Up
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;