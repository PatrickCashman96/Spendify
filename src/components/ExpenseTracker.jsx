import ExpenseForm from "./ExpenseForm";
import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#ff6384", "#36a2eb"];

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null)

  // get expense
  useEffect(() => {
    if (auth.currentUser) {
      const q = query(collection(db, "expenses"), where("userId", "==", auth.currentUser.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setExpenses(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      });
      return () => unsubscribe();
    }
  }, []);

  // remove an expense 
  const deleteExpense = async (id) => {
    await deleteDoc(doc(db, "expenses", id));
  };

  // group data by category
  const groupedExpenses = expenses.reduce((acc,expense)=>{
    acc[expense.category] = (acc[expense.category]||0) + Number(expense.amount);
    return acc;
  },{});
  
  // get piechart data
  const pieData = Object.keys(groupedExpenses).map((category, index)=>({
    name: category,
    value: groupedExpenses[category],
  }));  
  console.log("Pie Data: ", pieData);

  // expense for selected category
  const filteredExpenses = selectedCategory
  ? expenses.filter(expense => expense.category === selectedCategory)
  : [];

  const sortedExpenses = [...filteredExpenses].sort((a,b)=> new Date(a.date)- new Date(b.date))

  // get barchart data
  const barData = filteredExpenses.map(expense => ({
    name: expense.date,
    description: expense.description,
    value: Number(expense.amount),
  }))
  console.log("barData:",barData)

  return (
    <div>
      <h2>Expense Tracker</h2>
      <h3> Expense by Category</h3>
      <ResponsiveContainer width="100%" height={300} style={{ backgroundColor: "white" }}>
        <PieChart>
          <Pie 
            data={pieData} 
            dataKey="value" 
            nameKey="name" 
            cx="50%" 
            cy="50%" 
            outerRadius={100} 
            label
            onClick={(category,index)=>{
              console.log("Clicked Category:", category.name);
              setSelectedCategory(category.name);
            }}
          >
            {pieData.map((entry,index)=> (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
            ))}
          </Pie>
          <Tooltip/>
        </PieChart>
      </ResponsiveContainer>
      
      {selectedCategory && (
        <div>
          <h3>{selectedCategory}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value, name, props) => [`$${value}`, `${props.payload.description}`]}/>
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      
      <ExpenseForm/>

      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.category} - ${expense.amount} - {expense.description} 
            <button onClick={() => deleteExpense(expense.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseTracker;