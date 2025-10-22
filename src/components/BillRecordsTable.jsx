import React from "react";

const BillRecordsTable = ({ limit = null, columns = null }) => {
  // Dummy bill data
  const allRecords = [
    {
      owner: "Mr. Rahman",
      flatNo: "A-101",
      year: 2025,
      serviceCharge: 2000,
      netBills: 800,
      dishBills: 300,
      flatRent: 15000,
      commonBill: 1200,
      centerRent: 500,
      various: 250,
      atticRent: 700,
      donation: 100,
      development: 500,
      total: 21000,
      status: "Pending",
    },
    {
      owner: "Mrs. Akter",
      flatNo: "B-202",
      year: 2025,
      serviceCharge: 2200,
      netBills: 750,
      dishBills: 350,
      flatRent: 16000,
      commonBill: 1000,
      centerRent: 600,
      various: 150,
      atticRent: 650,
      donation: 200,
      development: 700,
      total: 22200,
      status: "Received",
    },
    {
      owner: "Mr. Hasan",
      flatNo: "C-303",
      year: 2025,
      serviceCharge: 1800,
      netBills: 600,
      dishBills: 250,
      flatRent: 14000,
      commonBill: 900,
      centerRent: 550,
      various: 120,
      atticRent: 600,
      donation: 150,
      development: 400,
      total: 19700,
      status: "Pending",
    },
  ];

  // All possible columns
  const allColumns = [
    { key: "owner", label: "Owner's Name" },
    { key: "flatNo", label: "Flat No" },
    { key: "year", label: "Year" },
    { key: "serviceCharge", label: "Service Charge" },
    { key: "netBills", label: "Net Bills" },
    { key: "dishBills", label: "Dish Bills" },
    { key: "flatRent", label: "Flat Rent" },
    { key: "commonBill", label: "Common Bill" },
    { key: "centerRent", label: "Center Rent" },
    { key: "various", label: "Various" },
    { key: "atticRent", label: "Attic Rent" },
    { key: "donation", label: "Donation" },
    { key: "development", label: "Development" },
    { key: "total", label: "Total" },
    { key: "status", label: "Status" },
  ];

  // Apply column & row limits
  const selectedColumns = columns
    ? allColumns.filter((col) => columns.includes(col.key))
    : allColumns;

  const displayRecords = limit ? allRecords.slice(0, limit) : allRecords;

  return (
    <div className="relative overflow-x-auto  bg-gray-300 ">
      <table className=" w-full text-xs text-left text-gray-600">
        <thead className=" text-white uppercase bg-black">
          <tr>
            {selectedColumns.map((col) => (
              <th key={col.key} className="px-6 py-3 whitespace-nowrap">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayRecords.map((row, i) => (
            <tr
              key={i}
              className="bg-white border-b border-gray-200 hover:bg-gray-50 text-sm"
            >
              {selectedColumns.map((col) => (
                <td
                  key={col.key}
                  className={`px-6 py-4 ${
                    col.key === "total"
                      ? "font-semibold text-gray-900"
                      : col.key === "status"
                      ? row.status === "Received"
                        ? "text-green-600 font-medium"
                        : "text-red-600 font-medium"
                      : ""
                  }`}
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BillRecordsTable;
