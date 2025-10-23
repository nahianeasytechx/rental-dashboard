import React from "react";
import {
  FaMoneyBillWave,
  FaHandHoldingUsd,
  FaExclamationCircle,
  FaChartLine,
  FaHome,
  FaClipboardList,
  FaLandmark,
} from "react-icons/fa";
import { MdAccountBalanceWallet } from "react-icons/md";
import { FcMoneyTransfer } from "react-icons/fc";

const Accounts = () => {
  const summaryCards = [
    {
      title: "Total Rent Collected",
      amount: "৳120,000",
      color: "from-green-500 to-green-600",
      icon: <FaHome />,
    },
    {
      title: "Pending Bills",
      amount: "৳25,000",
      color: "from-red-500 to-red-600",
      icon: <FaExclamationCircle />,
    },
    {
      title: "Service Charge Collected",
      amount: "৳15,000",
      color: "from-blue-500 to-blue-600",
      icon: <FaClipboardList />,
    },
    {
      title: "Total Revenue",
      amount: "৳160,000",
      color: "from-indigo-500 to-indigo-600",
      icon: <FaChartLine />,
    },
    {
      title: "Maintenance Fund",
      amount: "৳40,000",
      color: "from-purple-500 to-purple-600",
      icon: <FaLandmark />,
    },
    {
      title: "Donation / Development",
      amount: "৳10,000",
      color: "from-pink-500 to-pink-600",
      icon: <FaHandHoldingUsd />,
    },
  ];

  const transactions = [
    {
      id: 1,
      type: "Rent Payment",
      amount: "৳15,000",
      date: "2025-10-01",
      status: "Received",
    },
    {
      id: 2,
      type: "Service Charge",
      amount: "৳1,500",
      date: "2025-10-02",
      status: "Received",
    },
    {
      id: 3,
      type: "Electricity Bill",
      amount: "৳3,200",
      date: "2025-10-05",
      status: "Pending",
    },
    {
      id: 4,
      type: "Maintenance",
      amount: "৳2,000",
      date: "2025-10-07",
      status: "Received",
    },
  ];

  return (
    <>
      <div className="container lg:py-4 px-8 mx-auto mt-20 lg:mt-0">
        {/* Header */}
        <div className="flex space-x-4 py-4">
          <FcMoneyTransfer className="text-4xl  border border-gray-300 rounded-lg p-2 bg-gradient-to-r from bg-orange-500  to-orange-600" />
          <h1 className="text-3xl font-bold">Accounts Overview</h1>
        </div>
        <p className="text-gray-600 text-sm mb-6">
          Track all financial activities, collections, and revenue details.
        </p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {summaryCards.map((card, index) => (
            <div
              key={index}
              className="group relative bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
            >
              <div
                className={`absolute top-4 right-4 p-3 rounded-full bg-gradient-to-r ${card.color} text-white shadow-md transform transition-transform duration-300 group-hover:rotate-45`}
              >
                {card.icon}
              </div>
              <h2 className="text-gray-700 text-sm font-semibold">{card.title}</h2>
              <p className="text-2xl font-bold text-gray-900 mt-2">{card.amount}</p>
            </div>
          ))}
        </div>

        {/* Transactions Table */}
        <div className="bg-white border rounded-xl border-gray-100 shadow-xl">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">Recent Transactions</h2>
            <MdAccountBalanceWallet className="text-2xl text-blue-600" />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-600">
              <thead className="bg-gray-900 text-white font-semibold text-xs uppercase">
                <tr>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-b-gray-300 hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-3">{item.type}</td>
                    <td className="px-6 py-3 font-semibold text-gray-900">{item.amount}</td>
                    <td className="px-6 py-3">{item.date}</td>
                    <td className="px-6 py-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.status === "Received"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4">
            <button className="cursor-pointer transition-all ease-in-out duration-300 active:scale-95 py-2 px-8 bg-gradient-to-r from-orange-500 to-orange-600  rounded-lg shadow-lg text-white text-sm">
              See Full Records
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Accounts;
