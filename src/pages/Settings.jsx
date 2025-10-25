import React, { useState } from 'react';
import { User, Phone, Lock, Mail, Camera } from 'lucide-react';

const Settings = () => {
  const [formData, setFormData] = useState({
    username: 'Nahian Ahmed',
    email: 'nahian@example.com',
    phone: '+880 1234-567890',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [preview, setPreview] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const handleSave = () => {
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      showNotification('Passwords do not match!', 'error');
      return;
    }
    showNotification('Settings updated successfully!', 'success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Account Settings</h1>
          <p className="text-slate-600">Manage your profile and account preferences</p>
        </div>

        {/* Notification */}
        {notification.show && (
          <div className={`mb-6 p-4 rounded-lg ${
            notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {notification.message}
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Current Profile */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-700 h-32"></div>
            <div className="px-8 pb-8">
              <div className="flex flex-col items-center -mt-16">
                <div className="relative">
                  <img
                    src={preview}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
                  />
                  <div className="absolute bottom-0 right-0 bg-orange-600 text-white p-2 rounded-full shadow-lg">
                    <User className="w-5 h-5" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mt-4">{formData.username}</h2>
                <p className="text-slate-500 text-sm">Active Account</p>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Mail className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Email Address</p>
                    <p className="text-slate-800 font-semibold">{formData.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Phone Number</p>
                    <p className="text-slate-800 font-semibold">{formData.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Lock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Password</p>
                    <p className="text-slate-800 font-semibold">••••••••••</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-orange-50 border-l-4 border-orange-600 rounded-lg">
                <p className="text-sm text-orange-800">
                  <span className="font-semibold">Account Status:</span> Your account is verified and active. Last updated today.
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel - Edit Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Update Information</h2>

            <div className="space-y-6">
              {/* Profile Photo */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Profile Photo</label>
                <div className="flex items-center gap-4">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-slate-200"
                  />
                  <label className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg cursor-pointer hover:bg-slate-700 transition">
                    <Camera className="w-4 h-4" />
                    <span className="text-sm font-medium">Change Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
                  placeholder="Enter your username"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
                  placeholder="Enter your email"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:orange-orange-200 outline-none transition"
                  placeholder="Enter your phone"
                />
              </div>

              {/* Divider */}
              <div className="border-t-2 border-slate-100 pt-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Change Password</h3>
              </div>

              {/* Current Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Current Password</label>
                <input
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => handleChange('currentPassword', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
                  placeholder="Enter current password"
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
                <input
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => handleChange('newPassword', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
                  placeholder="Enter new password"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
                  placeholder="Confirm new password"
                />
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;