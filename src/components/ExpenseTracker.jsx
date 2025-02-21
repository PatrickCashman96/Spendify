import ExpenseForm from "./ExpenseForm";
import ExpenseChart from "./ExpenseChart";
import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";

const ExpenseTracker = ({expenses, setExpenses}) => {
  const [editingExpense, setEditingExpense] = useState(null);

  
  useEffect(() => {
    if (auth.currentUser) {
      const q = query(collection(db, "expenses"), where("userId", "==", auth.currentUser.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
          const fetchedExpenses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setExpenses(fetchedExpenses);
      });
      return () => unsubscribe();
  }
  }, []);

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

        const updatedExpenses = expenses.map(expense => 
          expense.id === updatedExpense.id ? updatedExpense : expense
        );
        setExpenses(updatedExpenses);
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
      <ExpenseForm onExpenseAdded={(newExpense) => {
                setExpenses([...expenses, newExpense]); // Create a new array!
            }}
            setEditingExpense={setEditingExpense}
      />

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