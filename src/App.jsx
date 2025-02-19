import React, { useEffect } from "react";
import Auth from "./components/Auth";
import ExpenseTracker from "./components/ExpenseTracker";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar"
import ExpenseForm from "./components/ExpenseForm";
import IncomeForm from "./components/IncomeForm";
import { auth } from "./firebase";
import { useState } from "react";
function App() {
  const [logged, setLogged] = useState(null);
  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged((user)=>{
      setLogged(user)
    })
  })
  return (
    <div id="body">
      
      
      <Sidebar/>
      <h1>Expense Tracker</h1>
      {auth.currentUser !== null ? <ExpenseTracker /> : <Auth setLogged={setLogged}/>}
      {console.log("auth.currentUser: ", auth.currentUser)}
      <ExpenseForm/>
      <IncomeForm/>
    </div>
  );
}

export default App;