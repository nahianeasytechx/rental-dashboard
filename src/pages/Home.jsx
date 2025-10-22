import React from "react";
import Sidebar from "../components/Sidebar";
import Cards from "../components/Cards";
import BillRecordsTable from "../components/BillRecordsTable";
import { MdDashboardCustomize } from "react-icons/md";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      {/* Cards Section - Keep container for centered layout */}
      <div className="container lg:py-4 px-8 mx-auto mt-20 lg:mt-0">
        <div className="flex space-x-4 py-4">
          <MdDashboardCustomize className="text-4xl rounded-lg  text-white p-2 bg-gradient-to-r from bg-purple-400 via-purple-500 to-purple-600 " />
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <h1 className="text-xl font-bold">This Month</h1>

        {/* Cards Grid */}
        <div className="py-5 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Cards
            title="Total Bills"
            currentValue={45000}
            totalValue={100000}
            description=""
            colorScheme="blue"
            icon="bill"
          />
          <Cards
            title="Total Expense"
            currentValue={45000}
            totalValue={100000}
            description=""
            colorScheme="red"
            icon="expense"
          />
          <Cards
            title="Total Collection"
            currentValue={45000}
            totalValue={100000}
            description=""
            colorScheme="purple"
            icon="collection"
          />
          <Cards
            title="Total Revenue"
            currentValue={45000}
            totalValue={100000}
            description=""
            colorScheme="green"
            icon="bdt"
          />
        </div>

        <h2 className="text-xl font-bold mt-8">All Transactions</h2>

        <div className="py-5 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Cards
            title="Total Bills"
            currentValue={45000}
            totalValue={100000}
            description=""
            colorScheme="blue"
            icon="bill"
            showMonth={false}
            showYear={false}
          />
          <Cards
            title="Total Expense"
            currentValue={45000}
            totalValue={100000}
            description=""
            colorScheme="red"
            icon="expense"
            showMonth={false}
            showYear={false}
          />
          <Cards
            title="Total Collection"
            currentValue={45000}
            totalValue={100000}
            description=""
            colorScheme="purple"
            icon="collection"
            showMonth={false}
            showYear={false}
          />
          <Cards
            title="Total Revenue"
            currentValue={45000}
            totalValue={100000}
            description=""
            colorScheme="green"
            icon="bdt"
            showMonth={false}
            showYear={false}
          />
        </div>

        {/* Table Section - NO container, just padding */}
        <div className="my-5 bg-[#FFF] border rounded-xl border-gray-100 shadow-xl">
          <h2 className="p-4 text-xl font-bold">Bill Transactions</h2>
          <div>
            <BillRecordsTable limit={4}/>
          </div>

          <div className="pl-4">
            <button className="cursor-pointer transition-all ease-in-out duration-300 active:scale-95 my-5 py-2 px-10 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-lg shadow-lg text-white">
              <Link to="/all-accounts/bill-records"> See Full Records</Link>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
