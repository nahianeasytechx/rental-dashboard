import React, { useState, useEffect } from 'react';

const ExpenseCategoryReport = () => {
  const [categories, setCategories] = useState([]);
  const [bills, setBills] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    loadData();

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
      } else {
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
        setCategories(defaultCategories);
        localStorage.setItem('expenseCategories', JSON.stringify(defaultCategories));
      }

      // Load bills
      const storedBills = localStorage.getItem('bills');
      if (storedBills) {
        setBills(JSON.parse(storedBills));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

const calculateCategoryStats = () => {
  const filteredBills = bills.filter(
    b => b.month === selectedMonth && b.year === selectedYear
  );

  if (selectedCategory === 'all') {
    return categories.map(cat => {
      const totalAmount = filteredBills.reduce((sum, bill) => sum + (bill[cat.id] || 0), 0);
      const paidAmount = filteredBills
        .filter(b => b.status === 'Received')
        .reduce((sum, bill) => sum + (bill[cat.id] || 0), 0);
      const dueAmount = filteredBills
        .filter(b => b.status === 'Pending')
        .reduce((sum, bill) => sum + (bill[cat.id] || 0), 0);

      return {
        ...cat,
        totalAmount,
        paidAmount,
        dueAmount,
        billCount: filteredBills.filter(b => (b[cat.id] || 0) > 0).length, // ✅ fixed
      };
    });
  } else {
    const cat = categories.find(c => c.id === selectedCategory);
    if (!cat) return [];

    const totalAmount = filteredBills.reduce((sum, bill) => sum + (bill[cat.id] || 0), 0);
    const paidAmount = filteredBills
      .filter(b => b.status === 'Received')
      .reduce((sum, bill) => sum + (bill[cat.id] || 0), 0);
    const dueAmount = filteredBills
      .filter(b => b.status === 'Pending')
      .reduce((sum, bill) => sum + (bill[cat.id] || 0), 0);

    return [{
      ...cat,
      totalAmount,
      paidAmount,
      dueAmount,
      billCount: filteredBills.filter(b => (b[cat.id] || 0) > 0).length,
      bills: filteredBills.filter(b => (b[cat.id] || 0) > 0),
    }];
  }
};


  const categoryStats = calculateCategoryStats();
  const selectedCategoryData = categoryStats[0];

  const ChartIcon = () => (
    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
    </svg>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading category report...</div>
      </div>
    );
  }

  return (
    <div className="container lg:py-4 px-8 mx-auto mt-20 lg:mt-0">
      {/* Header */}
      <div className="flex space-x-4 py-4">
        <div className="text-4xl border border-gray-300 rounded-lg pt-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <ChartIcon />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Category Expense Report</h1>
          <p className="text-gray-600 text-sm">
            View detailed reports for each category - Total, Paid, and Due amounts
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-gray-700 font-semibold">Filter by:</span>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.type})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Month:</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
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
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
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

      {selectedCategory === 'all' ? (
        // Show all categories summary
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">All Categories Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
            {categoryStats.map((stat) => (
              <div
                key={stat.id}
                className="bg-white border border-gray-100 rounded-xl shadow-md p-5 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{stat.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      stat.type === 'income' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {stat.type}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Collection:</span>
                    <span className="text-lg font-bold text-gray-900">৳{stat.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Paid:</span>
                    <span className="text-lg font-semibold text-green-600">৳{stat.paidAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Due:</span>
                    <span className="text-lg font-semibold text-red-600">৳{stat.dueAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedCategory(stat.id)}
                    className="w-full text-center text-sm text-orange-600 hover:text-orange-700 font-medium cursor-pointer"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Show detailed view for selected category
        selectedCategoryData && (
          <div>
            <div className="bg-white border border-gray-100 rounded-xl shadow-md p-6 mb-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedCategoryData.name}</h2>
                  <span className={`inline-block mt-2 text-xs px-3 py-1 rounded-full ${
                    selectedCategoryData.type === 'income' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {selectedCategoryData.type}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 text-sm font-medium transition-colors cursor-pointer"
                >
                  ← Back to All
                </button>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700 font-medium mb-1">Total Collection</p>
                  <p className="text-3xl font-bold text-blue-900">৳{selectedCategoryData.totalAmount.toLocaleString()}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700 font-medium mb-1">Paid Amount</p>
                  <p className="text-3xl font-bold text-green-900">৳{selectedCategoryData.paidAmount.toLocaleString()}</p>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-lg border border-red-200">
                  <p className="text-sm text-red-700 font-medium mb-1">Due Amount</p>
                  <p className="text-3xl font-bold text-red-900">৳{selectedCategoryData.dueAmount.toLocaleString()}</p>
                </div>
              </div>

              {/* Detailed Bills Table */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Bill Details</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Flat No</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Owner</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedCategoryData.bills && selectedCategoryData.bills.length > 0 ? (
                        selectedCategoryData.bills.map((bill) => (
                          <tr key={bill.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{bill.flatNo}</td>
                            <td className="px-4 py-3 text-gray-700">{bill.owner}</td>
                            <td className="px-4 py-3 font-semibold text-gray-900">
                              ৳{(bill[selectedCategoryData.id] || 0).toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-gray-700">{bill.date || 'N/A'}</td>
                            <td className="px-4 py-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                bill.status === 'Received'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {bill.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                            No bills found for this category in the selected period
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )
      )}

      {/* Info Note */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          <strong>Note:</strong> This report shows the collection status for each category. 
          <strong> Total Collection</strong> is the sum of all bills (both paid and pending), 
          <strong> Paid Amount</strong> includes only received payments, and 
          <strong> Due Amount</strong> shows pending payments. Select a specific category from the dropdown to view detailed bill-wise breakdown.
        </p>
      </div>
    </div>
  );
};

export default ExpenseCategoryReport;