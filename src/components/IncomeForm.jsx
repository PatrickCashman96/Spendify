import { useState, useEffect } from "react";
import { getAuth, getIdToken } from "firebase/auth";
import axios from "axios";

export default function IncomeForm({ income, onIncomeAdded, setEditingIncome }) {
    const [incomeData, setIncomeData] = useState({
        amount: "",
        date:"",
        description:"",
        source:"",
        userId:"",
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

    const handleChange = (e) =>{
        setIncomeData({...incomeData, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();

        try{
            const auth = getAuth();
            const user = auth.currentUser;
            
            if(!user){
                throw new Error("User not signed in. (incomeform)");
            }
            const token = await getIdToken(user);
            
            // add income to firestore
            const response = await axios.post("/.netlify/functions/createIncome",incomeData,{
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            
            const newIncome = response.data;
            onIncomeAdded(newIncome);
            
            setIncomeData({
                amount: "",
                date: "",
                description: "",
                source: "",
            });
            console.log("Income has been added.")
        }catch(error){
            console.error("Error adding income: ", error)
        }
    }


    return(
        <form onSubmit={handleSubmit} className="form">
            <label htmlFor="amout">Amount:</label>
            <input type="number" name="amount" value={incomeData.amount} onChange={handleChange} required/>

            <label htmlFor="date">Date:</label>
            <input type="date" name="date" value={incomeData.date} onChange={handleChange} required/>

            <label htmlFor="description">Description:</label>
            <textarea name="description" value={incomeData.description} onChange={handleChange}/>

            <label htmlFor="source">Source:</label>
            <select name="source" value={incomeData.source} onChange={handleChange } required>
                <option value="">Select Source</option>
                <option value="salary">Salary</option>
                <option value="sideHustle">Side Hustle</option>
                <option value="stock">Stock</option>
                <option value="other">Other</option>
            </select>
            <button type="submit">{income ? "Update Income" : "Add Income"}</button>
            {income && <button type="button" onClick={()=>{setEditingIncome(null)}}>Cancel</button>}
        </form>
    )
}