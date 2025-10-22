import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <div className="lg:flex">
        <Sidebar />
        <div className="flex-1 min-w-0 bg-gray-100">
          {/* flex-1: takes remaining space */}
          {/* min-w-0: prevents flex item from overflowing */}
          <Navbar/>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;