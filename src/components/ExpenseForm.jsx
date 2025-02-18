import React from "react";

const ExpenseForm = ({ onExpenseAdded }) => {
    const [expenseData, setExpenseData] = useState({
        amount: "",
        category:"",
        date:"",
        description:"",
        userId:"",
    });

const handleChange = (e) => {
    setExpenseData({ ...expenseData, [e.target.name]: e.target.value});
};

const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        // TODO: figure out datapoints, for now just fill with pseudos
        const response = await fetch ("api/createExpense",{
        method: 'POST',
        headers: {
            "Content-Type": "app/json",
            // TODO: Inclure Auth Headers JWT ? 
        },
        body: JSON.stringify(expenseData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add expense");
    }

    const newExpense = await response.json();
    onExpenseAdded(newExpense);
    setExpenseData({
        amount:"",
        category:"",
        date:"",
        description:"",
    });
    alert("Expense has been added.");
} catch (error) {
    console.error('Error adding expense:', error);
    alert(error.message); 
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
      {/* Add more categories */}
    </select>

    <label htmlFor="date">Date:</label>
    <input type="date" id="date" name="date" value={expenseData.date} onChange={handleChange} required />

    <label htmlFor="description">Description:</label>
    <textarea id="description" name="description" value={expenseData.description} onChange={handleChange} />

    <button type="submit">Add Expense</button>
  </form>
);
};

export default ExpenseForm;