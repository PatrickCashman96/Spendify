import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";


export default function IncomeForm({onIncomeAdded}){
    const [incomeData, setIncomeData] = useState({
        amount: "",
        date:"",
        description:"",
        source:"",
        userId:"",
    });

    const handleChange = (e) =>{
        setIncomeData({...incomeData, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();

        try{
            const amount = parseFloat(incomeData.amount)
            const income = await addDoc(collection(db, "incomes"),{
                amount: amount,
                date: incomeData.date,
                description: incomeData.description,
                source: incomeData.source,
                userId: "placeholder"
            })
            console.log("income added with id: ", income.id);

            setIncomeData({
                amount: "",
                date: "",
                description: "",
                source: "",
            });

            if (onIncomeAdded){
                onIncomeAdded();
            }
        }catch(error){
            console.error("Error add income: ", error)
        }
    }


    return(
        <form onSubmit={handleSubmit} className="form">
            <label htmlFor="amout">Amount:</label>
            <input type="number" name="amount" value={incomeData.amount} onChange={handleChange} required/>

            <label htmlFor="date">Date:</label>
            <input type="date" name="date" value={incomeData.date} onChange={handleChange} required/>

            <label htmlFor="description">Description:</label>
            <textarea name="description" value={incomeData.description} onChange={handleChange} required/>

            <label htmlFor="source">Source:</label>
            <select name="source" value={incomeData.source} onChange={handleChange } required>
                <option value="">Select Source</option>
                <option value="salary">Salary</option>
                <option value="sideHustle">Side Hustle</option>
                <option value="stock">Stock</option>
                <option value="other">Other</option>
            </select>
            <button type="submit">Add Income</button>
        </form>
    )
}