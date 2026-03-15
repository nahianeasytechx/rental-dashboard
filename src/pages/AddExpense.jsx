import React, { useState } from "react";
import {
  FaPlus,
  FaMoneyBillWave,
  FaMinusCircle,
  FaCalendarAlt,
  FaDollarSign,
  FaRegFileAlt,
  FaTrash,
} from "react-icons/fa";
import { FcSalesPerformance } from "react-icons/fc";
import { useApp } from "../context/AppContext";
import Swal from "sweetalert2";

const AddExpense = () => {
  const { addExpense, expenses, deleteExpense, categories, addCategory } = useApp();
  
  const [expenseData, setExpenseData] = useState({
    category: "",
    amount: "",
    date: "",
    description: "",
  });

  const handleAddExpense = () => {
    if (!expenseData.category || !expenseData.amount || !expenseData.date) {
      Swal.fire({
        icon: "error",
        title: "Missing Fields",
        text: "Please fill in category, amount, and date.",
        confirmButtonColor: "#ef4444"
      });
      return;
    }

    // Check if category exists, if not, add it
    const existingCat = categories.find(
      c => c.name.toLowerCase() === expenseData.category.toLowerCase() && c.type === 'expense'
    );
    
    let categoryId = existingCat ? existingCat.id : expenseData.category.toLowerCase().replace(/\s+/g, '_');
    
    if (!existingCat) {
      addCategory({
        id: categoryId,
        name: expenseData.category,
        type: 'expense'
      });
    }

    addExpense({
      categoryId: categoryId,
      category: expenseData.category,
      amount: parseFloat(expenseData.amount),
      date: expenseData.date,
      description: expenseData.description,
    });

    Swal.fire({
      icon: "success",
      title: "Success",
      text: "New expense record added successfully!",
      confirmButtonColor: "#ef4444"
    });
    
    setExpenseData({ category: "", amount: "", date: "", description: "" });
  };

  const handleDeleteExpense = (expense) => {
    Swal.fire({
      title: 'Delete Expense?',
      text: `Delete "${expense.category}" expense of ৳${expense.amount.toLocaleString()}? This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteExpense(expense.id);
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Expense record has been deleted.',
          confirmButtonColor: '#f97316',
          timer: 2000,
          timerProgressBar: true,
        });
      }
    });
  };

  // Sort expenses by date descending
  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="container lg:py-4 px-8 mx-auto mt-20 lg:mt-0">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex space-x-4 py-4">
          <FcSalesPerformance className="text-4xl  border border-gray-300 rounded-lg p-2 bg-gradient-to-r from bg-purple-400 via-purple-500 to-purple-600" />
          <h1 className="text-3xl font-bold">Add Expense</h1>
        </div>
        <p className="text-gray-600 text-sm">
          Add your building's expenses efficiently
        </p>
      </div>

      <div className="max-w-xl mx-auto gap-5">

        {/* Add Expense */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-4">
            <div className="flex items-center gap-3 text-white">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <FaMinusCircle className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Add New Expense</h2>
                <p className="text-red-100 text-xs">
                  Record a new expense or bill payment
                </p>
              </div>
            </div>
          </div>

          <div className="p-5">
            {/* Expense Form */}
            <div className="mb-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-1">
                <FaRegFileAlt className="text-red-600" />
                Expense Category
              </label>
              <input
                type="text"
                placeholder="e.g., Maintenance, Electricity, Cleaning"
                value={expenseData.category}
                onChange={(e) =>
                  setExpenseData({ ...expenseData, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-red-500 focus:outline-none transition"
              />
            </div>

            <div className="mb-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-1">
                <FaDollarSign className="text-red-600" />
                Amount
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={expenseData.amount}
                onChange={(e) =>
                  setExpenseData({ ...expenseData, amount: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-red-500 focus:outline-none transition"
              />
            </div>

            <div className="mb-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-1">
                <FaCalendarAlt className="text-red-600" />
                Date
              </label>
              <input
                type="date"
                value={expenseData.date}
                onChange={(e) =>
                  setExpenseData({ ...expenseData, date: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-red-500 focus:outline-none transition"
              />
            </div>

            <div className="mb-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-1">
                <FaRegFileAlt className="text-red-600" />
                Description
              </label>
              <textarea
                placeholder="Optional note or description"
                value={expenseData.description}
                onChange={(e) =>
                  setExpenseData({ ...expenseData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-red-500 focus:outline-none transition resize-none text-sm"
                rows={2}
              />
            </div>

            <button
              onClick={handleAddExpense}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-2 px-4 rounded-md font-medium text-sm hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 hover:shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <FaMinusCircle /> Add Expense
            </button>
          </div>
        </div>
      </div>

      {/* Existing Expenses List */}
      <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-white">
            <FaMoneyBillWave />
            <h2 className="text-lg font-semibold">Existing Expenses</h2>
          </div>
          <span className="text-gray-300 text-sm">{sortedExpenses.length} records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold text-gray-600 uppercase">Category</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-600 uppercase">Amount</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-600 uppercase">Description</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-600 uppercase text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedExpenses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-gray-400 italic">
                    No expenses recorded yet.
                  </td>
                </tr>
              ) : (
                sortedExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3 font-semibold text-gray-800">{exp.category}</td>
                    <td className="px-5 py-3 font-mono font-bold text-red-600">৳{exp.amount.toLocaleString()}</td>
                    <td className="px-5 py-3 text-gray-600">{exp.date}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{exp.description || '—'}</td>
                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={() => handleDeleteExpense(exp)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors cursor-pointer"
                        title="Delete Expense"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;
