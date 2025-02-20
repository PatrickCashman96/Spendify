import { useState, useEffect } from 'react';
import { getAuth, getIdToken } from "firebase/auth";
import axios from "axios";

export default function ExpenseForm ({expense, onExpenseAdded, setEditingExpense}) {
  const [expenseData, setExpenseData] = useState({
      amount: "",
      category:"",
      date:"",
      description:"",
      userId:"",
  });

  useEffect(() => {
    if (expense) {
      setExpenseData(expense);
    } else {
      setExpenseData({
        amount: "",
        date: "",
        description: "",
        category: "",
      });
  }
}, [expense])

  const handleChange = (e) => {
    setExpenseData({ ...expenseData, [e.target.name]: e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error("User is not signed in.");
      }
      const token = await getIdToken(user);

      // add expense to firestore
      const response = await axios.post("/.netlify/functions/createExpense",expenseData,{
        headers:{
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
      });
      
      const newExpense = response.data;
      onExpenseAdded(newExpense);
      
      setExpenseData({
          amount:"",
          category:"",
          date:"",
          description:"",
      });
      console.log("Expense has been added.");
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="amount">Amount:</label>
      <input
        type="number"
        id="amount"
        name="amount"
        value={expenseData.amount}
        onChange={handleChange}
        required
      />

      <label htmlFor="category">Category:</label>
      <select id="category" name="category" value={expenseData.category} onChange={handleChange} required>
        <option value="">Select a category</option>
        <option value="food">Food</option>
        <option value="transportation">Transportation</option>
        <option value="housing">Housing</option>
        <option value="entertainment">Entertainment</option>
        {/* Add more categories */}
      </select>

      <label htmlFor="date">Date:</label>
      <input type="date" id="date" name="date" value={expenseData.date} onChange={handleChange} required />

      <label htmlFor="description">Description:</label>
      <textarea id="description" name="description" value={expenseData.description} onChange={handleChange} />

      <button type="submit">{expense ? "Update Expense" : "Add Expense"}</button>
      {expense && <button type="button" onClick={() => setEditingExpense(null)}>Cancel</button>}
    </form>
  )
}

