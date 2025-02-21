import Auth from "./components/Auth";
import ExpenseTracker from "./components/ExpenseTracker";
import IncomeTracker from "./components/IncomeTracker";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar"
import ExpenseForm from "./components/ExpenseForm";
import IncomeForm from "./components/IncomeForm";
import Home from "./components/Home";

import { auth } from "./firebase";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import React, { useEffect } from "react";

import "./App.css"

function App() {
  const [logged, setLogged] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] =useState(false);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([])

  const toggleSidebar = () =>{
    setIsSidebarOpen(!isSidebarOpen);
    console.log("toggelsidebar called")
  }



  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged((user)=>{
      setLogged(user)
    })

  })
  return (
    <div id="app-container" className={`${isSidebarOpen ? "sidebar-open" : ""}`}>
      <Sidebar isOpen={isSidebarOpen}/>
      
      <div id="main-section">
        <Navbar toggleSidebar={toggleSidebar}/>
        <div id="main-content">
          <Routes>
            <Route path="/" element={<Home expenses={expenses} incomes={incomes} setIncomes={setIncomes} setExpenses={setExpenses} />}></Route>
            <Route path="/expenseTrack" element={auth.currentUser !== null ? <ExpenseTracker expenses={expenses} setExpenses={setExpenses}/> : <Auth setLogged={setLogged}/>}/>
            <Route path="/incomeTrack" element={auth.currentUser !== null ? <IncomeTracker incomes={incomes} setIncomes={setIncomes}/> : <Auth setLogged={setLogged}/>}/>
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;