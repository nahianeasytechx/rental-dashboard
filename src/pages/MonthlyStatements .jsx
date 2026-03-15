import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const MonthlyStatements = () => {
  const { bills, categories, getAllFlatNumbers, flats } = useApp();
  const { currentUser } = useAuth();
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [selectedFlatNo, setSelectedFlatNo] = useState('all');
  const [monthlyData, setMonthlyData] = useState([]);
  const [selectedStatement, setSelectedStatement] = useState(null);
  
  const flatNumbers = currentUser?.role === 'client'
    ? flats.filter(f => f.phoneNumber === currentUser?.phone).map(f => f.flatNo)
    : getAllFlatNumbers();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

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

  const calculateMonthlyData = () => {
    const incomeCategories = categories.filter(c => c.type === 'income');
    const expenseCategories = categories.filter(c => c.type === 'expense');

    const data = months.map((month, index) => {
      const monthNum = index + 1;

      let monthBills = bills.filter(b => 
        b.month === monthNum && b.year === parseInt(year)
      );

      if (currentUser?.role === 'client') {
        monthBills = monthBills.filter(b => {
          const flat = flats.find(f => f.id === b.flatId || f.flatNo === b.flatNo);
          return flat && flat.phoneNumber === currentUser?.phone;
        });
      }

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
    setSelectedStatement({
      data: monthlyData[monthIndex],
      flatInfo: selectedFlatNo === 'all' ? 'All Flats' : `Flat ${selectedFlatNo}`
    });
  };

  const printStatement = () => {
    window.print();
  };

  const closeStatement = () => {
    setSelectedStatement(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      <div className="max-w-7xl mx-auto hide-on-print">
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
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 hide-on-print">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> This page automatically calculates monthly statements from the bill data added via the "Add Bill" form. 
            You can filter by specific flat numbers or view all flats together. 
            <strong> Collections</strong> include all income categories you've defined (rent, service charges, etc.). 
            <strong> Expenses</strong> include all expense categories (utilities, bills, etc.). 
            The data updates automatically when you add new bills or categories.
          </p>
        </div>
      </div>

      {/* Printable Statement Modal */}
      {selectedStatement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 transition-opacity">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col relative print:w-full print:h-screen print:rounded-none print:shadow-none print:max-w-none print:overflow-visible print:p-8">
            
            {/* Modal Header (Hidden on print) */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center hide-on-print z-10">
              <h2 className="text-lg font-bold text-gray-800">Monthly Statement</h2>
              <div className="flex gap-2">
                <button 
                  onClick={printStatement}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors cursor-pointer"
                >
                  Print
                </button>
                <button 
                  onClick={closeStatement}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium text-sm transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Statement Content (Printed area) */}
            <div className="p-8 bg-white" id="printable-statement">
              
              {/* Header */}
              <div className="text-center mb-8 border-b-2 border-gray-800 pb-6">
                <h1 className="text-3xl font-black text-gray-900 tracking-wider mb-2">ABASHON<span className="text-orange-500">X</span></h1>
                <p className="text-gray-600 text-sm font-medium">Monthly Financial Statement</p>
                <p className="text-gray-500 text-xs mt-1">123 Building Avenue, Dhaka, Bangladesh</p>
              </div>

              {/* Meta */}
              <div className="flex justify-between items-end mb-8 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Billing Period:</p>
                  <p className="font-mono font-bold text-gray-900">{selectedStatement.data.month} {year}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 mb-1">Scope:</p>
                  <p className="font-mono font-bold text-gray-900">{selectedStatement.flatInfo}</p>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                 <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Collections</p>
                    <p className="text-lg font-bold text-green-700">৳{selectedStatement.data.totalCollection.toLocaleString()}</p>
                 </div>
                 <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Expenses</p>
                    <p className="text-lg font-bold text-red-700">৳{selectedStatement.data.totalExpense.toLocaleString()}</p>
                 </div>
                 <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Profit</p>
                    <p className="text-lg font-bold text-green-700">৳{selectedStatement.data.totalProfit.toLocaleString()}</p>
                 </div>
                 <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Loss</p>
                    <p className="text-lg font-bold text-red-700">৳{selectedStatement.data.totalLoss.toLocaleString()}</p>
                 </div>
              </div>

              {/* Detailed Bills */}
              <div className="mb-8">
                <h3 className="text-md font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4">Detailed Breakdown</h3>
                {selectedStatement.data.bills.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No bills recorded for this period.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left py-2 px-3 text-gray-600 font-semibold text-xs border">Date</th>
                        <th className="text-left py-2 px-3 text-gray-600 font-semibold text-xs border">Owner/Flat</th>
                        <th className="text-left py-2 px-3 text-gray-600 font-semibold text-xs border">Status</th>
                        <th className="text-right py-2 px-3 text-gray-600 font-semibold text-xs border">Total (৳)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedStatement.data.bills.map(b => (
                        <tr key={b.id} className="border-b border-gray-200">
                          <td className="py-2 px-3 border">{b.date}</td>
                          <td className="py-2 px-3 border border-r-0 border-l-0 border-t-0 font-medium">{b.owner} <span className="text-gray-500 font-normal">(Flat {b.flatNo})</span></td>
                          <td className={`py-2 px-3 border border-r-0 border-l-0 border-t-0 font-semibold ${b.status === 'Received' ? 'text-green-600' : 'text-orange-600'}`}>{b.status}</td>
                          <td className="py-2 px-3 border border-r-0 border-l-0 border-t-0 text-right font-mono font-medium">৳{b.total.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Footer / Signatures */}
              <div className="mt-16 pt-8 flex justify-between px-4 pb-8 hide-on-print">
                <div className="text-center">
                  <div className="w-48 border-t border-gray-400 mb-2 mx-auto"></div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest">Authority Signature</p>
                </div>
              </div>
              <div className="mt-16 pt-8 justify-between px-4 pb-8 hidden print:flex">
                <div className="text-center">
                  <div className="w-48 border-t border-gray-400 mb-2 mx-auto"></div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest">Authority Signature</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Embedded CSS for Print Mode */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .hide-on-print {
            display: none !important;
          }
          #printable-statement, #printable-statement * {
            visibility: visible;
          }
          #printable-statement {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}} />
    </div>
  );
};

export default MonthlyStatements;