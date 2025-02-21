import ExpenseForm from "./ExpenseForm";
import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import ExpenseChart from "./ExpenseChart";
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#ff6384", "#36a2eb"];

const ExpenseTracker = ({expenses, setExpenses}) => {
  const [editingExpense, setEditingExpense] = useState(null);

  // remove an expense 
  const deleteExpense = async (id) => {
    await deleteDoc(doc(db, "expenses", id));
    setEditingExpense(null);
  };

  // Edit an expense
  const startEditingExpense = (expense) => {
    setEditingExpense(expense);
  };

  const updateExpense = async (updatedExpense) => {
    if (editingExpense) {
      try {
        await updateDoc(doc(db, "expenses", editingExpense.id), updatedExpense);
        setEditingExpense(null);
        alert("Expense updated successfully!");
      } catch {
        console.error("Error updating expense::", error);
        alert("Error updating expense. Please try again.");
      }
    }
  };

  return (
    <div>
      <h2>Expense Tracker</h2>
      <ExpenseChart expenses={expenses} setExpenses={setExpenses}/>
      <ExpenseForm onExpenseAdded={expense => setExpenses([...expenses, expense])}/>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.category} - &euro;{expense.amount} - {expense.description} 
            <button onClick={() => deleteExpense(expense.id)}>Delete</button>
            <button onClick={() => startEditingExpense(expense)}>Edit</button>

            {editingExpense && editingExpense.id === expense.id && (
              <ExpenseForm
                expense={editingExpense}
                onExpenseAdded={updateExpense}
                setEditingExpense={setEditingExpense}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseTracker;