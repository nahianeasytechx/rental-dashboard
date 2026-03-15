import React from "react";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";

const BillRecordsTable = ({ limit = null, columns = null }) => {
  const { bills: allRecords, categories, flats } = useApp();
  const { currentUser } = useAuth();

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
            </tr>
          </thead>
          <tbody>
            {displayRecords.length === 0 ? (
              <tr>
                <td colSpan={selectedColumns.length} className="px-6 py-8 text-center text-gray-500">
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