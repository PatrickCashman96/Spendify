import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (auth.currentUser) {
      const q = query(collection(db, "expenses"), where("userId", "==", auth.currentUser.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setExpenses(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      });
      return () => unsubscribe();
    }
  }, []);

  const addExpense = async () => {
    if (!description || !amount) return;
    await addDoc(collection(db, "expenses"), {
      description,
      amount: parseFloat(amount),
      userId: auth.currentUser.uid,
      createdAt: new Date(),
    });
    setDescription("");
    setAmount("");
  };

  const deleteExpense = async (id) => {
    await deleteDoc(doc(db, "expenses", id));
  };

  return (
    <div>
      <h2>Expense Tracker</h2>
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={addExpense}>Add Expense</button>

      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.description} - ${expense.amount}
            <button onClick={() => deleteExpense(expense.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseTracker;