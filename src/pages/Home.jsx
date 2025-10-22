import React from "react";
import Sidebar from "../components/Sidebar";
import Cards from "../components/Cards";
import BillRecordsTable from "../components/BillRecordsTable";

const Home = () => {
  return (
    <>
      {/* Cards Section - Keep container for centered layout */}
      <div className=" container px-5 mx-auto mt-20 lg:mt-0">
        <h1 className="text-2xl font-semibold py-3">This Month</h1>

        <div className="py-5 w-full flex flex-wrap gap-5 lg:gap-x-5">
          <div className="w-full md:w-[48%] lg:w-1/4">
            <Cards
              title="Total Bills"
              currentValue={45000}
              totalValue={100000}
              description=""
              colorScheme="blue"
              icon="dollar"
            />
          </div>
          <div className="w-full md:w-[48%] lg:w-[23%]">
            <Cards
              title="Total Expense"
              currentValue={45000}
              totalValue={100000}
              description=""
              colorScheme="yellow"
              icon="land"
            />
          </div>
          <div className="w-full md:w-[48%] lg:w-[23%]">
            <Cards
              title="Total Collection"
              currentValue={45000}
              totalValue={100000}
              description=""
              colorScheme="green"
              icon="dollar"
            />
          </div>
          <div className="w-full md:w-[48%] lg:w-[23%]">
            <Cards
              title="Total Revenue"
              currentValue={45000}
              totalValue={100000}
              description=""
              colorScheme="green"
              icon="dollar"
            />
          </div>
        </div>

        <h2 className="text-xl font-bold">All Transactions</h2>
        <div className="py-5 w-full flex flex-wrap gap-5 lg:gap-x-5">
          <div className="w-full md:w-[48%] lg:w-1/4">
            <Cards
              title="Total Bills"
              currentValue={45000}
              totalValue={100000}
              description=""
              colorScheme="blue"
              icon="dollar"
              showMonth={false}
              showYear={false}
              showProgress={false}
            />
          </div>
          <div className="w-full md:w-[48%] lg:w-[23%]">
            <Cards
              title="Total Expense"
              currentValue={45000}
              totalValue={100000}
              description=""
              colorScheme="yellow"
              icon="land"
              showMonth={false}
              showYear={false}
              showProgress={false}
            />
          </div>
          <div className="w-full md:w-[48%] lg:w-[23%]">
            <Cards
              title="Total Collection"
              currentValue={45000}
              totalValue={100000}
              description=""
              colorScheme="green"
              icon="dollar"
              showMonth={false}
              showYear={false}
              showProgress={false}
            />
          </div>
          <div className="w-full md:w-[48%] lg:w-[23%]">
            <Cards
              title="Total Revenue"
              currentValue={45000}
              totalValue={100000}
              description=""
              colorScheme="green"
              icon="dollar"
              showMonth={false}
              showYear={false}
              showProgress={false}
            />
          </div>
        </div>

        {/* Table Section - NO container, just padding */}
        <div className=" my-5 bg-[#FFF] border rounded-xl border-gray-100 shadow-xl ">
  <h2 className="p-4 text-xl font-bold">All Transactions</h2>
     <div className="">
           <BillRecordsTable />
     </div>

          <div className="pl-4">
            <button className="cursor-pointer transition-all ease-in-out duration-300 active:scale-95 my-5 py-2 px-10 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg shadow-lg text-white">
              See All Bill Records
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
