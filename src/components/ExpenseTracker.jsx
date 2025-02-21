import ExpenseForm from "./ExpenseForm";
import ExpenseChart from "./ExpenseChart";
import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";

const ExpenseTracker = ({expenses, setExpenses}) => {
  const [editingExpense, setEditingExpense] = useState(null);

  
  // remove an expense 
  const deleteExpense = async (id) => {
    await deleteDoc(doc(db, "expenses", id));
    setEditingExpense(null);
  };

  const startEditingExpense = (expense) => {
    setEditingExpense(expense);
  };

  const updateExpense = async (updatedExpense) => {
    if (editingExpense) {
      try {
          await updateDoc(doc(db, "expenses", editingExpense.id), updatedExpense);
          setEditingExpense(null);
          alert("Expense updated successfully!");
      } catch (error) {
          console.error("Error updating expense:", error);
          alert("Error updating expense. Please try again.");
      }
    }
  };
  

  return (
    <div>
      <h2>Expense Tracker</h2>

      <ExpenseChart expenses={expenses} setExpenses={setExpenses}/>
      <ExpenseForm onExpenseAdded={expense => setExpenses ([...expenses, expense])} />

      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.category} - €{expense.amount} - {expense.description} - {expense.date}
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