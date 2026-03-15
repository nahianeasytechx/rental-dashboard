import React, { useState, useEffect } from 'react';
import BillRecordsTable from '../components/BillRecordsTable';
import { FaHistory } from "react-icons/fa";
import { useApp } from '../context/AppContext';

const BillRecords = () => {
  const { bills, updateBillStatus } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState('all');
  const [filterYear, setFilterYear] = useState('all');

  // Removed local loadData/localStorage logic because bills come from AppContext now
  return (
    <>
      <div className="container lg:py-4 px-8 mx-auto mt-20 lg:mt-0">
        <div className="flex space-x-4 py-4">
          <FaHistory className="text-4xl text-white rounded-lg p-2 bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600" />
          <h1 className="text-3xl font-bold">Billing Records</h1>
        </div>
        {/* Remove limit prop to show all records */}
        <BillRecordsTable limit={15} />
      </div>
    </>
  )
}

export default BillRecords