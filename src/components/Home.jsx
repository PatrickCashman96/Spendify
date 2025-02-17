import { db } from "../firebase"
import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"

export default function Home(){
    const[expenses, setExpenses] = useState([]);

    useEffect(()=>{
        async function fetchExpenses(){
            try{
                const querySnapshot = await getDocs(collection(db, "expenses"));
                const expenses = querySnapshot.docs.map(expense => ({
                    id:expense.id,
                    ...expense.data()
                }));
                setExpenses(expenses);
            } catch (error) {
                console.error("Error fetch expense: ", error)
            }
        } 
        fetchExpenses();
    }, [])

    return(
        <div className="home">
            
            <h1>Home</h1>
            <ul>
                {expenses.map(el=>{
                    {console.log(el)}
                })}
            </ul>
            
            
        </div>
    )
}