import React from 'react'
import { CheckCircle, DollarSign, CreditCard, TrendingUp, Package, Users, Landmark } from 'lucide-react'

const Cards = ({ 
  title = "Bill Paid",
  currentValue = 0,
  totalValue = 312,
  description = "Amount paid in",
  month = new Date().toLocaleString("default", { month: "long" }),
  year = new Date().getFullYear(),
  colorScheme = "blue",
  icon = " ",
  showProgress = true,
  showMonth = true,
  showYear = true,
}) => {
  
  // Color schemes configuration
  const colorSchemes = {
    blue: { gradient: "from-blue-500 via-blue-600 to-indigo-700", progress: "from-blue-400 to-cyan-500" },
    green: { gradient: "from-green-500 via-green-600 to-emerald-700", progress: "from-green-400 to-emerald-500" },
    purple: { gradient: "from-purple-500 via-purple-600 to-violet-700", progress: "from-purple-400 to-pink-500" },
    orange: { gradient: "from-orange-500 via-orange-600 to-red-600", progress: "from-orange-400 to-red-500" },
    pink: { gradient: "from-pink-500 via-pink-600 to-rose-700", progress: "from-pink-400 to-rose-500" },
    yellow: { gradient: "from-yellow-400 via-yellow-600 to-yellow-700", progress: "from-yellow-400 to-yellow-500" },
  }

  // Icon mapping
  const iconMap = { check: CheckCircle, dollar: DollarSign, card: CreditCard, trending: TrendingUp, package: Package, users: Users, land:Landmark }
  const IconComponent = iconMap[icon] || null
  const colors = colorSchemes[colorScheme] || colorSchemes.blue
  const progressPercentage = totalValue > 0 ? (currentValue / totalValue) * 100 : 0

  return (
    <div className="">
      <div className={`relative overflow-hidden rounded-xl bg-white shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl h-full`}> 
        {/* Icon background */}
        {IconComponent && (
          <div className={`absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center`}> 
            <IconComponent className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
        )}

        {/* Header */}
        <div className="relative px-4 py-3">
          <h2 className="text-gray-800 text-lg font-bold tracking-tight">{title}</h2>
        </div>

        {/* Content */}
        <div className="relative px-4 py-4">
          <div className="mb-3">
            <div className="flex items-baseline justify-center gap-1 mb-2">
              <span className="text-3xl font-bold text-gray-800">{currentValue}</span>
              <span className="text-xl font-semibold text-gray-500">/{totalValue}</span>
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
              {description} {showMonth && month && <span className="font-bold">{month}</span>}
            </p>
            {showYear && year && (
              <p className="text-gray-500 text-xs mt-1">{year}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cards