import React, { useState, useEffect } from 'react';

const MonthlyStatements = () => {
  const [year, setYear] = useState('2025');
  const [selectedFlatNo, setSelectedFlatNo] = useState('all');
  const [bills, setBills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [flatNumbers, setFlatNumbers] = useState([]);
  const [loading, setLoading] = useState(true);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

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

  useEffect(() => {
    if (bills.length > 0 && categories.length > 0) {
      calculateMonthlyData();
    } else {
      setMonthlyData(months.map(month => ({
        month,
        totalCollection: 0,
        totalExpense: 0,
        totalProfit: 0,
        totalLoss: 0,
        bills: []
      })));
    }
  }, [bills, categories, year, selectedFlatNo]);

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
      const stored = localStorage.getItem('bills');
      if (stored) {
        const loadedBills = JSON.parse(stored);
        setBills(loadedBills);
        
        const uniqueFlats = [...new Set(loadedBills.map(b => b.flatNo).filter(f => f))];
        setFlatNumbers(uniqueFlats.sort());
      } else {
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
            status: "Received",
            date: "2025-10-01",
            type: "Monthly Bill"
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
            date: "2025-10-02",
            type: "Monthly Bill"
          },
          {
            id: 3,
            owner: "Mr. Hasan",
            flatNo: "C-303",
            year: 2025,
            month: 9,
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
            date: "2025-09-15",
            type: "Monthly Bill"
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
            status: "Pending",
            date: "2025-10-05",
            type: "Monthly Bill"
          },
        ];
        setBills(dummyData);
        setFlatNumbers(['A-101', 'A-102', 'B-202', 'C-303']);
        localStorage.setItem('bills', JSON.stringify(dummyData));
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setBills([]);
      setFlatNumbers([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlyData = () => {
    const incomeCategories = categories.filter(c => c.type === 'income');
    const expenseCategories = categories.filter(c => c.type === 'expense');

    const data = months.map((month, index) => {
      const monthNum = index + 1;

      let monthBills = bills.filter(b => 
        b.month === monthNum && b.year === parseInt(year)
      );

      if (selectedFlatNo !== 'all') {
        monthBills = monthBills.filter(b => b.flatNo === selectedFlatNo);
      }

      let totalCollection = 0;
      let totalExpense = 0;

      monthBills.filter(b => b.status === 'Received').forEach(bill => {
        incomeCategories.forEach(cat => {
          totalCollection += (bill[cat.id] || 0);
        });
        expenseCategories.forEach(cat => {
          totalExpense += (bill[cat.id] || 0);
        });
      });

      const netAmount = totalCollection - totalExpense;
      const totalProfit = netAmount > 0 ? netAmount : 0;
      const totalLoss = netAmount < 0 ? Math.abs(netAmount) : 0;

      return {
        month,
        totalCollection,
        totalExpense,
        totalProfit,
        totalLoss,
        bills: monthBills
      };
    });

    setMonthlyData(data);
  };

  const handleSearch = () => {
    calculateMonthlyData();
  };

  const viewStatement = (monthIndex) => {
    const monthData = monthlyData[monthIndex];
    const monthName = months[monthIndex];
    
    const flatInfo = selectedFlatNo === 'all' ? 'All Flats' : `Flat ${selectedFlatNo}`;
    
    let statement = `=== ${monthName} ${year} Statement ===\n`;
    statement += `${flatInfo}\n\n`;
    statement += `Total Collection: ৳${monthData.totalCollection.toLocaleString()}\n`;
    statement += `Total Expense: ৳${monthData.totalExpense.toLocaleString()}\n`;
    statement += `Total Profit: ৳${monthData.totalProfit.toLocaleString()}\n`;
    statement += `Total Loss: ৳${monthData.totalLoss.toLocaleString()}\n\n`;
    statement += `=== Bills ===\n`;
    
    if (monthData.bills.length === 0) {
      statement += 'No bills for this month.\n';
    } else {
      monthData.bills.forEach(b => {
        statement += `${b.date || 'N/A'} | ${b.owner} | Flat ${b.flatNo} | ৳${b.total.toLocaleString()} | ${b.status}\n`;
        
        categories.forEach(cat => {
          if (b[cat.id]) {
            statement += `  ${cat.name}: ৳${b[cat.id]} [${cat.type}]\n`;
          }
        });
      });
    }

    alert(statement);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading statements...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Monthly Statements</h1>
          <p className="text-gray-600">View monthly financial statements by year and flat number</p>
        </div>
        {/* Summary Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Year {year} Summary {selectedFlatNo !== 'all' && `- Flat ${selectedFlatNo}`}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Annual Collection</p>
              <p className="text-2xl font-bold text-green-600">
                ৳{monthlyData.reduce((sum, m) => sum + m.totalCollection, 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Annual Expense</p>
              <p className="text-2xl font-bold text-red-600">
                ৳{monthlyData.reduce((sum, m) => sum + m.totalExpense, 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Annual Profit</p>
              <p className="text-2xl font-bold text-green-600">
                ৳{monthlyData.reduce((sum, m) => sum + m.totalProfit, 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Annual Loss</p>
              <p className="text-2xl font-bold text-red-600">
                ৳{monthlyData.reduce((sum, m) => sum + m.totalLoss, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div> 

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Year:</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="2025"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Flat No:</label>
              <select
                value={selectedFlatNo}
                onChange={(e) => setSelectedFlatNo(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Flats</option>
                {flatNumbers.map(flat => (
                  <option key={flat} value={flat}>{flat}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        {/* Monthly Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Month</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total Collection</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total Expense</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total Profit</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total Loss</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Statement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {monthlyData.map((data, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900 font-medium">{data.month}</td>
                    <td className="px-6 py-4 text-green-600 font-semibold">৳{data.totalCollection.toLocaleString()}</td>
                    <td className="px-6 py-4 text-red-600 font-semibold">৳{data.totalExpense.toLocaleString()}</td>
                    <td className="px-6 py-4 text-green-600 font-semibold">৳{data.totalProfit.toLocaleString()}</td>
                    <td className="px-6 py-4 text-red-600 font-semibold">৳{data.totalLoss.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => viewStatement(index)}
                        disabled={data.bills.length === 0}
                        className={`px-6 py-2 rounded transition-colors text-sm ${
                          data.bills.length === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
                        }`}
                      >
                        View Statement
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>



        {/* Note */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> This page automatically calculates monthly statements from the bill data added via the "Add Bill" form. 
            You can filter by specific flat numbers or view all flats together. 
            <strong> Collections</strong> include all income categories you've defined (rent, service charges, etc.). 
            <strong> Expenses</strong> include all expense categories (utilities, bills, etc.). 
            The data updates automatically when you add new bills or categories.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MonthlyStatements;