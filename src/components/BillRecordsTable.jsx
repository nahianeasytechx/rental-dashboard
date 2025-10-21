import React, { useState } from 'react'
import { Edit, Trash2, Eye, Search, Filter } from 'lucide-react'

const BillRecordsTable = ({ records = [], showActions = false, showSearch = false }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const sampleData = [
    {
      id: 1,
      ownerName: "John Doe",
      flatNo: "A-101",
      year: 2025,
      serviceCharge: 5000,
      netBills: 3000,
      dishBills: 500,
      flatRent: 15000,
      commonBill: 2000,
      centerRent: 1000,
      various: 500,
      atticRent: 800,
      donation: 1000,
      development: 2000,
      total: 30800,
      status: "received"
    },
    {
      id: 2,
      ownerName: "Jane Smith",
      flatNo: "B-205",
      year: 2025,
      serviceCharge: 5000,
      netBills: 3500,
      dishBills: 500,
      flatRent: 18000,
      commonBill: 2000,
      centerRent: 1500,
      various: 300,
      atticRent: 0,
      donation: 500,
      development: 1500,
      total: 32800,
      status: "pending"
    },
    {
      id: 3,
      ownerName: "Mike Johnson",
      flatNo: "C-302",
      year: 2025,
      serviceCharge: 5000,
      netBills: 2800,
      dishBills: 500,
      flatRent: 12000,
      commonBill: 2000,
      centerRent: 800,
      various: 200,
      atticRent: 1200,
      donation: 2000,
      development: 3000,
      total: 29500,
      status: "received"
    }
  ]

  const data = records.length > 0 ? records : sampleData

  const filteredData = data.filter(record => {
    const matchesSearch = 
      record.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.flatNo.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = 
      filterStatus === 'all' || record.status === filterStatus

    return matchesSearch && matchesFilter
  })

  const handleEdit = (id) => {
    console.log('Edit record:', id)
  }

  const handleDelete = (id) => {
    console.log('Delete record:', id)
  }

  const handleView = (id) => {
    console.log('View record:', id)
  }

  return (
    <div className="w-full overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-t-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Bill Records Overview</h2>
        
        {/* Search and Filter */}
        {showSearch && (
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or flat no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
            
            {/* Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterStatus === 'all'
                    ? 'bg-white text-indigo-600 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('received')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterStatus === 'received'
                    ? 'bg-white text-green-600 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                Received
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterStatus === 'pending'
                    ? 'bg-white text-orange-600 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                Pending
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table Container with Horizontal Scroll */}
      <div className="bg-white rounded-b-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap sticky left-0 bg-gray-100 z-20">Owner Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Flat No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Year</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Service Charge</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Net Bills</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Dish Bills</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Flat Rent</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Common Bill</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Center Rent</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Various</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Attic Rent</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Donation</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Development</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Total</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Status</th>
                {showActions && (
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap sticky right-0 bg-gray-100 z-20">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.length > 0 ? (
                filteredData.map((record, index) => (
                  <tr 
                    key={record.id} 
                    className={`hover:bg-blue-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap sticky left-0 z-10 bg-inherit">{record.ownerName}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{record.flatNo}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{record.year}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right whitespace-nowrap">৳{record.serviceCharge.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right whitespace-nowrap">৳{record.netBills.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right whitespace-nowrap">৳{record.dishBills.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right whitespace-nowrap">৳{record.flatRent.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right whitespace-nowrap">৳{record.commonBill.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right whitespace-nowrap">৳{record.centerRent.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right whitespace-nowrap">৳{record.various.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right whitespace-nowrap">৳{record.atticRent.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right whitespace-nowrap">৳{record.donation.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right whitespace-nowrap">৳{record.development.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right whitespace-nowrap">৳{record.total.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        record.status === 'received'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </td>
                    {showActions && (
                      <td className="px-4 py-3 text-center whitespace-nowrap sticky right-0 z-10 bg-inherit">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleView(record.id)}
                            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(record.id)}
                            className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(record.id)}
                            className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={showActions ? "16" : "15"} className="px-4 py-8 text-center text-gray-500">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default BillRecordsTable