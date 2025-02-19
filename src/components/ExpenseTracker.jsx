import ExpenseForm from "./ExpenseForm";
import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#ff6384", "#36a2eb"];

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);


  useEffect(() => {
    if (auth.currentUser) {
      const q = query(collection(db, "expenses"), where("userId", "==", auth.currentUser.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setExpenses(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      });
      return () => unsubscribe();
    }
  }, []);

  const deleteExpense = async (id) => {
    await deleteDoc(doc(db, "expenses", id));
  };

  const groupedExpenses = expenses.reduce((acc,expense)=>{
    acc[expense.category] = (acc[expense.category]||0) + Number(expense.amount);
    return acc;
  },{});
  
  console.log("GE",groupedExpenses)
  const pieData = Object.keys(groupedExpenses).map((category, index)=>({
    name: category,
    value: groupedExpenses[category],
  }))
  

  return (
    <div>
      <h2>Expense Tracker</h2>
      <ExpenseForm/>

      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.category} - ${expense.amount} - {expense.description} 
            <button onClick={() => deleteExpense(expense.id)}>Delete</button>
          </li>
        ))}
      </ul>
      
      <h3> Expense by Category</h3>
      <ResponsiveContainer width="100%" height={300} style={{ backgroundColor: "white" }}>
        <PieChart>
          <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
            {pieData.map((entry,index)=> (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
            ))}
          </Pie>
          <Tooltip/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseTracker;