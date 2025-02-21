import IncomeForm from "./IncomeForm";
import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";

import IncomeChart from "./IncomeChart";


export default function IncomeTracker({incomes, setIncomes}){
  const [editingIncome, setEditingIncome] = useState(null);

  // remove an income
  const removeIncome = async (id) => {
    await deleteDoc(doc(db, "incomes", id));
    setEditingIncome(null);
  };

  const startEditingIncome = (income) => {
    setEditingIncome(income);
  }

  const updateIncome = async (updatedIncome) => {
    if (editingIncome) {
      try {
        await updateDoc(doc(db, "incomes", editingIncome.id), updatedIncome);
        setEditingIncome(null); // Clear editing state after update
        alert("Income updated successfully!");
      } catch (error) {
        console.error("Error updating income:", error);
        alert("Error updating income. Please try again.");
      }
    }
  };

  return (
    <div>
      <IncomeChart incomes={incomes} setIncomes={setIncomes} />
      <IncomeForm onIncomeAdded={income => setIncomes([...incomes, income])} />
      <ul>
        {incomes.map((income) => (
          <li key={income.id}>
            {income.source} - €{income.amount} - {income.description} - {income.date}
            <button onClick={() => removeIncome(income.id)}>Delete</button>
            <button onClick={() => startEditingIncome(income)}>Edit</button>

            {editingIncome && editingIncome.id === income.id && (
              <IncomeForm
                income={editingIncome}
                onIncomeAdded={updateIncome}
                setEditingIncome={setEditingIncome}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );

}