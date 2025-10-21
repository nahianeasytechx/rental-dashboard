import React, { useState, useRef, useEffect } from "react";
import { FaAngleDown, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    {
      icon: FaUser,
      label: "Profile",
    },
    {
      icon: FaCog,
      label: "Settings",
    },
    {
      icon: FaSignOutAlt,
      label: "Logout",

      danger: true,
    },
  ];

  return (
    <div className="hidden lg:block bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto py-2 px-8">
        <nav>
          <ul className="flex justify-end">
            <li className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="w-10 h-10 border border-gray-400 bg-slate-200 rounded-full flex items-center justify-center">
                  <FaUser className="text-gray-600" size={16} />
                </div>
                <p>username</p>
                <FaAngleDown
                  className={`text-gray-600 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              <div
                className={`absolute z-50 right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden transition-all duration-200 origin-top 
                    ${
                      isDropdownOpen
                        ? "opacity-100 scale-100 visible"
                        : "opacity-0 scale-95 invisible"
                    }`}
              >
                <div className="py-2">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800">
                      John Doe
                    </p>
                    <p className="text-xs text-gray-500">john@example.com</p>
                  </div>

                  {/* Menu Items */}
                  {menuItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex  items-center cursor-pointer space-x-3 px-4 py-2 text-sm transition-colors ${
                        item.danger
                          ? "text-red-600 hover:bg-red-50"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <item.icon size={16} />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
