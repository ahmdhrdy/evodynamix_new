"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Login failed');
      }

      localStorage.setItem('adminToken', result.token);
      showNotification('Login successful!', 'success');
      setTimeout(() => router.push('/admin/dashboard'), 1000);
    } catch (error) {
      showNotification(error.message || 'Error occurred during login.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#1A1A2E] flex items-center justify-center py-16">
      {notification && (
        <div className={`fixed top-16 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg text-white z-[1000] ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {notification.message}
        </div>
      )}
      <div className="bg-[#2A2A3D] rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-[#00C4B4] mb-6 text-center">Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-white mb-2">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full p-3 bg-[#1A1A2E] text-white rounded-lg border border-gray-600 focus:outline-none focus:border-[#00C4B4] transition duration-300"
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-white mb-2">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-3 bg-[#1A1A2E] text-white rounded-lg border border-gray-600 focus:outline-none focus:border-[#00C4B4] transition duration-300"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-gradient-to-r from-[#00C4B4] to-[#007BFF] text-white px-6 py-3 rounded-lg hover:from-[#00A399] hover:to-[#0066CC] transition duration-300 transform hover:scale-105 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <button
          onClick={handleBackToHome}
          className="w-full mt-4 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition duration-300 transform hover:scale-105"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}