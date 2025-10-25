import React, { useState, useEffect } from "react";

const AddBill = ({ flatId = 1, onBack }) => {
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

  const [categories, setCategories] = useState([]);
  const [billData, setBillData] = useState({
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

  useEffect(() => {
    loadCategories();
    
    // Listen for category updates
    const handleCategoryUpdate = () => {
      loadCategories();
    };
    
    window.addEventListener('categoriesUpdated', handleCategoryUpdate);
    
    return () => {
      window.removeEventListener('categoriesUpdated', handleCategoryUpdate);
    };
  }, []);

  const loadCategories = () => {
    const stored = localStorage.getItem('expenseCategories');
    if (stored) {
      const cats = JSON.parse(stored);
      setCategories(cats);
      
      // Initialize billData with all categories
      const initialData = { 
        month: new Date().getMonth() + 1, 
        year: new Date().getFullYear() 
      };
      cats.forEach(cat => {
        initialData[cat.id] = '';
      });
      setBillData(initialData);
    } else {
      // Initialize default categories
      const defaultCategories = [
        { id: 'rentFee', name: 'Rent Fee', type: 'income', default: true },
        { id: 'internetBill', name: 'Internet Bill', type: 'expense', default: true },
        { id: 'dishBill', name: 'Dish Bill', type: 'expense', default: true },
        { id: 'associationFlatRent', name: 'Association Flat Rent', type: 'income', default: true },
        { id: 'commonCurrentBill', name: 'Common Current Bill', type: 'income', default: true },
        { id: 'communityCenterRent', name: 'Community Center Rent', type: 'income', default: true },
        { id: 'rooftopRoomRent', name: 'Rooftop Room Rent', type: 'income', default: true },
        { id: 'development', name: 'Development', type: 'income', default: true },
      ];
      console.log('Initializing default categories:', defaultCategories);
      setCategories(defaultCategories);
      localStorage.setItem('expenseCategories', JSON.stringify(defaultCategories));

      const initialData = { 
        month: new Date().getMonth() + 1, 
        year: new Date().getFullYear() 
      };
      defaultCategories.forEach(cat => {
        initialData[cat.id] = '';
      });
      setBillData(initialData);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillData({ ...billData, [name]: value });
  };

  const calculateTotal = () => {
    let total = 0;
    categories.forEach(cat => {
      total += parseFloat(billData[cat.id] || 0);
    });
    return total;
  };

  const handleGenerateInvoice = async () => {
    try {
      let bills = [];
      const stored = localStorage.getItem('bills');
      if (stored) {
        bills = JSON.parse(stored);
      }

      const newBill = {
        id: Date.now(),
        owner: flat.ownerName,
        flatNo: flat.flatNo,
        phoneNumber: flat.phoneNumber,
        year: parseInt(billData.year),
        month: parseInt(billData.month),
        date: new Date().toISOString().split('T')[0],
        status: "Pending",
        type: "Monthly Bill",
        createdAt: new Date().toISOString(),
      };

      // Add all category values to the bill
      categories.forEach(cat => {
        newBill[cat.id] = parseFloat(billData[cat.id] || 0);
      });

      newBill.total = calculateTotal();

      bills.push(newBill);
      localStorage.setItem('bills', JSON.stringify(bills));

      alert("Invoice generated successfully!");
      
      // Reset form
      const resetData = { 
        month: new Date().getMonth() + 1, 
        year: new Date().getFullYear() 
      };
      categories.forEach(cat => {
        resetData[cat.id] = '';
      });
      setBillData(resetData);
    } catch (error) {
      console.error('Error saving bill:', error);
      alert('Error saving bill. Please try again.');
    }
  };

  const ReceiptIcon = () => (
    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18 17H6v-2h12v2zm0-4H6v-2h12v2zm0-4H6V7h12v2zM3 22l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2 4.5 3.5 3 2v20z"/>
    </svg>
  );

  return (
    <div className="container lg:py-4 px-8 mx-auto mt-20 lg:mt-0">
      <div className="flex items-center space-x-4 py-4">
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

        {/* Dynamic Bill Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {categories.map(cat => (
            <div key={cat.id}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {cat.name} (৳)
                <span className={`ml-2 text-xs ${cat.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  [{cat.type}]
                </span>
              </label>
              <input
                type="number"
                name={cat.id}
                value={billData[cat.id] || ''}
                onChange={handleInputChange}
                placeholder="0.00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          ))}
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