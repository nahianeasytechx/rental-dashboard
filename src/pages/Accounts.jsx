import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Accounts = () => {
  const [bills, setBills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadData();
    
    // Listen for category updates
    const handleCategoryUpdate = () => {
      loadData();
    };
    
    window.addEventListener('categoriesUpdated', handleCategoryUpdate);
    
    return () => {
      window.removeEventListener('categoriesUpdated', handleCategoryUpdate);
    };
  }, []);

  const loadData = () => {
    try {
      // Load categories
      const storedCategories = localStorage.getItem('expenseCategories');
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      }

      // Load bills
      const stored = localStorage.getItem('bills');
      if (stored) {
        setBills(JSON.parse(stored));
      } else {
        // Initialize with dummy data
        const dummyData = [
          {
            id: 1,
            owner: "Mr. Rahman",
            flatNo: "A-101",
            year: 2025,
            month: 10,
            rentFee: 15000,
            internetBill: 800,
            dishBill: 300,
            associationFlatRent: 1200,
            commonCurrentBill: 1200,
            communityCenterRent: 500,
            rooftopRoomRent: 700,
            development: 500,
            total: 20200,
            status: "Pending",
            type: "Rent Payment",
            date: "2025-10-01",
          },
          {
            id: 2,
            owner: "Mrs. Akter",
            flatNo: "B-202",
            year: 2025,
            month: 10,
            rentFee: 16000,
            internetBill: 750,
            dishBill: 350,
            associationFlatRent: 1000,
            commonCurrentBill: 1000,
            communityCenterRent: 600,
            rooftopRoomRent: 650,
            development: 700,
            total: 21050,
            status: "Received",
            type: "Service Charge",
            date: "2025-10-02",
          },
          {
            id: 3,
            owner: "Mr. Hasan",
            flatNo: "C-303",
            year: 2025,
            month: 10,
            rentFee: 14000,
            internetBill: 600,
            dishBill: 250,
            associationFlatRent: 900,
            commonCurrentBill: 900,
            communityCenterRent: 550,
            rooftopRoomRent: 600,
            development: 400,
            total: 18200,
            status: "Received",
            type: "Electricity Bill",
            date: "2025-10-05",
          },
          {
            id: 4,
            owner: "Mrs. Khan",
            flatNo: "A-102",
            year: 2025,
            month: 10,
            rentFee: 15000,
            internetBill: 850,
            dishBill: 300,
            associationFlatRent: 1100,
            commonCurrentBill: 1100,
            communityCenterRent: 500,
            rooftopRoomRent: 0,
            development: 500,
            total: 19350,
            status: "Received",
            type: "Maintenance",
            date: "2025-10-07",
          },
        ];
        setBills(dummyData);
        localStorage.setItem('bills', JSON.stringify(dummyData));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // Filter bills by selected month and year
  const filteredBills = bills.filter(
    bill => bill.month === selectedMonth && bill.year === selectedYear
  );

  // Calculate summary based on filtered bills and dynamic categories
  const calculateSummary = () => {
    const incomeCategories = categories.filter(c => c.type === 'income');
    const expenseCategories = categories.filter(c => c.type === 'expense');

    let totalRentCollected = 0;
    let serviceChargeCollected = 0;
    let totalExpense = 0;
    let maintenanceFund = 0;
    let donationDevelopment = 0;

    filteredBills.filter(b => b.status === "Received").forEach(bill => {
      // Rent Fee (specific category)
      totalRentCollected += (bill.rentFee || 0);
      
      // Service Charge (specific category for backwards compatibility)
      serviceChargeCollected += (bill.serviceCharge || bill.internetBill || 0);
      
      // Maintenance Fund (common bill)
      maintenanceFund += (bill.commonBill || bill.commonCurrentBill || 0);
      
      // Donation/Development
      donationDevelopment += (bill.donation || 0) + (bill.development || 0);
      
      // All expenses
      expenseCategories.forEach(cat => {
        totalExpense += (bill[cat.id] || 0);
      });
    });

    const pendingBills = filteredBills
      .filter(b => b.status === "Pending")
      .reduce((sum, b) => sum + (b.total || 0), 0);

    const totalRevenue = filteredBills
      .filter(b => b.status === "Received")
      .reduce((sum, b) => sum + (b.total || 0), 0);

    return {
      totalRentCollected,
      pendingBills,
      serviceChargeCollected,
      totalRevenue,
      maintenanceFund,
      donationDevelopment,
    };
  };

  const summary = calculateSummary();

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

  const summaryCards = [
    {
      title: "Total Rent Collected",
      amount: `৳${summary.totalRentCollected.toLocaleString()}`,
      color: "from-green-500 to-green-600",
      icon: "home",
    },
    {
      title: "Pending Bills",
      amount: `৳${summary.pendingBills.toLocaleString()}`,
      color: "from-red-500 to-red-600",
      icon: "exclamation",
    },
    {
      title: "Service Charge Collected",
      amount: `৳${summary.serviceChargeCollected.toLocaleString()}`,
      color: "from-blue-500 to-blue-600",
      icon: "clipboard",
    },
    {
      title: "Total Revenue",
      amount: `৳${summary.totalRevenue.toLocaleString()}`,
      color: "from-indigo-500 to-indigo-600",
      icon: "chart",
    },
    {
      title: "Maintenance Fund",
      amount: `৳${summary.maintenanceFund.toLocaleString()}`,
      color: "from-purple-500 to-purple-600",
      icon: "building",
    },
    {
      title: "Donation / Development",
      amount: `৳${summary.donationDevelopment.toLocaleString()}`,
      color: "from-pink-500 to-pink-600",
      icon: "hand",
    },
  ];

  const getIcon = (iconName) => {
    switch(iconName) {
      case "home":
        return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>;
      case "exclamation":
        return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
      case "clipboard":
        return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>;
      case "chart":
        return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>;
      case "building":
        return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" /></svg>;
      case "hand":
        return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.664 1.319a.75.75 0 01.672 0 41.059 41.059 0 018.198 5.424.75.75 0 01-.254 1.285 31.372 31.372 0 00-7.86 3.83.75.75 0 01-.84 0 31.508 31.508 0 00-2.08-1.287V9.394c0-.244.116-.463.302-.592a35.504 35.504 0 013.305-2.033.75.75 0 00-.714-1.319 37 37 0 00-3.446 2.12A2.216 2.216 0 006 9.393v.38a31.293 31.293 0 00-4.28-1.746.75.75 0 01-.254-1.285 41.059 41.059 0 018.198-5.424zM6 11.459a29.848 29.848 0 00-2.455-1.158 41.029 41.029 0 00-.39 3.114.75.75 0 00.419.74c.528.256 1.046.53 1.554.82-.21.324-.455.63-.739.914a.75.75 0 101.06 1.06c.37-.369.69-.77.96-1.193a26.61 26.61 0 013.095 2.348.75.75 0 00.992 0 26.547 26.547 0 015.93-3.95.75.75 0 00.42-.739 41.053 41.053 0 00-.39-3.114 29.925 29.925 0 00-5.199 2.801 2.25 2.25 0 01-2.514 0c-.41-.275-.826-.541-1.25-.797a6.985 6.985 0 01-1.084 3.45 26.503 26.503 0 00-1.409-.933z" clipRule="evenodd" /></svg>;
      default:
        return null;
    }
  };

  const MoneyIcon = () => (
    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
    </svg>
  );

  const WalletIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
      <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
    </svg>
  );

  return (
    <div className="container lg:py-4 px-8 mx-auto mt-20 lg:mt-0">
      {/* Header */}
      <div className="flex space-x-4 py-4">
        <div className="text-4xl border border-gray-300 rounded-lg p-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <MoneyIcon />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Accounts Overview</h1>
          <p className="text-gray-600 text-sm">
            Track all financial activities, collections, and revenue details.
          </p>
        </div>
      </div>

      {/* Date Filter */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-gray-700 font-semibold">Filter by:</span>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Month:</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Year:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {summaryCards.map((card, index) => (
          <div
            key={index}
            className="group relative bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
          >
            <div
              className={`absolute top-4 right-4 p-3 rounded-full bg-gradient-to-r ${card.color} text-white shadow-md transform transition-transform duration-300 group-hover:rotate-45`}
            >
              {getIcon(card.icon)}
            </div>
            <h2 className="text-gray-700 text-sm font-semibold">{card.title}</h2>
            <p className="text-2xl font-bold text-gray-900 mt-2">{card.amount}</p>
          </div>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="bg-white border rounded-xl border-gray-100 shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Recent Transactions</h2>
          <div className="text-2xl text-blue-600">
            <WalletIcon />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-900 text-white font-semibold text-xs uppercase">
              <tr>
                <th className="px-6 py-3">Flat No</th>
                <th className="px-6 py-3">Owner</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No transactions found for the selected month and year
                  </td>
                </tr>
              ) : (
                filteredBills.slice(0, 4).map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-b-gray-300 hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-3">{item.flatNo}</td>
                    <td className="px-6 py-3">{item.owner}</td>
                    <td className="px-6 py-3">{item.type || "Bill Payment"}</td>
                    <td className="px-6 py-3 font-semibold text-gray-900">৳{item.total.toLocaleString()}</td>
                    <td className="px-6 py-3">{item.date}</td>
                    <td className="px-6 py-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.status === "Received"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4">
<Link to="/statements">
          <button className="cursor-pointer transition-all ease-in-out duration-300 active:scale-95 py-2 px-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-lg text-white text-sm">
            Get a Statement
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Accounts;