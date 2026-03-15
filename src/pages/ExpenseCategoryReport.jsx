import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash, FaTimes, FaSave } from 'react-icons/fa';

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
  const { bills, expenses, categories, deleteBill, updateBill, deleteExpense, updateCategory, deleteCategory } = useApp();
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Edit Modal State
  const [editingBill, setEditingBill] = useState(null);
  const [editFormData, setEditFormData] = useState({ amount: '', date: '' });

  const handleEditClick = (bill) => {
    setEditingBill(bill);
    setEditFormData({
      amount: bill[selectedCategory] || 0,
      date: bill.date || ''
    });
  };

  const handleSaveEdit = () => {
    if (!editingBill || !editFormData.amount || !editFormData.date) return;
    
    // Update the specific category amount on the bill object
    updateBill(editingBill.id, {
      [selectedCategory]: parseFloat(editFormData.amount),
      date: editFormData.date
    });
    
    Swal.fire({
      icon: 'success',
      title: 'Updated!',
      text: 'Bill record updated successfully.',
      timer: 1500,
      showConfirmButton: false
    });
    setEditingBill(null);
  };

  // Category Edit Modal State
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({ name: '', type: 'expense' });

  const handleEditCategoryClick = (cat, e) => {
    e.stopPropagation();
    setEditingCategory(cat);
    setCategoryFormData({ name: cat.name, type: cat.type });
  };

  const handleSaveCategory = () => {
    if (!editingCategory || !categoryFormData.name) return;
    updateCategory(editingCategory.id, categoryFormData);
    Swal.fire({
      icon: 'success',
      title: 'Updated!',
      text: 'Category updated successfully.',
      timer: 1500,
      showConfirmButton: false
    });
    setEditingCategory(null);
  };

  const handleDeleteCategoryClick = (cat, e) => {
    e.stopPropagation();
    
    // Check if category is used in any bills or expenses
    const isUsedInBills = bills.some(b => (b[cat.id] || 0) > 0);
    const isUsedInExpenses = expenses.some(exp => exp.categoryId === cat.id || (exp.category && exp.category.toLowerCase() === cat.name.toLowerCase()));
    
    if (isUsedInBills || isUsedInExpenses) {
      Swal.fire({
        title: 'Delete Category & Records?',
        text: `This category has existing records. Are you sure you want to delete "${cat.name}"? This will also remove the category from all bills showing this expense.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, delete it all!',
      }).then((result) => {
        if (result.isConfirmed) {
          
          // Delete expenses linked completely
          expenses.forEach(exp => {
             if(exp.categoryId === cat.id || (exp.category && exp.category.toLowerCase() === cat.name.toLowerCase())) {
                 deleteExpense(exp.id);
             }
          });

          deleteCategory(cat.id);
          Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Category and its records deleted.', confirmButtonColor: '#f97316', timer: 2000, showConfirmButton: false });
        }
      });
      return;
    }

    Swal.fire({
      title: 'Delete Category?',
      text: `Are you sure you want to delete the "${cat.name}" category?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCategory(cat.id);
        Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Category deleted.', confirmButtonColor: '#f97316', timer: 2000, showConfirmButton: false });
      }
    });
  };

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
  
  // Filter standalone expenses by month/year (parsing the date string YYYY-MM-DD)
  const filteredExpenses = expenses.filter(e => {
    if (!e.date) return false;
    const [y, m] = e.date.split('-');
    return parseInt(m) === selectedMonth && parseInt(y) === selectedYear;
  });

  if (selectedCategory === 'all') {
    return categories.map(cat => {
      // If it's an expense category, we pull from `filteredExpenses` instead of `bills`
      if (cat.type === 'expense') {
        // Find matching expenses by category name (case-insensitive) or categoryId
        const catExpenses = filteredExpenses.filter(
          e => e.categoryId === cat.id || (e.category && e.category.toLowerCase() === cat.name.toLowerCase())
        );
        const totalAmount = catExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
        
        return {
          ...cat,
          totalAmount,
          paidAmount: totalAmount, // Expenses are considered fully paid for reporting
          dueAmount: 0,
          billCount: catExpenses.length,
        };
      } else {
        // Income category: Pull from tenant bills
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
          billCount: filteredBills.filter(b => (b[cat.id] || 0) > 0).length,
        };
      }
    });
  } else {
    // Single category selected
    const cat = categories.find(c => c.id === selectedCategory);
    if (!cat) return [];

    if (cat.type === 'expense') {
      const catExpenses = filteredExpenses.filter(
        e => e.categoryId === cat.id || (e.category && e.category.toLowerCase() === cat.name.toLowerCase())
      );
      const totalAmount = catExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
      
      // Map expenses into a "bill-like" shape for the table to render
      const mappedBills = catExpenses.map(exp => ({
        id: exp.id,
        flatNo: 'Building/Common', // Since this is a building expense, no specific flat applies
        owner: exp.description || 'Facility Expense',
        [cat.id]: exp.amount,
        date: exp.date,
        status: 'Paid',
        isExpenseRecord: true // flag to prevent edit/delete using bill APIs
      }));

      return [{
        ...cat,
        totalAmount,
        paidAmount: totalAmount,
        dueAmount: 0,
        billCount: catExpenses.length,
        bills: mappedBills,
      }];
    } else {
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
                    <h3 className="text-lg font-bold text-gray-800 pr-8">{stat.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      stat.type === 'income' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {stat.type}
                    </span>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => handleEditCategoryClick(stat, e)}
                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-1.5 rounded-md transition-colors"
                        title="Edit Category"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={(e) => handleDeleteCategoryClick(stat, e)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-md transition-colors"
                        title="Delete Category"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
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
                                bill.status === 'Received' || bill.status === 'Paid'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {bill.status}
                              </span>
                            </td>
                            {isAdmin && !bill.isExpenseRecord && (
                              <td className="px-4 py-3 text-center">
                                <div className="flex justify-center gap-2">
                                  <button
                                    onClick={() => handleEditClick(bill)}
                                    className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors cursor-pointer"
                                    title="Edit Bill"
                                  >
                                    <FaEdit className="w-4 h-4" />
                                  </button>
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
                                    className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors cursor-pointer"
                                    title="Delete Bill"
                                  >
                                    <FaTrash className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            )}
                            {isAdmin && bill.isExpenseRecord && (
                              <td className="px-4 py-3 text-center">
                                <div className="flex justify-center flex-col items-center gap-2 relative group">
                                  <button
                                    onClick={() => {
                                      Swal.fire({
                                        title: 'Delete Expense?',
                                        text: `Delete this facility expense completely? This cannot be undone.`,
                                        icon: 'warning',
                                        showCancelButton: true,
                                        confirmButtonColor: '#ef4444',
                                        cancelButtonColor: '#6b7280',
                                        confirmButtonText: 'Yes, delete!',
                                      }).then((result) => {
                                        if (result.isConfirmed) {
                                          deleteExpense(bill.id);
                                          Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Expense record deleted.', confirmButtonColor: '#f97316', timer: 2000, timerProgressBar: true });
                                        }
                                      });
                                    }}
                                    className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors cursor-pointer"
                                    title="Delete Entire Expense Record"
                                  >
                                    <FaTrash className="w-4 h-4" />
                                  </button>
                                </div>
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
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 no-print">
        <p className="text-blue-800 text-sm">
          <strong>Note:</strong> This report shows the collection status for each category. 
          <strong> Total Collection</strong> is the sum of all bills (both paid and pending), 
          <strong> Paid Amount</strong> includes only received payments, and 
          <strong> Due Amount</strong> shows pending payments. Select a specific category from the dropdown to view detailed bill-wise breakdown.
        </p>
      </div>

      {/* Edit Modal */}
      {editingBill && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg">Edit Bill Record</h3>
              <button 
                onClick={() => setEditingBill(null)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="flex justify-between text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span><strong>Flat:</strong> {editingBill.flatNo}</span>
                <span><strong>Owner:</strong> {editingBill.owner}</span>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Amount for {selectedCategoryData?.name} (৳)
                </label>
                <input
                  type="number"
                  value={editFormData.amount}
                  onChange={(e) => setEditFormData({...editFormData, amount: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={editFormData.date}
                  onChange={(e) => setEditFormData({...editFormData, date: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setEditingBill(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
              >
                <FaSave /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg">Edit Category</h3>
              <button 
                onClick={() => setEditingCategory(null)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({...categoryFormData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  placeholder="e.g. Electricity Bill"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={categoryFormData.type}
                  onChange={(e) => setCategoryFormData({...categoryFormData, type: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                >
                  <option value="income">Income (Tenant Bills)</option>
                  <option value="expense">Expense (Building Costs)</option>
                </select>
              </div>
            </div>

            <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setEditingCategory(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCategory}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 flex items-center gap-2 transition-colors"
              >
                <FaSave /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseCategoryReport;