import React, { useState } from 'react';

const Settings = () => {
  const [username, setUsername] = useState('Nahian');
  const [phone, setPhone] = useState('+8801XXXXXXXXX');
  const [currentPassword] = useState('myCurrentPassword123'); // visible text
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (newPassword && newPassword !== confirmPassword) {
      setMessage('❌ New passwords do not match!');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setMessage('✅ Settings saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="container lg:py-12 px-8 mx-auto mt-20 lg:mt-0 min-h-screen flex justify-center items-start">
      <div className="w-full max-w-lg bg-white shadow-md rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Account Settings</h2>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <div className="relative w-28 h-28 mb-4">
              <img
                src={preview || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-4 border-orange-500"
              />
              <label
                htmlFor="profilePic"
                className="absolute bottom-0 right-0 bg-orange-600 text-white rounded-full p-2 cursor-pointer hover:bg-orange-700 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </label>
              <input
                id="profilePic"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition bg-white"
              placeholder="Enter your username"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition bg-white"
              placeholder="Enter your phone number"
            />
          </div>

          {/* Current Password (text & readonly) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <input
              type="text"
              value={currentPassword}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Change Password</label>
            <input
              type="text"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition bg-white"
              placeholder="Enter new password"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <input
              type="text"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition bg-white"
              placeholder="Confirm new password"
            />
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600  text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              Save Changes
            </button>
          </div>

          {/* Message */}
          {message && (
            <p
              className={`text-center font-medium mt-4 ${
                message.startsWith('✅') ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Settings;
