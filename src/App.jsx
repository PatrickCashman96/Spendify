import React from "react";
import Auth from "./components/Auth";
import ExpenseTracker from "./components/ExpenseTracker";
import { auth } from "./firebase";

function App() {
  return (
    <div>
      <h1>Expense Tracker</h1>
      {auth.currentUser ? <ExpenseTracker /> : <Auth />}
    </div>
  );
}

export default App;