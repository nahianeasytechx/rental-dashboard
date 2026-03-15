import React from "react";
import Cards from "../components/Cards";
import { MdDashboardCustomize } from "react-icons/md";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { getDashboardStats, bills, flats } = useApp();
  const { currentUser } = useAuth();

  // Determine client phone for filtering
  const clientPhone = currentUser?.role === 'client' ? currentUser?.phone : null;

  // Get current month stats
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const thisMonthStats = getDashboardStats(currentMonth, currentYear, clientPhone);

  // Get all-time stats
  const allTimeStats = getDashboardStats(null, null, clientPhone);

  // Filter and format recent bills
  const displayBills = clientPhone 
    ? bills.filter(b => {
        const flat = flats.find(f => f.id === b.flatId || f.flatNo === b.flatNo);
        return flat && flat.phoneNumber === clientPhone;
      })
    : bills;

  const recentBills = [...displayBills].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);

  return (
    <>
      <div className="container lg:py-4 px-8 mx-auto mt-20 lg:mt-0">
        <div className="flex space-x-4 py-4">
          <MdDashboardCustomize className="text-4xl rounded-lg text-white p-2 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 " />
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        
        {/* THIS MONTH */}
        <h1 className="text-xl font-bold">This Month</h1>
        <div className="py-5 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Cards
            title="Total Bills"
            currentValue={thisMonthStats.totalCollection.toLocaleString()}
            totalValue={thisMonthStats.totalBills.toLocaleString()}
            description="Collected in"
            colorScheme="blue"
            icon="bill"
          />
          <Cards
            title="Total Expense"
            currentValue={thisMonthStats.totalExpense.toLocaleString()}
            totalValue={thisMonthStats.totalIncome.toLocaleString()}
            description="Spent from income in"
            colorScheme="red"
            icon="expense"
          />
          <Cards
            title="Total Collection"
            currentValue={thisMonthStats.totalCollection.toLocaleString()}
            totalValue={thisMonthStats.totalBills.toLocaleString()}
            description="Collected in"
            colorScheme="purple"
            icon="collection"
          />
          <Cards
            title="Total Revenue"
            currentValue={thisMonthStats.totalRevenue.toLocaleString()}
            totalValue={(thisMonthStats.totalIncome - thisMonthStats.totalExpense).toLocaleString()}
            description="Net revenue in"
            colorScheme="green"
            icon="bdt"
          />
        </div>

        {/* ALL TRANSACTIONS */}
        <h2 className="text-xl font-bold mt-8">All Transactions</h2>
        <div className="py-5 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Cards
            title="Total Bills"
            currentValue={allTimeStats.totalCollection.toLocaleString()}
            totalValue={allTimeStats.totalBills.toLocaleString()}
            description="Generated"
            colorScheme="blue"
            icon="bill"
            showMonth={false}
            showYear={false}
          />
          <Cards
            title="Total Expense"
            currentValue={allTimeStats.totalExpense.toLocaleString()}
            totalValue={allTimeStats.totalIncome.toLocaleString()}
            description="All time expenses vs income"
            colorScheme="red"
            icon="expense"
            showMonth={false}
            showYear={false}
          />
          <Cards
            title="Total Collection"
            currentValue={allTimeStats.totalCollection.toLocaleString()}
            totalValue={allTimeStats.totalBills.toLocaleString()}
            description="All time collected"
            colorScheme="purple"
            icon="collection"
            showMonth={false}
            showYear={false}
          />
          <Cards
            title="Total Revenue"
            currentValue={allTimeStats.totalRevenue.toLocaleString()}
            totalValue={(allTimeStats.totalIncome - allTimeStats.totalExpense).toLocaleString()}
            description="All time net revenue"
            colorScheme="green"
            icon="bdt"
            showMonth={false}
            showYear={false}
          />
        </div>

        {/* RECENT BILLS TABLE */}
        <div className="my-5 bg-[#FFF] border rounded-xl border-gray-100 shadow-xl overflow-hidden">
          <h2 className="p-4 text-xl font-bold border-b border-gray-100">Recent Bill Transactions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-6 py-3 font-semibold">Flat No</th>
                  <th className="px-6 py-3 font-semibold">Owner</th>
                  <th className="px-6 py-3 font-semibold">Month</th>
                  <th className="px-6 py-3 font-semibold">Amount</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentBills.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No recent bills found.</td>
                  </tr>
                ) : (
                  recentBills.map(bill => (
                    <tr key={bill.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{bill.flatNo}</td>
                      <td className="px-6 py-4">{bill.owner}</td>
                      <td className="px-6 py-4">{new Date(`2000-${bill.month}-01`).toLocaleString('default', { month: 'short' })} {bill.year}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">৳{bill.total.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          bill.status === "Received" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {bill.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-gray-100">
            <Link to="/all-accounts/bill-records" className="inline-block cursor-pointer transition-all ease-in-out duration-300 active:scale-95 py-2 px-8 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 rounded-lg shadow-lg text-white text-sm font-medium">
              See Full Records
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
