import React, { useState } from "react";
import { useApp } from "../context/AppContext";

const AddRent = () => {
  const { flats, categories, addBill } = useApp();
  
  const [selectedFlatId, setSelectedFlatId] = useState("");
  const [billData, setBillData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  
  const [showReceipt, setShowReceipt] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState(null);

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

  // Get the currently selected flat details
  const flat = flats.find(f => f.id === parseInt(selectedFlatId)) || null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillData({ ...billData, [name]: value });
  };

  const calculateTotal = () => {
    let total = 0;
    categories.forEach(cat => {
      total += parseFloat(billData[cat.id] || 0);
    });
    return total;
  };

  const handleGenerateInvoice = () => {
    if (!flat) {
      alert("Please select a flat first.");
      return;
    }

    const total = calculateTotal();
    
    // Build bill payload
    const newBillPayload = {
      flatId: flat.id,
      flatNo: flat.flatNo,
      owner: flat.ownerName,
      month: parseInt(billData.month),
      year: parseInt(billData.year),
      total: total,
    };

    // Attach all categories
    categories.forEach(cat => {
      newBillPayload[cat.id] = parseFloat(billData[cat.id] || 0);
    });
    
    // Save to context
    const savedBill = addBill(newBillPayload);
    
    // Prepare for receipt
    setGeneratedInvoice(savedBill);
    setShowReceipt(true);
    
    // Reset form
    const resetData = { month: billData.month, year: billData.year };
    setBillData(resetData);
    setSelectedFlatId("");
  };

  const printReceipt = () => {
    window.print();
  };

  const closeReceipt = () => {
    setShowReceipt(false);
    setGeneratedInvoice(null);
  };

  const ReceiptIcon = () => (
    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18 17H6v-2h12v2zm0-4H6v-2h12v2zm0-4H6V7h12v2zM3 22l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2 4.5 3.5 3 2v20z"/>
    </svg>
  );

  return (
    <div className="container lg:py-4 px-8 mx-auto mt-20 lg:mt-0 relative">
      <div className="flex items-center space-x-4 py-4 hide-on-print">
        <div className="text-4xl rounded-lg text-white p-2 bg-gradient-to-r from-green-500 to-green-600">
          <ReceiptIcon />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Collect Rent</h1>
          <p className="text-gray-600 text-sm">Select a flat and generate a rent receipt</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 hide-on-print">
        
        {/* Left Column: Selection & Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-gray-100 rounded-xl shadow-xl p-6">
            <h2 className="text-lg font-bold mb-4 text-gray-800">Select Flat</h2>
            <select
              value={selectedFlatId}
              onChange={(e) => setSelectedFlatId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all cursor-pointer"
            >
              <option value="">-- Choose a Flat --</option>
              {flats.map(f => (
                <option key={f.id} value={f.id}>Flat {f.flatNo}</option>
              ))}
            </select>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl shadow-xl p-6 min-h-[250px]">
            <h2 className="text-lg font-bold mb-4 text-gray-800">Owner Information</h2>
            {flat ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Flat Number</p>
                  <p className="text-lg text-gray-800 font-semibold">{flat.flatNo}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Owner Name</p>
                  <p className="text-lg text-gray-800 font-semibold">{flat.ownerName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Phone</p>
                  <p className="text-lg text-gray-800 font-semibold">{flat.phoneNumber}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm italic py-10">
                Please select a flat to view owner details.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Billing Form */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-100 rounded-xl shadow-xl p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Rent & Billing Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                <select name="month" value={billData.month} onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>{month.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <select name="year" value={billData.year} onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {categories.map(cat => (
                <div key={cat.id} className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {cat.name} <span className="text-xs text-gray-400 font-normal">({cat.type})</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">৳</span>
                    <input 
                      type="number" 
                      name={cat.id} 
                      value={billData[cat.id] || ''} 
                      onChange={handleInputChange}
                      placeholder="0.00" 
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-mono" 
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-green-50 border border-green-100 p-6 rounded-xl mb-6 flex justify-between items-center">
              <span className="text-gray-700 font-semibold text-lg">Total Amount</span>
              <span className="text-3xl font-bold text-green-700 font-mono">৳ {calculateTotal().toFixed(2)}</span>
            </div>

            <div className="flex justify-end">
              <button 
                onClick={handleGenerateInvoice}
                disabled={!flat}
                className={`flex items-center gap-2 py-4 px-8 rounded-xl shadow-lg font-bold text-lg transition-all active:scale-95 ${
                  flat 
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-xl hover:from-green-600 hover:to-green-700 cursor-pointer" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-70"
                }`}>
                <ReceiptIcon />
                <span>Generate & Print Receipt</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      {showReceipt && generatedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 transition-opacity">
          
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col relative print:w-full print:h-screen print:rounded-none print:shadow-none print:max-w-none print:overflow-visible print:p-8">
            
            {/* Modal Header (Hidden on print) */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center hide-on-print z-10">
              <h2 className="text-lg font-bold text-gray-800">Rent Receipt</h2>
              <div className="flex gap-2">
                <button 
                  onClick={printReceipt}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors cursor-pointer"
                >
                  Print
                </button>
                <button 
                  onClick={closeReceipt}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium text-sm transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Receipt Content (Printed area) */}
            <div className="p-8 bg-white" id="printable-receipt">
              
              {/* Receipt Header */}
              <div className="text-center mb-8 border-b-2 border-gray-800 pb-6">
                <h1 className="text-3xl font-black text-gray-900 tracking-wider mb-2">ABASHON<span className="text-orange-500">X</span></h1>
                <p className="text-gray-600 text-sm font-medium">Rent & Utility Receipt</p>
                <p className="text-gray-500 text-xs mt-1">123 Building Avenue, Dhaka, Bangladesh</p>
              </div>

              {/* Receipt Meta */}
              <div className="flex justify-between items-end mb-8 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Receipt No:</p>
                  <p className="font-mono font-bold text-gray-900">RCPT-{generatedInvoice.id.toString().slice(-6)}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 mb-1">Date:</p>
                  <p className="font-mono font-bold text-gray-900">{generatedInvoice.date}</p>
                </div>
              </div>

              {/* Billed To */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-8">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Billed To</p>
                <p className="text-lg font-bold text-gray-900">{generatedInvoice.owner}</p>
                <p className="text-gray-700">Flat No: <span className="font-semibold">{generatedInvoice.flatNo}</span></p>
                <p className="text-gray-600 text-sm mt-1">{months.find(m => m.value === generatedInvoice.month)?.label} {generatedInvoice.year} Billing Cycle</p>
              </div>

              {/* Line Items */}
              <div className="mb-8">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-300">
                    <tr>
                      <th className="text-left py-2 text-gray-600 font-semibold uppercase text-xs">Description</th>
                      <th className="text-right py-2 text-gray-600 font-semibold uppercase text-xs">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y border-b border-gray-300 divide-gray-100">
                    {categories.map(cat => {
                      const amount = generatedInvoice[cat.id];
                      if (!amount) return null; // Only show non-zero items
                      return (
                        <tr key={cat.id}>
                          <td className="py-3 text-gray-800">{cat.name}</td>
                          <td className="py-3 text-right font-mono text-gray-900">৳{amount.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td className="py-4 text-right font-bold text-lg text-gray-900">Total Paid:</td>
                      <td className="py-4 text-right font-bold text-xl text-green-700 font-mono">৳{generatedInvoice.total.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Footer / Signatures */}
              <div className="mt-16 pt-8 flex justify-between px-4 pb-8">
                <div className="text-center">
                  <div className="w-32 border-t border-gray-400 mb-2 mx-auto"></div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest">Authority Signature</p>
                </div>
                <div className="text-center">
                  <div className="w-32 border-t border-gray-400 mb-2 mx-auto"></div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest">Tenant Signature</p>
                </div>
              </div>

              <div className="text-center text-xs text-gray-400 mt-4 border-t border-gray-100 pt-4 pb-2">
                Thank you for your timely payment. This is a computer generated receipt.
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Embedded CSS for Print Mode */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .hide-on-print {
            display: none !important;
          }
          #printable-receipt, #printable-receipt * {
            visibility: visible;
          }
          #printable-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}} />
    </div>
  );
};

export default AddRent;
