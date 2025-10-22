import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import NewFlat from "./pages/NewFlat";
import Accounts from "./pages/Accounts";
import AddExpense from "./pages/AddExpense";
import BillRecords from "./pages/BillRecords";

function App() {
  return (
    <>
      <div className="lg:flex">
        <Sidebar />
        <div className="flex-1 min-w-0 ">
          {/* flex-1: takes remaining space */}
          {/* min-w-0: prevents flex item from overflowing */}
          <Navbar/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new-flat" element={ <NewFlat/> }/>
            <Route path="/all-accounts/accounts" element={ <Accounts/> }/>
            <Route path="/all-accounts/add-expense" element={ <AddExpense/> }/>
            <Route path="/all-accounts/bill-records" element={ <BillRecords/> }/>
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;