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
import { Link } from "react-router-dom";
import { IoLogOut } from "react-icons/io5";

// MenuItem Component
function MenuItem({ item, index, isOpen, onClose }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (item.subItems) {
    return (
      <div>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center justify-between px-4 py-3 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors w-full"
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
            dropdownOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="mt-1 ml-4 space-y-1">
            {item.subItems.map((subItem, subIndex) => (
              <a
                key={subIndex}
                href={subItem.path}
                onClick={onClose}
                className="flex items-center px-4 py-2 text-sm text-gray-400 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
              >
                <span className="ml-6">{subItem.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      to={item.path}
      onClick={onClose}
      className="flex items-center space-x-3 px-4 py-3 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
    >
      <item.icon size={20} />
      <span>{item.label}</span>
    </Link>
  );
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: MdDashboardCustomize, label: "Dashboard", path: "/" },
    { icon:BsFillHouseAddFill , label: "Add New Flat", path: "/new-flat" },
    { icon:BsFillHouseAddFill , label: "Ownership Transfer", path: "/transfer-owner" },
        { icon:FiHome, label: "All Flat", path: "/all-flat" },
    {
      icon: MdManageAccounts,
      label: "All Accounts",
      subItems: [
        
        { label: "Accounts", path: "/all-accounts/accounts" },
        { label: "Add Expense", path: "/all-accounts/add-expense" },
        { label: "Expense Report", path: "/all-accounts/expense-report" },
        { label: "Bill Records", path: "/all-accounts/bill-records" },
      ],
    },


    { icon: FiSettings, label: "User Roles", path: "/user-role" },
    { icon: FiSettings, label: "Settings", path: "/settings" },
        { icon: IoLogOut, label: "Logout", path: "/login" }, 
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
              index={index}
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
            />
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className="flex items-center space-x-3 px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
              JD
            </div>
            <div>
              <p className="text-sm font-medium text-white">John Doe</p>
              <p className="text-xs text-gray-400">john@example.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Spacer for desktop */}
      <div className="hidden lg:block lg:w-0" />
    </>
  );
}
