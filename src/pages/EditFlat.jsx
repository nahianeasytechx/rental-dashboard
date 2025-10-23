import React, { useState } from "react";

const EditFlat = ({ flatId, onBack }) => {
  // Sample flat data - in real app, fetch based on flatId
  const flatDataInitial = {
    1: { flatNo: "A-101", ownerName: "Ahmed Khan", phoneNumber: "+880 1712-345678" },
    2: { flatNo: "A-102", ownerName: "Fatima Rahman", phoneNumber: "+880 1823-456789" },
    3: { flatNo: "B-201", ownerName: "Karim Hossain", phoneNumber: "+880 1934-567890" },
    4: { flatNo: "B-202", ownerName: "Nusrat Jahan", phoneNumber: "+880 1645-678901" },
    5: { flatNo: "C-301", ownerName: "Rahim Uddin", phoneNumber: "+880 1756-789012" },
    6: { flatNo: "C-302", ownerName: "Salma Begum", phoneNumber: "+880 1867-890123" },
    7: { flatNo: "D-401", ownerName: "Nasir Ahmed", phoneNumber: "+880 1978-901234" },
    8: { flatNo: "D-402", ownerName: "Taslima Akter", phoneNumber: "+880 1589-012345" },
  };

  const [formData, setFormData] = useState(flatDataInitial[flatId] || {
    flatNo: "",
    ownerName: "",
    phoneNumber: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.flatNo.trim()) {
      newErrors.flatNo = "Flat number is required";
    }

    if (!formData.ownerName.trim()) {
      newErrors.ownerName = "Owner name is required";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^(\+880|880)?[0-9]{10,11}$/.test(formData.phoneNumber.replace(/[\s-]/g, ""))) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Updating flat:", { flatId, formData });
      alert("Flat information updated successfully!");
      onBack();
    }
  };

  const EditIcon = () => (
    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
    </svg>
  );

  const ArrowLeftIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );

  const SaveIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );

  return (
    <div className="container lg:py-4 px-8 mx-auto mt-20 lg:mt-0">
      <div className="flex items-center space-x-4 py-4">
        {/* <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeftIcon />
          <span>Back</span>
        </button> */}
        <div className="text-4xl rounded-lg text-white p-2 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
          <EditIcon />
        </div>
        <h1 className="text-3xl font-bold">Edit Flat</h1>
      </div>

      <div className="my-6 bg-white border border-gray-100 rounded-xl shadow-xl p-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Flat Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="flatNo"
              value={formData.flatNo}
              onChange={handleInputChange}
              placeholder="e.g., A-101"
              className={`w-full px-4 py-3 border ${
                errors.flatNo ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 ${
                errors.flatNo ? "focus:ring-red-500" : "focus:ring-blue-500"
              } focus:border-transparent transition-all`}
            />
            {errors.flatNo && (
              <p className="mt-1 text-sm text-red-500">{errors.flatNo}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Owner Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleInputChange}
              placeholder="e.g., Ahmed Khan"
              className={`w-full px-4 py-3 border ${
                errors.ownerName ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 ${
                errors.ownerName ? "focus:ring-red-500" : "focus:ring-blue-500"
              } focus:border-transparent transition-all`}
            />
            {errors.ownerName && (
              <p className="mt-1 text-sm text-red-500">{errors.ownerName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="+880 1712-345678"
              className={`w-full px-4 py-3 border ${
                errors.phoneNumber ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 ${
                errors.phoneNumber ? "focus:ring-red-500" : "focus:ring-blue-500"
              } focus:border-transparent transition-all`}
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Format: +880 1XXXXXXXXX or 01XXXXXXXXX
            </p>
          </div>
        </div>

        <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 cursor-pointer transition-all ease-in-out duration-300 active:scale-95 py-3 px-6 bg-gray-200 hover:bg-gray-300 rounded-lg shadow-md text-gray-700 font-semibold"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 flex items-center justify-center gap-2 cursor-pointer transition-all ease-in-out duration-300 active:scale-95 py-3 px-6 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-lg shadow-lg text-white font-semibold"
          >
            <SaveIcon />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditFlat;