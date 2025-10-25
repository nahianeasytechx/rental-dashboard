import React, { useState } from "react";
import {
  FaPlus,
  FaMoneyBillWave,
  FaMinusCircle,
  FaCalendarAlt,
  FaDollarSign,
  FaRegFileAlt,
} from "react-icons/fa";
import { FcSalesPerformance } from "react-icons/fc";

const AddExpense = () => {
  const [incomeData, setIncomeData] = useState({
    source: "",
    amount: "",
    date: "",
    description: "",
  });

  const [expenseData, setExpenseData] = useState({
    category: "",
    amount: "",
    date: "",
    description: "",
  });


  const handleAddExpense = () => {
    console.log("Expense Data:", expenseData);
    alert("New expense record added successfully!");
  };

  return (
    <div className="container lg:py-4 px-8 mx-auto mt-20 lg:mt-0">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex space-x-4 py-4">
          <FcSalesPerformance className="text-4xl  border border-gray-300 rounded-lg p-2 bg-gradient-to-r from bg-purple-400 via-purple-500 to-purple-600" />
          <h1 className="text-3xl font-bold">Add Expense</h1>
        </div>
        <p className="text-gray-600 text-sm">
          Add  your building’s  expenses efficiently
        </p>
      </div>

      <div className="  max-w-xl mx-auto gap-5">

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
    </div>
  );
};

export default AddExpense;
