import { Link } from "react-router-dom";
import ExpenseChart from "./ExpenseChart";
import IncomeChart from "./IncomeChart";
import "./Home.css"

export default function Home({ incomes, expenses, setExpenses, setIncomes }) {
    // console.log(incomes)
    const totalIncome = incomes.reduce((acc, income) => acc + Number(income.amount), 0);
    // console.log("totalIncome: ", totalIncome)
    const totalExpense = expenses.reduce((acc, expense) => acc + Number(expense.amount), 0);
    // console.log("totalExpense: ", totalExpense)
    const currentSaving = Math.abs(totalIncome - totalExpense);

    return (
        <div className="home">

            {/* <h1>Hello {auth.currentUser.email}</h1> */}
            <h2>
                {totalIncome > totalExpense
                    ? `You have €${currentSaving} in your saving`
                    : `You are in €${Math.abs(currentSaving)} debt`}
            </h2>


            <sect id="home">

                <section className="chart-container">
                    <Link to="/expenseTrack"><h2>Expenses</h2></Link>
                    <ExpenseChart expenses={expenses} setExpenses={setExpenses} />
                </section>

                <section className="chart-container">
                    <Link to="/incomeTrack"><h2>Income</h2></Link>
                    <IncomeChart incomes={incomes} setIncomes={setIncomes} />
                </section>
            </sect>

        </div>
    )
}