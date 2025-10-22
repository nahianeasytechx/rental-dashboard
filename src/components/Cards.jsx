import React from "react";
import {
  FiCheckCircle,
  FiDollarSign,
  FiCreditCard,
  FiTrendingUp,
  FiPackage,
  FiUsers,
} from "react-icons/fi";
import { BsCollection } from "react-icons/bs";
import { GiHouse } from "react-icons/gi"; // example for landmark
import { GiExpense } from "react-icons/gi";
import { CiMoneyBill } from "react-icons/ci";

const Cards = ({
  title = "Bill Paid",
  currentValue = 0 ,
  totalValue = 312 ,
  currencySymbol = " ৳",
  description = "Amount paid in",
  month = new Date().toLocaleString("default", { month: "long" }),
  year = new Date().getFullYear(),
  colorScheme = "blue",
  icon = " ",
  showProgress = true,
  showMonth = true,
  showYear = true,
}) => {
  const colorSchemes = {
    blue: {
      gradient: "from-blue-500 via-blue-600 to-indigo-700",
      progress: "from-blue-400 to-cyan-500",
    },
    green: {
      gradient: "from-green-500 via-green-600 to-emerald-700",
      progress: "from-green-400 to-emerald-500",
    },
    purple: {
      gradient: "from-purple-500 via-purple-600 to-violet-700",
      progress: "from-purple-400 to-pink-500",
    },
    orange: {
      gradient: "from-orange-500 via-orange-600 to-red-600",
      progress: "from-orange-400 to-red-500",
    },
    pink: {
      gradient: "from-pink-500 via-pink-600 to-rose-700",
      progress: "from-pink-400 to-rose-500",
    },
    red: {
      gradient: "from-red-400 via-red-600 to-red-700",
      progress: "from-red-400 to-red-500",
    },
  };

  // Define a small component for BDT
  const BdtIcon = () => (
    <span className="text-white font-bold text-base">৳</span>
  );
  const iconMap = {
    check: FiCheckCircle,
    dollar: FiDollarSign,
    card: FiCreditCard,
    trending: FiTrendingUp,
    package: FiPackage,
    users: FiUsers,
    land: GiHouse,
    bdt: BdtIcon,
    collection: BsCollection,
    expense:GiExpense,
    bill:CiMoneyBill
  };

  const IconComponent = iconMap[icon] || null;
  const colors = colorSchemes[colorScheme] || colorSchemes.blue;
  const progressPercentage =
    totalValue > 0 ? (currentValue / totalValue) * 100 : 0;

  return (
    <div>
<div
  className={`relative overflow-hidden rounded-lg bg-white shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl h-full group`}
>
  {IconComponent && (
    <div
      className={`absolute top-3 right-2 w-10  h-10 rounded-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center transition-transform duration-300 group-hover:rotate-45`}
    >
      <IconComponent size={20} color="white" />
    </div>
  )}


        <div className="relative px-4 py-3">
          <h2 className="text-gray-800 text-sm xl:text-lg font-bold tracking-tight">
            {title}
          </h2>
        </div>

        <div className="relative px-4 py-4">
          <div className="mb-3">
            <div className="flex items-baseline justify-center gap-1 mb-2">
              <span className="xl:text-xl font-bold text-gray-800">
               {currencySymbol} {currentValue}
              </span>
              <span className="xl:text-xl font-semibold text-gray-500">
                / {currencySymbol} {totalValue}
              </span>
            </div>
            {showProgress && (
              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden backdrop-blur-sm">
                <div
                  className={`bg-gradient-to-r ${colors.progress} h-full rounded-full transition-all duration-500 shadow-lg`}
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            )}
          </div>
          <div className="text-center">
            <p className="text-gray-700 text-sm font-medium">
              {description}{" "}
              {showMonth && month && <span className="font-bold">{month}</span>}
            </p>
            {showYear && year && (
              <p className="text-gray-500 text-xs mt-1">{year}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;
