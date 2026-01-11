import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const Settings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: '', email: '' });
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  useEffect(() => {
    // Get user data from localStorage or API
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setFormData({ name: userData.name, email: userData.email });
    } else {
      // Redirect to login if no user data found
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8080/api/v1/user/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Profile updated successfully!');
        setMessageType('success');
        
        // Update local storage with new user data
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message || 'Failed to update profile');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Server error. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Header loggedinUser={user.name} handleSignout={handleSignout} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Settings
              </h1>
              <p className="text-gray-600">Update your profile information</p>
            </div>

            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                messageType === 'success' 
                  ? 'bg-green-100 border border-green-200 text-green-700' 
                  : 'bg-red-100 border border-red-200 text-red-700'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter your email address"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
                
                <button
                  type="button"
                  onClick={() => setFormData({ name: user.name, email: user.email })}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Account Status</h3>
                  <p className="text-sm text-gray-600">Member since {new Date().toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-600">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
