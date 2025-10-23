import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import NewFlat from "./pages/NewFlat";
import Accounts from "./pages/Accounts";
import AddExpense from "./pages/AddExpense";
import BillRecords from "./pages/BillRecords";
import AllFlat, { AddBill, EditFlat } from "./pages/AllFlat";
import Login from "./pages/Login";
import Settings from "./pages/Settings";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {isLoginPage ? (
        // Login page without Sidebar and Navbar
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      ) : (
        // All other pages with Sidebar and Navbar
        <div className="lg:flex">
          <Sidebar />
          <div className="flex-1 min-w-0">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/new-flat" element={<NewFlat />} />
              <Route path="/all-accounts/accounts" element={<Accounts />} />
              <Route path="/all-accounts/add-expense" element={<AddExpense />} />
              <Route path="/all-flat" element={<AllFlat />} />
              <Route path="/all-flat/edit-flat/:flatId" element={<EditFlat />} />
              <Route path="/all-flat/add-bill/:flatId" element={<AddBill />} />
              <Route path="/all-accounts/bill-records" element={<BillRecords />} />
              <Route path="/settings" element={<Settings/>}/>
            </Routes>
          </div>
        </div>
      )}
    </>
  );
}

export default App;