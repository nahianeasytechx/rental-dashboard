import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const AppContext = createContext(null);

// ─── Default seed data ────────────────────────────────────────────────────────

const DEFAULT_FLATS = [
  { id: 1, flatNo: "A-101", ownerName: "Ahmed Khan",    phoneNumber: "+880 1712-345678", nid: "1234567890123" },
  { id: 2, flatNo: "A-102", ownerName: "Fatima Rahman", phoneNumber: "+880 1823-456789", nid: "2345678901234" },
  { id: 3, flatNo: "B-201", ownerName: "Karim Hossain", phoneNumber: "+880 1934-567890", nid: "3456789012345" },
  { id: 4, flatNo: "B-202", ownerName: "Nusrat Jahan",  phoneNumber: "+880 1645-678901", nid: "4567890123456" },
  { id: 5, flatNo: "C-301", ownerName: "Rahim Uddin",   phoneNumber: "+880 1756-789012", nid: "5678901234567" },
  { id: 6, flatNo: "C-302", ownerName: "Salma Begum",   phoneNumber: "+880 1867-890123", nid: "6789012345678" },
  { id: 7, flatNo: "D-401", ownerName: "Nasir Ahmed",   phoneNumber: "+880 1978-901234", nid: "7890123456789" },
  { id: 8, flatNo: "D-402", ownerName: "Taslima Akter", phoneNumber: "+880 1589-012345", nid: "8901234567890" },
];

const DEFAULT_CATEGORIES = [
  { id: "rentFee",             name: "Rent Fee",               type: "income" },
  { id: "associationFlatRent", name: "Association Flat Rent",  type: "income" },
  { id: "commonCurrentBill",   name: "Common Current Bill",    type: "income" },
  { id: "communityCenterRent", name: "Community Center Rent",  type: "income" },
  { id: "rooftopRoomRent",     name: "Rooftop Room Rent",      type: "income" },
  { id: "development",         name: "Development",            type: "income" },
  { id: "internetBill",        name: "Internet Bill",          type: "expense" },
  { id: "dishBill",            name: "Dish Bill",              type: "expense" },
];

// Seed bills across two months for realistic initial data
const DEFAULT_BILLS = [
  {
    id: 1, flatId: 1, flatNo: "A-101", owner: "Ahmed Khan",
    month: 2, year: 2026,
    rentFee: 15000, internetBill: 800, dishBill: 300,
    associationFlatRent: 1200, commonCurrentBill: 1200,
    communityCenterRent: 500, rooftopRoomRent: 700, development: 500,
    total: 20200, status: "Received", date: "2026-02-01", type: "Monthly Bill",
  },
  {
    id: 2, flatId: 2, flatNo: "A-102", owner: "Fatima Rahman",
    month: 2, year: 2026,
    rentFee: 16000, internetBill: 750, dishBill: 350,
    associationFlatRent: 1000, commonCurrentBill: 1000,
    communityCenterRent: 600, rooftopRoomRent: 650, development: 700,
    total: 21050, status: "Received", date: "2026-02-02", type: "Monthly Bill",
  },
  {
    id: 3, flatId: 3, flatNo: "B-201", owner: "Karim Hossain",
    month: 2, year: 2026,
    rentFee: 14000, internetBill: 600, dishBill: 250,
    associationFlatRent: 900, commonCurrentBill: 900,
    communityCenterRent: 550, rooftopRoomRent: 600, development: 400,
    total: 18200, status: "Pending", date: "2026-02-05", type: "Monthly Bill",
  },
  {
    id: 4, flatId: 4, flatNo: "B-202", owner: "Nusrat Jahan",
    month: 2, year: 2026,
    rentFee: 15000, internetBill: 850, dishBill: 300,
    associationFlatRent: 1100, commonCurrentBill: 1100,
    communityCenterRent: 500, rooftopRoomRent: 0, development: 500,
    total: 19350, status: "Received", date: "2026-02-07", type: "Monthly Bill",
  },
  {
    id: 5, flatId: 5, flatNo: "C-301", owner: "Rahim Uddin",
    month: 3, year: 2026,
    rentFee: 14500, internetBill: 700, dishBill: 300,
    associationFlatRent: 1000, commonCurrentBill: 1000,
    communityCenterRent: 500, rooftopRoomRent: 600, development: 400,
    total: 19000, status: "Pending", date: "2026-03-01", type: "Monthly Bill",
  },
  {
    id: 6, flatId: 6, flatNo: "C-302", owner: "Salma Begum",
    month: 3, year: 2026,
    rentFee: 13000, internetBill: 650, dishBill: 280,
    associationFlatRent: 950, commonCurrentBill: 950,
    communityCenterRent: 480, rooftopRoomRent: 500, development: 350,
    total: 17160, status: "Received", date: "2026-03-02", type: "Monthly Bill",
  },
  {
    id: 7, flatId: 7, flatNo: "D-401", owner: "Nasir Ahmed",
    month: 3, year: 2026,
    rentFee: 17000, internetBill: 900, dishBill: 400,
    associationFlatRent: 1300, commonCurrentBill: 1300,
    communityCenterRent: 700, rooftopRoomRent: 800, development: 600,
    total: 23000, status: "Received", date: "2026-03-03", type: "Monthly Bill",
  },
  {
    id: 8, flatId: 8, flatNo: "D-402", owner: "Taslima Akter",
    month: 3, year: 2026,
    rentFee: 15500, internetBill: 800, dishBill: 320,
    associationFlatRent: 1100, commonCurrentBill: 1100,
    communityCenterRent: 560, rooftopRoomRent: 620, development: 450,
    total: 20450, status: "Pending", date: "2026-03-04", type: "Monthly Bill",
  },
];

const DEFAULT_EXPENSES = [
  { id: 1, category: "Maintenance", amount: 5000,  description: "Elevator maintenance",  date: "2026-02-10" },
  { id: 2, category: "Utilities",   amount: 3200,  description: "Generator fuel",        date: "2026-02-15" },
  { id: 3, category: "Cleaning",    amount: 2000,  description: "Common area cleaning",  date: "2026-03-05" },
  { id: 4, category: "Repair",      amount: 7500,  description: "Water pump repair",     date: "2026-03-10" },
];

const DEFAULT_USERS = [
  { id: 1, name: "Admin User",   email: "admin@demo.com",  password: "admin",  phone: "+880 1712-000000", role: "admin",  status: "active", createdAt: "2025-01-01" },
  { id: 2, name: "Client User",  email: "client@demo.com", password: "client", phone: "+880 1823-000000", role: "client", status: "active", createdAt: "2025-01-01" },
];

// ─── Helper: localStorage with defaults ──────────────────────────────────────

function loadOrSeed(key, defaultData) {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(key, JSON.stringify(defaultData));
    return defaultData;
  } catch {
    return defaultData;
  }
}

function persist(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to persist", key, e);
  }
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function AppProvider({ children }) {
  const [flats,      setFlats]      = useState(() => loadOrSeed("abx_flats",      DEFAULT_FLATS));
  const [bills,      setBills]      = useState(() => loadOrSeed("abx_bills",      DEFAULT_BILLS));
  const [expenses,   setExpenses]   = useState(() => loadOrSeed("abx_expenses",   DEFAULT_EXPENSES));
  const [categories, setCategories] = useState(() => loadOrSeed("abx_categories", DEFAULT_CATEGORIES));
  const [users,      setUsers]      = useState(() => loadOrSeed("abx_users",      DEFAULT_USERS));

  // ── Flat CRUD ──────────────────────────────────────────────────────────────
  const addFlat = useCallback((flatData) => {
    const newFlat = { ...flatData, id: Date.now() };
    setFlats(prev => {
      const next = [...prev, newFlat];
      persist("abx_flats", next);
      return next;
    });
    return newFlat;
  }, []);

  const updateFlat = useCallback((id, updates) => {
    setFlats(prev => {
      const next = prev.map(f => f.id === id ? { ...f, ...updates } : f);
      persist("abx_flats", next);
      return next;
    });
  }, []);

  const transferOwner = useCallback((flatId, newOwnerData) => {
    setFlats(prev => {
      const next = prev.map(f => f.id === flatId ? { ...f, ...newOwnerData } : f);
      persist("abx_flats", next);
      return next;
    });
  }, []);

  const deleteFlat = useCallback((id) => {
    setFlats(prev => {
      const next = prev.filter(f => f.id !== id);
      persist("abx_flats", next);
      return next;
    });
  }, []);

  // ── Bill CRUD ──────────────────────────────────────────────────────────────
  const addBill = useCallback((billData) => {
    const newBill = {
      ...billData,
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      type: "Monthly Bill",
      status: "Pending",
    };
    setBills(prev => {
      const next = [...prev, newBill];
      persist("abx_bills", next);
      return next;
    });
    return newBill;
  }, []);

  const updateBillStatus = useCallback((id, status) => {
    setBills(prev => {
      const next = prev.map(b => b.id === id ? { ...b, status } : b);
      persist("abx_bills", next);
      return next;
    });
  }, []);

  const updateBill = useCallback((id, updates) => {
    setBills(prev => {
      const next = prev.map(b => b.id === id ? { ...b, ...updates } : b);
      persist("abx_bills", next);
      return next;
    });
  }, []);

  const deleteBill = useCallback((id) => {
    setBills(prev => {
      const next = prev.filter(b => b.id !== id);
      persist("abx_bills", next);
      return next;
    });
  }, []);

  // ── Expense CRUD ───────────────────────────────────────────────────────────
  const addExpense = useCallback((expData) => {
    const newExp = { ...expData, id: Date.now() };
    setExpenses(prev => {
      const next = [...prev, newExp];
      persist("abx_expenses", next);
      return next;
    });
    return newExp;
  }, []);

  const updateExpense = useCallback((id, updates) => {
    setExpenses(prev => {
      const next = prev.map(e => e.id === id ? { ...e, ...updates } : e);
      persist("abx_expenses", next);
      return next;
    });
  }, []);

  const deleteExpense = useCallback((id) => {
    setExpenses(prev => {
      const next = prev.filter(e => e.id !== id);
      persist("abx_expenses", next);
      return next;
    });
  }, []);

  // ── Category CRUD ──────────────────────────────────────────────────────────
  const addCategory = useCallback((catData) => {
    const newCat = { ...catData, id: `cat_${Date.now()}` };
    setCategories(prev => {
      const next = [...prev, newCat];
      persist("abx_categories", next);
      return next;
    });
  }, []);

  const updateCategory = useCallback((id, updates) => {
    setCategories(prev => {
      const next = prev.map(c => c.id === id ? { ...c, ...updates } : c);
      persist("abx_categories", next);
      return next;
    });
  }, []);

  const deleteCategory = useCallback((id) => {
    setCategories(prev => {
      const next = prev.filter(c => c.id !== id);
      persist("abx_categories", next);
      return next;
    });
  }, []);

  // ── User CRUD ──────────────────────────────────────────────────────────────
  const addUser = useCallback((userData) => {
    const newUser = { ...userData, id: Date.now(), createdAt: new Date().toISOString().split("T")[0] };
    setUsers(prev => {
      const next = [...prev, newUser];
      persist("abx_users", next);
      return next;
    });
  }, []);

  const updateUser = useCallback((id, updates) => {
    setUsers(prev => {
      const next = prev.map(u => u.id === id ? { ...u, ...updates } : u);
      persist("abx_users", next);
      return next;
    });
  }, []);

  const deleteUser = useCallback((id) => {
    setUsers(prev => {
      const next = prev.filter(u => u.id !== id);
      persist("abx_users", next);
      return next;
    });
  }, []);

  // ── Computed stats ─────────────────────────────────────────────────────────
  const getDashboardStats = useCallback((month, year, clientPhone = null) => {
    const incomeIds = categories.filter(c => c.type === "income").map(c => c.id);
    const expenseIds = categories.filter(c => c.type === "expense").map(c => c.id);

    let filtered = bills;
    
    if (clientPhone) {
      filtered = filtered.filter(b => {
        const flat = flats.find(f => f.id === b.flatId || f.flatNo === b.flatNo);
        return flat && flat.phoneNumber === clientPhone;
      });
    }

    if (month && year) {
      filtered = filtered.filter(b => b.month === month && b.year === year);
    }

    const received = filtered.filter(b => b.status === "Received");
    const pending  = filtered.filter(b => b.status === "Pending");

    const totalBills      = filtered.reduce((s, b) => s + (b.total || 0), 0);
    const totalCollection = received.reduce((s, b) => s + (b.total || 0), 0);
    const totalPending    = pending.reduce((s, b) => s + (b.total || 0), 0);

    let totalExpense = 0;
    received.forEach(b => {
      expenseIds.forEach(id => { totalExpense += (b[id] || 0); });
    });

    let totalIncome = 0;
    received.forEach(b => {
      incomeIds.forEach(id => { totalIncome += (b[id] || 0); });
    });

    const totalRevenue = totalIncome - totalExpense;

    return {
      totalBills,
      totalCollection,
      totalPending,
      totalExpense,
      totalIncome,
      totalRevenue,
    };
  }, [bills, categories, flats]);

  const getAllFlatNumbers = useCallback(() => {
    return [...new Set(bills.map(b => b.flatNo).filter(Boolean))].sort();
  }, [bills]);

  return (
    <AppContext.Provider value={{
      // Data
      flats, bills, expenses, categories, users,
      // Flat actions
      addFlat, updateFlat, transferOwner, deleteFlat,
      // Bill actions
      addBill, updateBillStatus, updateBill, deleteBill,
      // Expense actions
      addExpense, updateExpense, deleteExpense,
      // Category actions
      addCategory, updateCategory, deleteCategory,
      // User actions
      addUser, updateUser, deleteUser,
      // Computed
      getDashboardStats, getAllFlatNumbers,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export default AppContext;
