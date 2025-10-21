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
    showMonth = true, // new optional control
  showYear = true,  // new optional control
}) => {
  
  // Color schemes configuration
  const colorSchemes = {
    blue: {
      gradient: "from-blue-500 via-blue-600 to-indigo-700",
      progress: "from-blue-400 to-cyan-500"
    },
    green: {
      gradient: "from-green-500 via-green-600 to-emerald-700",
      progress: "from-green-400 to-emerald-500"
    },
    purple: {
      gradient: "from-purple-500 via-purple-600 to-violet-700",
      progress: "from-purple-400 to-pink-500"
    },
    orange: {
      gradient: "from-orange-500 via-orange-600 to-red-600",
      progress: "from-orange-400 to-red-500"
    },
    pink: {
      gradient: "from-pink-500 via-pink-600 to-rose-700",
      progress: "from-pink-400 to-rose-500"
    },
    yellow: {
      gradient: "from-yellow-400 via-yellow-600 to-yellow-700",
      progress: "from-yellow-400 to-yellow-500"
    },
 
  }

  // Icon mapping
  const iconMap = {
    check: CheckCircle,
    dollar: DollarSign,
    card: CreditCard,
    trending: TrendingUp,
    package: Package,
    users: Users,
    land:Landmark
  }

  const IconComponent = iconMap[icon] || null
  const colors = colorSchemes[colorScheme] || colorSchemes.blue
  const progressPercentage = totalValue > 0 ? (currentValue / totalValue) * 100 : 0

  return (
    <div className="w-[90%] h-[90%]">
      <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${colors.gradient} shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl h-full`}>
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-5 rounded-full -mr-12 -mt-12"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white opacity-5 rounded-full -ml-10 -mb-10"></div>
        
        {/* Header */}
        <div className="relative px-4 py-3 border-b border-white/20">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-lg font-bold tracking-tight">{title}</h2>
           {IconComponent && <IconComponent className="text-white/90 w-5 h-5" strokeWidth={2.5} />}

          </div>
        </div>
        
        {/* Content */}
        <div className="relative px-4 py-4">
          {/* Value ratio */}
          <div className="mb-3">
            <div className="flex items-baseline justify-center gap-1 mb-2">
              <span className="text-3xl font-bold text-white">{currentValue}</span>
              <span className="text-xl font-semibold text-white/70">/{totalValue}</span>
            </div>
            
            {/* Progress bar */}
            {showProgress && (
              <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden backdrop-blur-sm">
                <div 
                  className={`bg-gradient-to-r ${colors.progress} h-full rounded-full transition-all duration-500 shadow-lg`}
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            )}
          </div>
          
          {/* Date information */}
          <div className="text-center">
            <p className="text-white/90 text-sm font-medium">
                     {description} {showMonth && month && <span className="font-bold">{month}</span>}
            </p>
      {showYear && year && (
        <p className="text-white/60 text-xs mt-1">
          {year}
        </p>
      )}
          </div>
        </div>
        
        {/* Subtle shine effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"></div>
      </div>
    </div>
  )
}

export default Cards