import React from "react";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

const BillRecordsTable = ({ limit = null, columns = null }) => {
  const { bills: allRecords, categories, flats, deleteBill } = useApp();
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
    const flat = flats.find(f => f.id === b.flatId || f.flatNo === b.flatNo);
    return flat && flat.phoneNumber === currentUser?.phone;
  });

  // Sort by date descending
  const sortedRecords = [...userRecords].sort((a, b) => new Date(b.date) - new Date(a.date));
  const displayRecords = limit ? sortedRecords.slice(0, limit) : sortedRecords;

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
                      <button
                        onClick={() => handleDelete(row)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors cursor-pointer"
                        title="Delete Bill"
                      >
                        <TrashIcon />
                      </button>
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
    </div>
  );
};

export default BillRecordsTable;