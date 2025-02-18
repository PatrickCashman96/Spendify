import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase";

export default function Summary(){
    const [expenses, setExpenses] = useState(0);
    const [incomes, setIncomes] = useState(0);
    
    useEffect(()=>{
        async function fetchData(){
            try{
                const [expenseSnapshot, incomeSnapshot] = await Promise.all([
                    getDocs(collection(db,"expenses")),
                    getDocs(collection(db,"incomes")),
                ]);

                const totalExpense = expenseSnapshot.docs.reduce((acc,doc)=>{
                    console.log(typeof doc.data().amount, doc.data().amount);
                    console.log("acc: ",acc)
                    return acc + (doc.data().amount||0);
                },0) 
                setExpenses(totalExpense)

                const totalIncomes = incomeSnapshot.docs.reduce((acc,doc)=>{
                    console.log(typeof doc.data().amount, doc.data().amount);
                    console.log("acc: ",acc)
                    return acc + (doc.data().amount||0);
                },0) 
                setIncomes(totalIncomes)
                console.log("total income: ", incomes)
            } catch (error){
                console.error("fetchData Error: ", error)
            };
            
        }
        fetchData()
    },[])
    
    return(
        <>
            <h1>Expenses: {expenses}</h1>
            <h1>Incomes: {incomes}</h1>
            <h1>saving: {incomes - expenses}</h1>
        </>
    )
}