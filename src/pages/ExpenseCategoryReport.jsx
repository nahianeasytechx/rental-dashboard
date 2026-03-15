import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

// Inject print styles once
const PRINT_STYLE_ID = 'expense-report-print-style';
if (!document.getElementById(PRINT_STYLE_ID)) {
  const style = document.createElement('style');
  style.id = PRINT_STYLE_ID;
  style.innerHTML = `
    @media print {
      body * { visibility: hidden !important; }
      #expense-print-area, #expense-print-area * { visibility: visible !important; }
      #expense-print-area { position: fixed; top: 0; left: 0; width: 100%; padding: 24px; background: white; z-index: 9999; }
      .no-print { display: none !important; }
    }
  `;
  document.head.appendChild(style);
}

const ExpenseCategoryReport = () => {
  const { bills, categories, deleteBill } = useApp();
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

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

  const monthLabel = months.find(m => m.value === selectedMonth)?.label || '';

  const handlePrint = () => {
    if (!selectedCategoryData) return;

    const bills = selectedCategoryData.bills || [];
    const rowsHtml = bills.length > 0
      ? bills.map((bill, i) => `
          <tr style="background:${i % 2 === 0 ? '#ffffff' : '#f9fafb'}">
            <td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;font-weight:500">${bill.flatNo}</td>
            <td style="padding:10px 14px;border-bottom:1px solid #e5e7eb">${bill.owner || '—'}</td>
            <td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;font-weight:600">&#2547;${(bill[selectedCategoryData.id] || 0).toLocaleString()}</td>
            <td style="padding:10px 14px;border-bottom:1px solid #e5e7eb">${bill.date || 'N/A'}</td>
            <td style="padding:10px 14px;border-bottom:1px solid #e5e7eb">
              <span style="padding:3px 10px;border-radius:999px;font-size:12px;font-weight:600;background:${bill.status === 'Received' ? '#dcfce7' : '#fee2e2'};color:${bill.status === 'Received' ? '#15803d' : '#dc2626'}">
                ${bill.status}
              </span>
            </td>
          </tr>`).join('')
      : `<tr><td colspan="5" style="padding:24px;text-align:center;color:#6b7280">No bills found for this period.</td></tr>`;

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <title>Expense Statement – ${selectedCategoryData.name} – ${monthLabel} ${selectedYear}</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #111827; background: #fff; padding: 40px; font-size: 14px; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; padding-bottom: 16px; border-bottom: 2px solid #f97316; }
          .header-left h1 { font-size: 24px; font-weight: 700; color: #111827; }
          .header-left p { font-size: 13px; color: #6b7280; margin-top: 4px; }
          .badge { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; margin-top: 8px; background: ${selectedCategoryData.type === 'income' ? '#dcfce7' : '#fee2e2'}; color: ${selectedCategoryData.type === 'income' ? '#15803d' : '#dc2626'}; }
          .header-right { text-align: right; }
          .header-right .company { font-size: 18px; font-weight: 700; color: #f97316; }
          .header-right .date { font-size: 12px; color: #6b7280; margin-top: 4px; }
          .summary { display: flex; gap: 16px; margin-bottom: 28px; }
          .summary-card { flex: 1; border-radius: 10px; padding: 16px 20px; }
          .summary-card p:first-child { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 6px; }
          .summary-card p:last-child { font-size: 22px; font-weight: 700; }
          .card-blue   { background: #eff6ff; border: 1px solid #bfdbfe; }
          .card-blue   p:first-child { color: #1d4ed8; }
          .card-blue   p:last-child  { color: #1e3a8a; }
          .card-green  { background: #f0fdf4; border: 1px solid #bbf7d0; }
          .card-green  p:first-child { color: #16a34a; }
          .card-green  p:last-child  { color: #14532d; }
          .card-red    { background: #fff1f2; border: 1px solid #fecdd3; }
          .card-red    p:first-child { color: #dc2626; }
          .card-red    p:last-child  { color: #7f1d1d; }
          h3 { font-size: 15px; font-weight: 700; color: #374151; margin-bottom: 12px; }
          table { width: 100%; border-collapse: collapse; }
          thead { background: #f3f4f6; }
          thead th { padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: #374151; border-bottom: 2px solid #e5e7eb; }
          .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; font-size: 12px; color: #9ca3af; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="header-left">
            <h1>${selectedCategoryData.name}</h1>
            <p>Category Expense Statement &bull; ${monthLabel} ${selectedYear}</p>
            <span class="badge">${selectedCategoryData.type}</span>
          </div>
          <div class="header-right">
            <div class="company">Rental Dashboard</div>
            <div class="date">Printed: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
        </div>

        <div class="summary">
          <div class="summary-card card-blue">
            <p>Total Collection</p>
            <p>&#2547;${selectedCategoryData.totalAmount.toLocaleString()}</p>
          </div>
          <div class="summary-card card-green">
            <p>Paid Amount</p>
            <p>&#2547;${selectedCategoryData.paidAmount.toLocaleString()}</p>
          </div>
          <div class="summary-card card-red">
            <p>Due Amount</p>
            <p>&#2547;${selectedCategoryData.dueAmount.toLocaleString()}</p>
          </div>
        </div>

        <h3>Bill Details</h3>
        <table>
          <thead>
            <tr>
              <th>Flat No</th>
              <th>Owner</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <div class="footer">
          <span>Total Records: ${bills.length}</span>
          <span>Category Expense Report – ${monthLabel} ${selectedYear}</span>
        </div>

        <script>
          window.onload = function() { window.print(); window.onafterprint = function() { window.close(); }; };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const ChartIcon = () => (
    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
    </svg>
  );



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
          <div id="expense-print-area">
            {/* Print Header - only visible when printing */}
            <div className="hidden print:block mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Expense Category Report</h1>
              <p className="text-gray-600 text-sm mt-1">Period: {monthLabel} {selectedYear}</p>
              <hr className="mt-3 border-gray-300" />
            </div>
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
                <div className="flex items-center gap-3 no-print">
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                      />
                    </svg>
                    Print Statement
                  </button>
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 text-sm font-medium transition-colors cursor-pointer"
                  >
                    ← Back to All
                  </button>
                </div>
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
                        {isAdmin && <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Action</th>}
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
                            {isAdmin && (
                              <td className="px-4 py-3 text-center">
                                <button
                                  onClick={() => {
                                    Swal.fire({
                                      title: 'Delete Bill?',
                                      text: `Delete bill for Flat ${bill.flatNo} (${bill.owner})? This cannot be undone.`,
                                      icon: 'warning',
                                      showCancelButton: true,
                                      confirmButtonColor: '#ef4444',
                                      cancelButtonColor: '#6b7280',
                                      confirmButtonText: 'Yes, delete!',
                                    }).then((result) => {
                                      if (result.isConfirmed) {
                                        deleteBill(bill.id);
                                        Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Bill deleted.', confirmButtonColor: '#f97316', timer: 2000, timerProgressBar: true });
                                      }
                                    });
                                  }}
                                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors cursor-pointer"
                                  title="Delete Bill"
                                >
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                                </button>
                              </td>
                            )}
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