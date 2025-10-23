import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

// AddBill Component
const AddBill = () => {
  const navigate = useNavigate();
  const { flatId } = useParams();
  
  const flatData = {
    1: { flatNo: "A-101", ownerName: "Ahmed Khan", phoneNumber: "+880 1712-345678" },
    2: { flatNo: "A-102", ownerName: "Fatima Rahman", phoneNumber: "+880 1823-456789" },
    3: { flatNo: "B-201", ownerName: "Karim Hossain", phoneNumber: "+880 1934-567890" },
    4: { flatNo: "B-202", ownerName: "Nusrat Jahan", phoneNumber: "+880 1645-678901" },
    5: { flatNo: "C-301", ownerName: "Rahim Uddin", phoneNumber: "+880 1756-789012" },
    6: { flatNo: "C-302", ownerName: "Salma Begum", phoneNumber: "+880 1867-890123" },
    7: { flatNo: "D-401", ownerName: "Nasir Ahmed", phoneNumber: "+880 1978-901234" },
    8: { flatNo: "D-402", ownerName: "Taslima Akter", phoneNumber: "+880 1589-012345" },
  };

  const flat = flatData[flatId] || {};

  const [billData, setBillData] = useState({
    internetBill: "",
    dishBill: "",
    associationFlatRent: "",
    commonCurrentBill: "",
    communityCenterRent: "",
    rooftopRoomRent: "",
    development: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const months = [
    { value: 1, label: "January" }, { value: 2, label: "February" },
    { value: 3, label: "March" }, { value: 4, label: "April" },
    { value: 5, label: "May" }, { value: 6, label: "June" },
    { value: 7, label: "July" }, { value: 8, label: "August" },
    { value: 9, label: "September" }, { value: 10, label: "October" },
    { value: 11, label: "November" }, { value: 12, label: "December" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillData({ ...billData, [name]: value });
  };

  const calculateTotal = () => {
    return (
      parseFloat(billData.internetBill || 0) +
      parseFloat(billData.dishBill || 0) +
      parseFloat(billData.associationFlatRent || 0) +
      parseFloat(billData.commonCurrentBill || 0) +
      parseFloat(billData.communityCenterRent || 0) +
      parseFloat(billData.rooftopRoomRent || 0) +
      parseFloat(billData.development || 0)
    );
  };

  const handleGenerateInvoice = () => {
    console.log("Generating invoice for:", { flatId, flat, billData, total: calculateTotal() });
    alert("Invoice generated successfully!");
  };

  const ReceiptIcon = () => (
    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18 17H6v-2h12v2zm0-4H6v-2h12v2zm0-4H6V7h12v2zM3 22l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2 4.5 3.5 3 2v20z"/>
    </svg>
  );

  const ArrowLeftIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );

  return (
    <div className="container lg:py-4 px-8 mx-auto mt-20 lg:mt-0">
      <div className="flex items-center space-x-4 py-4">

        <div className="text-4xl rounded-lg text-white p-2 bg-gradient-to-r from-orange-500  to-orange-600">
          <ReceiptIcon />
        </div>
        <h1 className="text-3xl font-bold">Add Bill</h1>
      </div>

      <div className="my-6 bg-white border border-gray-100 rounded-xl shadow-xl p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Owner Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500 font-medium">Flat Number</p>
            <p className="text-lg text-gray-800 font-semibold">{flat.flatNo}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Owner Name</p>
            <p className="text-lg text-gray-800 font-semibold">{flat.ownerName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Phone Number</p>
            <p className="text-lg text-gray-800 font-semibold">{flat.phoneNumber}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-xl p-6">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Bill Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Month</label>
            <select name="month" value={billData.month} onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
              {months.map((month) => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Year</label>
            <select name="year" value={billData.year} onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Internet Bill (৳)</label>
            <input type="number" name="internetBill" value={billData.internetBill} onChange={handleInputChange}
              placeholder="0.00" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dish Bill (৳)</label>
            <input type="number" name="dishBill" value={billData.dishBill} onChange={handleInputChange}
              placeholder="0.00" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Association Flat Rent (৳)</label>
            <input type="number" name="associationFlatRent" value={billData.associationFlatRent} onChange={handleInputChange}
              placeholder="0.00" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Common Current Bill (৳)</label>
            <input type="number" name="commonCurrentBill" value={billData.commonCurrentBill} onChange={handleInputChange}
              placeholder="0.00" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Community Center Rent (৳)</label>
            <input type="number" name="communityCenterRent" value={billData.communityCenterRent} onChange={handleInputChange}
              placeholder="0.00" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rooftop Room Rent (৳)</label>
            <input type="number" name="rooftopRoomRent" value={billData.rooftopRoomRent} onChange={handleInputChange}
              placeholder="0.00" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Development (৳)</label>
            <input type="number" name="development" value={billData.development} onChange={handleInputChange}
              placeholder="0.00" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-800">Total Amount:</span>
            <span className="text-2xl font-bold text-green-600">৳ {calculateTotal().toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={handleGenerateInvoice}
            className="flex items-center gap-2 cursor-pointer transition-all ease-in-out duration-300 active:scale-95 py-3 px-8 bg-gradient-to-r from-green-500 via-green-600 to-green-700 rounded-lg shadow-lg text-white font-semibold text-lg">
            <ReceiptIcon />
            <span>Generate Invoice</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// EditFlat Component
const EditFlat = () => {
  const navigate = useNavigate();
  const { flatId } = useParams();
  
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
    if (!formData.flatNo.trim()) newErrors.flatNo = "Flat number is required";
    if (!formData.ownerName.trim()) newErrors.ownerName = "Owner name is required";
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
      navigate('/all-flat');
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
        {/* <button onClick={() => navigate('/all-flat')} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
          <ArrowLeftIcon />
          <span>Back</span>
        </button> */}
        <div className="text-4xl rounded-lg text-white p-2 bg-gradient-to-r from-orange-500 to-orange-600 ">
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
            <input type="text" name="flatNo" value={formData.flatNo} onChange={handleInputChange}
              placeholder="e.g., A-101"
              className={`w-full px-4 py-3 border ${errors.flatNo ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 ${errors.flatNo ? "focus:ring-red-500" : "focus:ring-blue-500"} focus:border-transparent transition-all`} />
            {errors.flatNo && <p className="mt-1 text-sm text-red-500">{errors.flatNo}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Owner Name <span className="text-red-500">*</span>
            </label>
            <input type="text" name="ownerName" value={formData.ownerName} onChange={handleInputChange}
              placeholder="e.g., Ahmed Khan"
              className={`w-full px-4 py-3 border ${errors.ownerName ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 ${errors.ownerName ? "focus:ring-red-500" : "focus:ring-blue-500"} focus:border-transparent transition-all`} />
            {errors.ownerName && <p className="mt-1 text-sm text-red-500">{errors.ownerName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange}
              placeholder="+880 1712-345678"
              className={`w-full px-4 py-3 border ${errors.phoneNumber ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 ${errors.phoneNumber ? "focus:ring-red-500" : "focus:ring-blue-500"} focus:border-transparent transition-all`} />
            {errors.phoneNumber && <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>}
            <p className="mt-1 text-xs text-gray-500">Format: +880 1XXXXXXXXX or 01XXXXXXXXX</p>
          </div>
        </div>

        <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
          <button type="button" onClick={() => navigate('/all-flat')}
            className="flex-1 cursor-pointer transition-all ease-in-out duration-300 active:scale-95 py-3 px-6 bg-gray-200 hover:bg-gray-300 rounded-lg shadow-md text-gray-700 font-semibold">
            Cancel
          </button>
          <button type="button" onClick={handleSubmit}
            className="flex-1 flex items-center justify-center gap-2 cursor-pointer transition-all ease-in-out duration-300 active:scale-95 py-3 px-6 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-lg shadow-lg text-white font-semibold">
            <SaveIcon />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Main AllFlat Component
const AllFlat = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const [flats] = useState([
    { id: 1, flatNo: "A-101", ownerName: "Ahmed Khan", phoneNumber: "+880 1712-345678" },
    { id: 2, flatNo: "A-102", ownerName: "Fatima Rahman", phoneNumber: "+880 1823-456789" },
    { id: 3, flatNo: "B-201", ownerName: "Karim Hossain", phoneNumber: "+880 1934-567890" },
    { id: 4, flatNo: "B-202", ownerName: "Nusrat Jahan", phoneNumber: "+880 1645-678901" },
    { id: 5, flatNo: "C-301", ownerName: "Rahim Uddin", phoneNumber: "+880 1756-789012" },
    { id: 6, flatNo: "C-302", ownerName: "Salma Begum", phoneNumber: "+880 1867-890123" },
    { id: 7, flatNo: "D-401", ownerName: "Nasir Ahmed", phoneNumber: "+880 1978-901234" },
    { id: 8, flatNo: "D-402", ownerName: "Taslima Akter", phoneNumber: "+880 1589-012345" },
  ]);

  const filteredFlats = flats.filter(
    (flat) =>
      flat.flatNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flat.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flat.phoneNumber.includes(searchQuery)
  );

  const handleEdit = (flatId) => {
    navigate(`/all-flat/edit-flat/${flatId}`);
  };

  const handleAddBill = (flatId) => {
    navigate(`/all-flat/add-bill/${flatId}`);
  };

  const HomeIcon = () => (
    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
  );

  const EditIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
    </svg>
  );

  const ReceiptIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18 17H6v-2h12v2zm0-4H6v-2h12v2zm0-4H6V7h12v2zM3 22l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2 4.5 3.5 3 2v20z"/>
    </svg>
  );

  return (
    <div className="container lg:py-4 px-8 mx-auto mt-20 lg:mt-0">
      <div className="flex space-x-4 py-4">
        <div className="text-4xl rounded-lg text-white p-2 bg-gradient-to-r from-orange-500 to-orange-600">
          <HomeIcon />
        </div>
        <h1 className="text-3xl font-bold">All Flats</h1>
      </div>

      <div className="my-6">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by flat no, owner name, or phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredFlats.map((flat) => (
          <div key={flat.id} className="bg-white border border-gray-100 rounded-xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 rounded-lg">
                <HomeIcon />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{flat.flatNo}</h3>
            </div>

            <div className="space-y-2 mb-4">
              <div>
                <p className="text-xs text-gray-500 font-medium">Owner Name</p>
                <p className="text-sm text-gray-800 font-semibold">{flat.ownerName}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-medium">Phone Number</p>
                <p className="text-sm text-gray-800 font-semibold">{flat.phoneNumber}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(flat.id)}
                className="flex-1 flex items-center justify-center gap-1.5 cursor-pointer transition-all ease-in-out duration-300 active:scale-95 py-2 px-3 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-lg shadow-lg text-white text-sm font-medium"
              >
                <EditIcon />
                <span>Edit</span>
              </button>

              <button
                onClick={() => handleAddBill(flat.id)}
                className="flex-1 flex items-center justify-center gap-1.5 cursor-pointer transition-all ease-in-out duration-300 active:scale-95 py-2 px-3 bg-gradient-to-r from-green-500 via-green-600 to-green-700 rounded-lg shadow-lg text-white text-sm font-medium"
              >
                <ReceiptIcon />
                <span>Bill</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredFlats.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No flats found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default AllFlat;
export { AddBill, EditFlat };