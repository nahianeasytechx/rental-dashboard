import React from "react";
import Sidebar from "../components/Sidebar";
import Cards from "../components/Cards";
import BillRecordsTable from "../components/BillRecordsTable";

const Home = () => {
  return (
    <>
      <div className="container px-5 mx-auto mt-20 lg:mt-5 ">
        <div className="">
          <h1 className="text-2xl font-semibold py-3">This Month</h1>

            <div className="py-5 w-full flex flex-wrap gap-5">
            <div className="w-full md:w-1/2 lg:w-1/4">
              <Cards
                title="Total Bills"
                currentValue={45000}
                totalValue={100000}
                description=""
                colorScheme="blue"
                icon="dollar"
              />
            </div>
            <div className="w-full md:w-1/2 lg:w-1/4">
              <Cards
                title="Total Expense"
                currentValue={45000}
                totalValue={100000}
                description=""
                colorScheme="yellow"
                icon="land"
              />
            </div>
            <div className="w-full md:w-1/2 lg:w-1/4">
              <Cards
                title="Total Collection"
                currentValue={45000}
                totalValue={100000}
                description=""
                colorScheme="green"
                icon="dollar"
              />
            </div>
            <div className="w-full md:w-1/2 lg:w-1/4">
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
          <div className="py-5 w-full flex flex-wrap gap-5">
            <div className="w-full md:w-1/2 lg:w-1/4">
              <Cards
                title="Total Bills"
                currentValue={45000}
                totalValue={100000}
                description=""
                colorScheme="blue"
                icon="dollar"
                showMonth={false}
                showYear={false}
              />
            </div>
            <div className="w-full md:w-1/2 lg:w-1/4">
              <Cards
                title="Total Expense"
                currentValue={45000}
                totalValue={100000}
                description=""
                colorScheme="yellow"
                icon="land"
                showMonth={false}
                showYear={false}
              />
            </div>
            <div className="w-full md:w-1/2 lg:w-1/4">
              <Cards
                title="Total Collection"
                currentValue={45000}
                totalValue={100000}
                description=""
                colorScheme="green"
                icon="dollar"
                showMonth={false}
                showYear={false}
              />
            </div>
            <div className="w-full md:w-1/2 lg:w-1/4">
              <Cards
                title="Total Revenue"
                currentValue={45000}
                totalValue={100000}
                description=""
                colorScheme="green"
                icon="dollar"
                showMonth={false}
                showYear={false}
              />
            </div>
          </div>
        </div>
<div className="max-w-6xl py-10">

<BillRecordsTable showActions={false} showSearch={false}  />
<div className="w-full ">
<div className="flex justify-center items-center">
<button className="my-5 py-2 px-10 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl  shadow-lg text-white">
  See All
</button>

</div>
</div>
</div>
      </div>
    </>
  );
};

export default Home;
