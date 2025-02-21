import { useState, useEffect } from "react";
import { getAuth, getIdToken } from "firebase/auth";
import axios from "axios";


export default function IncomeForm({ income, onIncomeAdded, setEditingIncome }) {
    const [incomeData, setIncomeData] = useState({
        amount: "",
        date: "",
        description: "",
        source: "",
        userId: "",
    });

    useEffect(() => {
        if (income) {
            setIncomeData(income);
        } else {
            setIncomeData({
                amount: "",
                date: "",
                description: "",
                source: "",
            });
        }
    }, [income])

    const handleChange = (e) => {
        setIncomeData({ ...incomeData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                throw new Error("User not signed in. (incomeform)");
            }
            const token = await getIdToken(user);

            const incomeDataWithUserId = {
                ...incomeData,
                userId: user.uid
            };

            let response;
            if (income) {
                response = await axios.post("/.netlify/functions/updateIncome", { id: income.id, ...incomeDataWithUserId }, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
            } else {
                response = await axios.post("/.netlify/functions/createIncome", incomeDataWithUserId, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
            }

            const newIncome = response?.data;

            if (newIncome) {
                onIncomeAdded(newIncome);
            }

            setIncomeData({
                amount: "",
                date: "",
                description: "",
                source: "",
            });

            if (income) {
                setEditingIncome(null);
            }
            console.log("Income has been added/updated.")
        } catch (error) {
            console.error("Error adding/updating income: ", error)
        }
    }


    return (
        <form onSubmit={handleSubmit} className="form">
            <label htmlFor="amout">Amount:</label>
            <input type="number" name="amount" value={incomeData.amount} onChange={handleChange} required />

            <label htmlFor="date">Date:</label>
            <input type="date" name="date" value={incomeData.date} onChange={handleChange} required />

            <label htmlFor="description">Description:</label>
            <textarea name="description" value={incomeData.description} onChange={handleChange} />

            <label htmlFor="source">Source:</label>
            <select name="source" value={incomeData.source} onChange={handleChange} required>
                <option value="">Select Source</option>
                <option value="salary">Salary</option>
                <option value="sideHustle">Side Hustle</option>
                <option value="stock">Stock</option>
                <option value="other">Other</option>
            </select>
            <button type="submit">{income ? "Update Income" : "Add Income"}</button>
        </form>
    )
}