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
import MonthlyStatements from "./pages/MonthlyStatements ";
import ExpenseCategoryReport from "./pages/ExpenseCategoryReport";
import OwnerTransfer from "./pages/OwnerTransfer";
import UserRoles from "./pages/UserRoles";
import ProtectedRoute from "./components/ProtectedRoute";
import AddRent from "./pages/AddRent";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {isLoginPage ? (
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      ) : (
        <div className="lg:flex min-h-screen bg-gray-50">
          <Sidebar />
          <div className="flex-1 min-w-0 flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Everyone logged in can see Dashboard, All Flat, Bill Records */}
                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/all-flat" element={<ProtectedRoute><AllFlat /></ProtectedRoute>} />
                <Route path="/all-accounts/bill-records" element={<ProtectedRoute><BillRecords /></ProtectedRoute>} />
                
                {/* Admin-only Routes */}
                <Route path="/new-flat" element={<ProtectedRoute reqRole="admin"><NewFlat /></ProtectedRoute>} />
                <Route path="/transfer-owner" element={<ProtectedRoute reqRole="admin"><OwnerTransfer /></ProtectedRoute>} />
                <Route path="/all-flat/edit-flat/:flatId" element={<ProtectedRoute reqRole="admin"><EditFlat /></ProtectedRoute>} />
                <Route path="/all-flat/add-bill/:flatId" element={<ProtectedRoute reqRole="admin"><AddBill /></ProtectedRoute>} />
                
                <Route path="/all-accounts/accounts" element={<ProtectedRoute><Accounts /></ProtectedRoute>} />
                <Route path="/all-accounts/add-rent" element={<ProtectedRoute reqRole="admin"><AddRent /></ProtectedRoute>} />
                <Route path="/all-accounts/add-expense" element={<ProtectedRoute reqRole="admin"><AddExpense /></ProtectedRoute>} />
                <Route path="/all-accounts/expense-report" element={<ProtectedRoute reqRole="admin"><ExpenseCategoryReport /></ProtectedRoute>} />
                
                
                <Route path="/statements" element={<ProtectedRoute><MonthlyStatements /></ProtectedRoute>} />
                <Route path="/user-role" element={<ProtectedRoute reqRole="admin"><UserRoles /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute reqRole="admin"><Settings /></ProtectedRoute>} />
              </Routes>
            </main>
          </div>
        </div>
      )}
    </>
  );
}

export default App;