import { useEffect, useState } from "react"
import { auth } from "../firebase";
import { Link } from "react-router-dom";

export default function Home({incomes, expenses}){
    console.log(incomes)
    const totalIncome = incomes.reduce((acc, income)=> acc+Number(income.amount), 0);
    console.log("totalIncome: ", totalIncome)
    const totalExpense = expenses.reduce((acc, expense)=> acc+Number(expense.amount),0);
    console.log("totalExpense: ", totalExpense)
    const currentSaving = totalIncome-totalExpense;
    return(
        <div className="home">
            
            {/* <h1>Hello {auth.currentUser.email}</h1> */}
            <h2>You currently have ${currentSaving} in your saving</h2>
            <h3>Go to <Link to="/incomeTrack">Income</Link> or <Link to="/expenseTrack">Expense</Link> for further detail</h3>
            
        </div>
    )
}