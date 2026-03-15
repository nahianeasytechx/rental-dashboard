import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { FaEdit, FaTimes, FaSave } from "react-icons/fa";

const BillRecordsTable = ({ limit = null, columns = null }) => {
  const { bills: allRecords, categories, flats, deleteBill, updateBill } = useApp();
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Define fixed columns
  const fixedColumns = [
    { key: "owner", label: "Owner's Name" },
    { key: "flatNo", label: "Flat No" },
    { key: "year", label: "Year" },
    { key: "month", label: "Month" },
  ];

  // Create dynamic columns from categories
  const dynamicColumns = categories.map(cat => ({
    key: cat.id,
    label: cat.name,
    type: cat.type
  }));

  // Fixed end columns
  const endColumns = [
    { key: "total", label: "Total" },
    { key: "status", label: "Status" },
  ];

  // Combine all columns
  const allColumns = [...fixedColumns, ...dynamicColumns, ...endColumns];

  // Apply column filter if provided
  const selectedColumns = columns
    ? allColumns.filter((col) => columns.includes(col.key))
    : allColumns;

  // Filter records based on role
  const userRecords = allRecords.filter(b => {
    if (currentUser?.role !== 'client') return true;
    
    // Check if the bill's flat matches the client's assigned flat
    const billFlatName = b.flatNo || '';
    
    if (currentUser.assignedFlat) {
      return billFlatName.toLowerCase() === currentUser.assignedFlat.toLowerCase();
    }
    
    // Fallback exactly as it was:
    const flat = flats.find(f => f.id === b.flatId || f.flatNo === b.flatNo);
    return flat && flat.phoneNumber === currentUser?.phone;
  });

  // Sort by date descending
  const sortedRecords = [...userRecords].sort((a, b) => new Date(b.date) - new Date(a.date));
  const displayRecords = limit ? sortedRecords.slice(0, limit) : sortedRecords;

  // Edit State
  const [editingBill, setEditingBill] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const handleEditClick = (bill) => {
    setEditingBill(bill);
    // Pre-fill form with bill data, defaulting missing category amounts to 0
    const formData = {
      date: bill.date || '',
      status: bill.status || 'Pending',
    };
    categories.forEach(cat => {
      formData[cat.id] = bill[cat.id] || 0;
    });
    setEditFormData(formData);
  };

  const handleSaveEdit = () => {
    if (!editingBill) return;

    // Recalculate total
    let newTotal = 0;
    categories.forEach(cat => {
      newTotal += parseFloat(editFormData[cat.id] || 0);
    });

    const updates = {
      ...editFormData,
      total: newTotal
    };

    // Parse all category amounts back to numbers
    categories.forEach(cat => {
      updates[cat.id] = parseFloat(editFormData[cat.id] || 0);
    });

    updateBill(editingBill.id, updates);

    Swal.fire({
      icon: 'success',
      title: 'Updated!',
      text: 'Bill record updated successfully.',
      timer: 1500,
      showConfirmButton: false
    });
    setEditingBill(null);
  };

  const handleDelete = (row) => {
    Swal.fire({
      title: 'Delete Bill?',
      text: `Delete bill for Flat ${row.flatNo} (${row.owner})? This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteBill(row.id);
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Bill record has been deleted.',
          confirmButtonColor: '#f97316',
          timer: 2000,
          timerProgressBar: true,
        });
      }
    });
  };

  const TrashIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
    </svg>
  );

  return (
    <div className="relative">
      <div className="overflow-x-auto bg-gray-300">
        <table className="w-full text-xs text-left text-gray-600">
          <thead className="text-white uppercase bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900">
            <tr>
              {selectedColumns.map((col) => (
                <th key={col.key} className="px-6 py-3 whitespace-nowrap">
                  {col.label}
                  {col.type && (
                    <span className={`ml-1 text-xs lowercase ${col.type === 'income' ? 'text-green-300' : 'text-red-300'}`}>
                      ({col.type})
                    </span>
                  )}
                </th>
              ))}
              {isAdmin && <th className="px-6 py-3 text-center whitespace-nowrap">Action</th>}
            </tr>
          </thead>
          <tbody>
            {displayRecords.length === 0 ? (
              <tr>
                <td colSpan={selectedColumns.length + (isAdmin ? 1 : 0)} className="px-6 py-8 text-center text-gray-500">
                  No bill records found
                </td>
              </tr>
            ) : (
              displayRecords.map((row, i) => (
                <tr
                  key={row.id || i}
                  className="bg-white border-b border-gray-200 hover:bg-gray-50 text-sm"
                >
                  {selectedColumns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-6 py-4 whitespace-nowrap ${
                        col.key === "total"
                          ? "font-semibold text-gray-900"
                          : col.key === "status"
                          ? row.status === "Received"
                            ? "text-green-600 font-medium"
                            : "text-red-600 font-medium"
                          : ""
                      }`}
                    >
                      {col.key === "month" && row[col.key] 
                        ? monthNames[row[col.key] - 1] 
                        : col.key === "total"
                        ? `৳${(row[col.key] || 0).toLocaleString()}`
                        : col.type
                        ? `৳${(row[col.key] || 0).toLocaleString()}`
                        : row[col.key] || 'N/A'}
                    </td>
                  ))}
                  {isAdmin && (
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(row)}
                          className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors cursor-pointer"
                          title="Edit Bill"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(row)}
                          className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors cursor-pointer"
                          title="Delete Bill"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {limit && userRecords.length > limit && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Showing {limit} of {userRecords.length} records
        </div>
      )}

      {/* Edit Modal */}
      {editingBill && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full overflow-hidden my-8">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg">Edit Bill Record (Flat {editingBill.flatNo})</h3>
              <button 
                onClick={() => setEditingBill(null)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Header Info */}
              <div className="flex justify-between text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span><strong>Owner:</strong> {editingBill.owner}</span>
                <span><strong>Period:</strong> {monthNames[editingBill.month - 1]} {editingBill.year}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Meta Inputs */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={editFormData.date}
                    onChange={(e) => setEditFormData({...editFormData, date: e.target.value})}
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Received">Received</option>
                  </select>
                </div>

                <div className="col-span-1 md:col-span-2 mt-2">
                  <h4 className="text-sm font-bold text-gray-800 border-b pb-2 mb-3">Category Amounts</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                    {categories.map(cat => (
                      <div key={cat.id} className="flex items-center justify-between gap-3">
                        <label className="text-sm font-medium text-gray-700 truncate flex-1" title={cat.name}>
                          {cat.name}
                          <span className={`ml-1 text-[10px] lowercase px-1.5 py-0.5 rounded-full ${
                            cat.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {cat.type}
                          </span>
                        </label>
                        <div className="relative w-32">
                          <span className="absolute left-3 top-2 text-gray-500 text-sm">৳</span>
                          <input
                            type="number"
                            value={editFormData[cat.id]}
                            onChange={(e) => setEditFormData({...editFormData, [cat.id]: e.target.value})}
                            className="w-full pl-7 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
              <div className="text-lg font-bold text-gray-800">
                Predicted Total: <span className="text-blue-600">৳{
                  categories.reduce((sum, cat) => sum + parseFloat(editFormData[cat.id] || 0), 0).toLocaleString()
                }</span>
              </div>
              <div className="flex gap-3">
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
                  <FaSave /> Save Bill
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillRecordsTable;