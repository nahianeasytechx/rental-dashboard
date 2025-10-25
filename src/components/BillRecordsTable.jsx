import React, { useState, useEffect } from "react";

const BillRecordsTable = ({ limit = null, columns = null, showResetButton = false }) => {
  const [allRecords, setAllRecords] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default categories
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

  // Default dummy data - 20 records for testing
  const defaultDummyData = [
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
      status: "Pending",
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
    },
    {
      id: 3,
      owner: "Mr. Hasan",
      flatNo: "C-303",
      year: 2025,
      month: 10,
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
    },
    {
      id: 4,
      owner: "Ms. Sultana",
      flatNo: "D-404",
      year: 2025,
      month: 10,
      rentFee: 14500,
      internetBill: 600,
      dishBill: 250,
      associationFlatRent: 900,
      commonCurrentBill: 900,
      communityCenterRent: 550,
      rooftopRoomRent: 600,
      development: 400,
      total: 18700,
      status: "Pending",
    },
    {
      id: 5,
      owner: "Mr. Karim",
      flatNo: "E-505",
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
    },
    {
      id: 6,
      owner: "Mrs. Begum",
      flatNo: "F-606",
      year: 2025,
      month: 9,
      rentFee: 15500,
      internetBill: 600,
      dishBill: 250,
      associationFlatRent: 900,
      commonCurrentBill: 900,
      communityCenterRent: 550,
      rooftopRoomRent: 600,
      development: 400,
      total: 19700,
      status: "Received",
    },
    {
      id: 7,
      owner: "Mr. Ahmed",
      flatNo: "G-707",
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
      status: "Pending",
    },
    {
      id: 8,
      owner: "Ms. Nazia",
      flatNo: "H-808",
      year: 2025,
      month: 9,
      rentFee: 16500,
      internetBill: 600,
      dishBill: 250,
      associationFlatRent: 900,
      commonCurrentBill: 900,
      communityCenterRent: 550,
      rooftopRoomRent: 600,
      development: 400,
      total: 20700,
      status: "Received",
    },
    {
      id: 9,
      owner: "Mr. Islam",
      flatNo: "I-901",
      year: 2025,
      month: 8,
      rentFee: 13500,
      internetBill: 700,
      dishBill: 300,
      associationFlatRent: 850,
      commonCurrentBill: 850,
      communityCenterRent: 500,
      rooftopRoomRent: 550,
      development: 350,
      total: 17600,
      status: "Received",
    },
    {
      id: 10,
      owner: "Mrs. Chowdhury",
      flatNo: "J-1002",
      year: 2025,
      month: 8,
      rentFee: 17000,
      internetBill: 800,
      dishBill: 350,
      associationFlatRent: 1100,
      commonCurrentBill: 1100,
      communityCenterRent: 650,
      rooftopRoomRent: 700,
      development: 600,
      total: 22300,
      status: "Pending",
    },
    {
      id: 11,
      owner: "Mr. Morshed",
      flatNo: "K-1101",
      year: 2025,
      month: 8,
      rentFee: 14200,
      internetBill: 600,
      dishBill: 250,
      associationFlatRent: 900,
      commonCurrentBill: 900,
      communityCenterRent: 550,
      rooftopRoomRent: 600,
      development: 400,
      total: 18400,
      status: "Received",
    },
    {
      id: 12,
      owner: "Ms. Parvin",
      flatNo: "L-1202",
      year: 2025,
      month: 7,
      rentFee: 15800,
      internetBill: 750,
      dishBill: 300,
      associationFlatRent: 1000,
      commonCurrentBill: 1000,
      communityCenterRent: 600,
      rooftopRoomRent: 650,
      development: 500,
      total: 20600,
      status: "Received",
    },
    {
      id: 13,
      owner: "Mr. Siddique",
      flatNo: "M-1303",
      year: 2025,
      month: 7,
      rentFee: 13800,
      internetBill: 650,
      dishBill: 280,
      associationFlatRent: 880,
      commonCurrentBill: 880,
      communityCenterRent: 530,
      rooftopRoomRent: 580,
      development: 380,
      total: 17980,
      status: "Pending",
    },
    {
      id: 14,
      owner: "Mrs. Jahan",
      flatNo: "N-1404",
      year: 2025,
      month: 7,
      rentFee: 16200,
      internetBill: 780,
      dishBill: 320,
      associationFlatRent: 1050,
      commonCurrentBill: 1050,
      communityCenterRent: 620,
      rooftopRoomRent: 670,
      development: 550,
      total: 21240,
      status: "Received",
    },
    {
      id: 15,
      owner: "Mr. Kabir",
      flatNo: "O-1505",
      year: 2025,
      month: 6,
      rentFee: 14800,
      internetBill: 720,
      dishBill: 290,
      associationFlatRent: 950,
      commonCurrentBill: 950,
      communityCenterRent: 570,
      rooftopRoomRent: 620,
      development: 450,
      total: 19350,
      status: "Received",
    },
    {
      id: 16,
      owner: "Ms. Rehana",
      flatNo: "P-1606",
      year: 2025,
      month: 6,
      rentFee: 15200,
      internetBill: 730,
      dishBill: 295,
      associationFlatRent: 970,
      commonCurrentBill: 970,
      communityCenterRent: 580,
      rooftopRoomRent: 630,
      development: 470,
      total: 19845,
      status: "Pending",
    },
    {
      id: 17,
      owner: "Mr. Rafiq",
      flatNo: "Q-1707",
      year: 2025,
      month: 6,
      rentFee: 13600,
      internetBill: 680,
      dishBill: 270,
      associationFlatRent: 870,
      commonCurrentBill: 870,
      communityCenterRent: 520,
      rooftopRoomRent: 570,
      development: 370,
      total: 17750,
      status: "Received",
    },
    {
      id: 18,
      owner: "Mrs. Nasrin",
      flatNo: "R-1808",
      year: 2025,
      month: 5,
      rentFee: 16800,
      internetBill: 810,
      dishBill: 340,
      associationFlatRent: 1080,
      commonCurrentBill: 1080,
      communityCenterRent: 640,
      rooftopRoomRent: 690,
      development: 580,
      total: 22020,
      status: "Received",
    },
    {
      id: 19,
      owner: "Mr. Shakil",
      flatNo: "S-1909",
      year: 2025,
      month: 5,
      rentFee: 14300,
      internetBill: 690,
      dishBill: 275,
      associationFlatRent: 890,
      commonCurrentBill: 890,
      communityCenterRent: 540,
      rooftopRoomRent: 590,
      development: 390,
      total: 18565,
      status: "Pending",
    },
    {
      id: 20,
      owner: "Ms. Farhana",
      flatNo: "T-2010",
      year: 2025,
      month: 5,
      rentFee: 15600,
      internetBill: 760,
      dishBill: 310,
      associationFlatRent: 990,
      commonCurrentBill: 990,
      communityCenterRent: 590,
      rooftopRoomRent: 640,
      development: 490,
      total: 20370,
      status: "Received",
    },
  ];

  useEffect(() => {
    // Check if we need to force update the dummy data
    const stored = localStorage.getItem('bills');
    if (stored) {
      const parsed = JSON.parse(stored);
      // If localStorage has fewer records than our dummy data, force reset
      if (parsed.length < defaultDummyData.length) {
        console.log(`Found ${parsed.length} records in localStorage, resetting to ${defaultDummyData.length} records`);
        localStorage.removeItem('bills');
      }
    }
    
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

  const loadData = (forceReset = false) => {
    try {
      setLoading(true);
      
      console.log('=== LOADING DATA DEBUG ===');
      console.log('Force reset:', forceReset);
      console.log('Default dummy data count:', defaultDummyData.length);
      
      // Load categories
      const storedCategories = localStorage.getItem('expenseCategories');
      if (storedCategories && !forceReset) {
        try {
          const parsed = JSON.parse(storedCategories);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCategories(parsed);
            console.log('✓ Loaded categories from localStorage:', parsed.length);
          } else {
            throw new Error('Invalid categories data');
          }
        } catch (e) {
          console.warn('✗ Invalid categories in localStorage, using defaults');
          setCategories(defaultCategories);
          localStorage.setItem('expenseCategories', JSON.stringify(defaultCategories));
        }
      } else {
        console.log('✓ Using default categories:', defaultCategories.length);
        setCategories(defaultCategories);
        localStorage.setItem('expenseCategories', JSON.stringify(defaultCategories));
      }

      // Load bills
      const stored = localStorage.getItem('bills');
      console.log('Bills in localStorage?', stored ? 'YES' : 'NO');
      
      if (stored && !forceReset) {
        try {
          const parsed = JSON.parse(stored);
          console.log('Parsed bills from localStorage:', parsed.length, 'records');
          console.log('First record:', parsed[0]);
          console.log('Last record:', parsed[parsed.length - 1]);
          
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAllRecords(parsed);
            console.log('✓ USING LOCALSTORAGE DATA:', parsed.length, 'records');
          } else {
            throw new Error('Invalid bills data');
          }
        } catch (e) {
          console.warn('✗ Invalid bills in localStorage, using dummy data');
          setAllRecords(defaultDummyData);
          localStorage.setItem('bills', JSON.stringify(defaultDummyData));
          console.log('✓ USING DUMMY DATA:', defaultDummyData.length, 'records');
        }
      } else {
        console.log('✓ USING DUMMY DATA (no localStorage):', defaultDummyData.length, 'records');
        setAllRecords(defaultDummyData);
        localStorage.setItem('bills', JSON.stringify(defaultDummyData));
      }
      
      console.log('=== END DEBUG ===');
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback to dummy data on any error
      setCategories(defaultCategories);
      setAllRecords(defaultDummyData);
    } finally {
      setLoading(false);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all data to default? This cannot be undone.')) {
      localStorage.removeItem('bills');
      localStorage.removeItem('expenseCategories');
      loadData(true);
      alert('Data has been reset to default values!');
    }
  };

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

  const displayRecords = limit ? allRecords.slice(0, limit) : allRecords;

  if (loading) {
    return (
      <div className="relative overflow-x-auto bg-gray-300 p-8 text-center">
        <p className="text-gray-600">Loading bill records...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {showResetButton && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={handleResetData}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
          >
            Reset Data to Default
          </button>
        </div>
      )}
      
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
      
      {limit && allRecords.length > limit && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Showing {limit} of {allRecords.length} records
        </div>
      )}
    </div>
  );
};

export default BillRecordsTable;