import React, { useState } from "react";

const AddBill = ({ flatId, onBack }) => {
  // Sample flat data - in real app, fetch based on flatId
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
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
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
        {/* <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeftIcon />
          <span>Back</span>
        </button> */}
        <div className="text-4xl rounded-lg text-white p-2 bg-gradient-to-r from-green-400 via-green-500 to-green-600">
          <ReceiptIcon />
        </div>
        <h1 className="text-3xl font-bold">Add Bill</h1>
      </div>

      {/* Owner Info Card */}
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

      {/* Bill Form */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-xl p-6">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Bill Details</h2>

        {/* Month and Year Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Month
            </label>
            <select
              name="month"
              value={billData.month}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Year
            </label>
            <select
              name="year"
              value={billData.year}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bill Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Internet Bill (৳)
            </label>
            <input
              type="number"
              name="internetBill"
              value={billData.internetBill}
              onChange={handleInputChange}
              placeholder="0.00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dish Bill (৳)
            </label>
            <input
              type="number"
              name="dishBill"
              value={billData.dishBill}
              onChange={handleInputChange}
              placeholder="0.00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Association Flat Rent (৳)
            </label>
            <input
              type="number"
              name="associationFlatRent"
              value={billData.associationFlatRent}
              onChange={handleInputChange}
              placeholder="0.00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Common Current Bill (৳)
            </label>
            <input
              type="number"
              name="commonCurrentBill"
              value={billData.commonCurrentBill}
              onChange={handleInputChange}
              placeholder="0.00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Community Center Rent (৳)
            </label>
            <input
              type="number"
              name="communityCenterRent"
              value={billData.communityCenterRent}
              onChange={handleInputChange}
              placeholder="0.00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rooftop Room Rent (৳)
            </label>
            <input
              type="number"
              name="rooftopRoomRent"
              value={billData.rooftopRoomRent}
              onChange={handleInputChange}
              placeholder="0.00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Development (৳)
            </label>
            <input
              type="number"
              name="development"
              value={billData.development}
              onChange={handleInputChange}
              placeholder="0.00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Total */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-800">Total Amount:</span>
            <span className="text-2xl font-bold text-green-600">৳ {calculateTotal().toFixed(2)}</span>
          </div>
        </div>

        {/* Generate Invoice Button */}
        <div className="flex justify-end">
          <button
            onClick={handleGenerateInvoice}
            className="flex items-center gap-2 cursor-pointer transition-all ease-in-out duration-300 active:scale-95 py-3 px-8 bg-gradient-to-r from-green-500 via-green-600 to-green-700 rounded-lg shadow-lg text-white font-semibold text-lg"
          >
            <ReceiptIcon />
            <span>Generate Invoice</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBill;