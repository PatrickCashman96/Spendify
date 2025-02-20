import IncomeForm from "./IncomeForm";
import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#ff6384", "#36a2eb"];

export default function IncomeTracker({incomes, setIncomes}){

  const [sourceColorMap, setSourceColorMap] = useState({});
  const [selectedSource, setSelectedSource] = useState(null);
  const [editingIncome, setEditingIncome] = useState(null);
  // get income
  useEffect(()=>{
    if (auth.currentUser){
      const q = query(collection(db,"incomes"), where("userId", "==", auth.currentUser.uid));
      const unsubscribe = onSnapshot(q,(snapshot)=>{
        // get income og the logged user
        const fetchedIncomes = snapshot.docs.map(doc=>({id: doc.id, ...doc.data()}))
        setIncomes(fetchedIncomes);

        // set color of the soruce
        const uniqueSource = [...new Set(fetchedIncomes.map(income=>income.source))];
        const sourceColors = uniqueSource.reduce((acc, source, index)=>{
          acc[source] = COLORS[index % COLORS.length];
          return acc
        },{});
        setSourceColorMap(sourceColors);
      });
      return () => unsubscribe();
    }
  },[]);
  // console.log(sourceColorMap)

  // remove an income
  const removeIncome = async(id) =>{
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

  // group incomes by source
  const groupedIncomes = incomes.reduce((acc, income)=>{
    acc[income.source] = (acc[income.source]||0) + Number(income.amount);
    return acc;
  },{});
  
  // prepare piechart
  const pieData = Object.keys(groupedIncomes).map((source, index)=>({
    name: source,
    value: groupedIncomes[source],
  }));  


  // income for selected source 
  const filteredIncomes = selectedSource
  ? incomes.filter(income => income.source === selectedSource) 
  : [];

  // sort income by date
  const sortedIncomes = [...filteredIncomes].sort((a,b)=> new Date(a.date)- new Date(b.date))

  // prepare barchart
  const barData = sortedIncomes.map(income =>({
    date: income.date,
    description: income.description,
    value: Number(income.amount)
  }))


  return(
    <div>
      <h2>Income Tracker</h2>
      <ResponsiveContainer width="100%" height={300} >
        <PieChart>
          <Pie
            data={pieData} 
            dataKey="value" 
            nameKey="name" 
            cx="50%" 
            cy="50%" 
            outerRadius={100} 
            label
            onClick={(source,index)=>{
              console.log("Clicked source:", source.name);
              setSelectedSource(source.name);
            }}
          >
            {pieData.map((entry,index)=> (
              <Cell key={`cell-${index}`} fill={sourceColorMap[entry.name]}/>
            ))}
          </Pie>
          <Tooltip/>
        </PieChart>
      </ResponsiveContainer>

      {selectedSource && (
        <div>
          <h3>{selectedSource}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
              formatter={(value, name, props) => [
                <div>
                  <p>{props.payload.date}</p>
                  <p>{props.payload.description}</p>
                  <p>{`$${value}`}</p>
                </div>
                ]}
              />
              <Bar dataKey="value" fill={sourceColorMap[selectedSource]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <IncomeForm onIncomeAdded={income => setIncomes([...incomes, income])}/>
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
    
  )
}