import { useState } from "react";
import {
  FiMenu,
  FiX,
  FiHome,
  FiSettings,
  FiUsers,
  FiFileText,
  FiBarChart2,
  FiBell,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";
import { MdDashboardCustomize,MdManageAccounts } from "react-icons/md";
import { BsFillHouseAddFill } from "react-icons/bs";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoLogOut } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";

// MenuItem Component
function MenuItem({ item, isOpen, onClose }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  const isSubItemActive = item.subItems?.some(sub => location.pathname === sub.path);
  const isActive = location.pathname === item.path || isSubItemActive;

  if (item.subItems) {
    return (
      <div>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors w-full ${
            isActive ? "bg-orange-600 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"
          }`}
        >
          <div className="flex items-center space-x-3">
            <item.icon size={20} />
            <span>{item.label}</span>
          </div>
          {dropdownOpen ? (
            <FiChevronDown size={16} className="transition-transform duration-300" />
          ) : (
            <FiChevronRight size={16} className="transition-transform duration-300" />
          )}
        </button>

        {/* Dropdown Sub Items */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            dropdownOpen || isSubItemActive ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="mt-1 ml-4 space-y-1 border-l-2 border-gray-700 pl-2">
            {item.subItems.map((subItem, subIndex) => (
              <Link
                key={subIndex}
                to={subItem.path}
                onClick={onClose}
                className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
                  location.pathname === subItem.path 
                    ? "text-orange-400 bg-gray-800 font-medium" 
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span>{subItem.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      to={item.path}
      onClick={item.onClick || onClose}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        isActive && !item.onClick ? "bg-orange-600 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"
      }`}
    >
      <item.icon size={20} />
      <span>{item.label}</span>
    </Link>
  );
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/login");
  };

  const menuItems = [
    { icon: MdDashboardCustomize, label: "Dashboard", path: "/" },
    // Admin only
    ...(isAdmin ? [
      { icon: BsFillHouseAddFill, label: "Add New Flat", path: "/new-flat" },
      { icon: BsFillHouseAddFill, label: "Ownership Transfer", path: "/transfer-owner" },
    ] : []),
    { icon: FiHome, label: "All Flat", path: "/all-flat" },
    
    // Accounts (mixed)
    {
      icon: MdManageAccounts,
      label: "Accounts",
      subItems: [
        { label: "Accounts Overview", path: "/all-accounts/accounts" },
        ...(isAdmin ? [
          { label: "Collect Rent", path: "/all-accounts/add-rent" },
          { label: "Add Expense", path: "/all-accounts/add-expense" },
          { label: "Expense Report", path: "/all-accounts/expense-report" },
        ] : []),
        { label: "Bill Records", path: "/all-accounts/bill-records" },
        { label: "Statements", path: "/statements" },
      ],
    },

    // Admin only
    ...(isAdmin ? [
      { icon: FiUsers, label: "User Roles", path: "/user-role" },
      { icon: FiSettings, label: "Settings", path: "/settings" },
    ] : []),
    
    { icon: IoLogOut, label: "Logout", path: "/login", onClick: handleLogout }, 
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-gray-900 text-white rounded-lg shadow-lg"
      >
        <FiMenu size={24} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed min-h-screen inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out lg:static lg:transform-none ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold text-white">MyApp</h1>
          <button
            onClick={() => setIsOpen(false)}
            className="w-[80%] lg:hidden text-gray-400 hover:text-white"
          >
            <FiX size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              item={item}
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
            />
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className="flex items-center space-x-3 px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-700 flex items-center justify-center text-white font-semibold">
              {currentUser?.avatar || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{currentUser?.name}</p>
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-400 truncate">{currentUser?.email}</p>
                <span className="text-[10px] uppercase font-bold text-orange-400 bg-orange-400/10 px-1.5 py-0.5 rounded">
                  {currentUser?.role || 'Guest'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Spacer for desktop */}
      <div className="hidden lg:block lg:w-0" />
    </>
  );
}
