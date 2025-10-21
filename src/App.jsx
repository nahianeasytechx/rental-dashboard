import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Sidebar from "./components/Sidebar"
import Navbar from "./components/Navbar"

function App() {
  return (
    <>
      <div className="flex">
        <Sidebar/> 
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          <Navbar/>
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home/>}/>
            </Routes>
          </main>
        </div>
      </div>
    </>
  )
}

export default App