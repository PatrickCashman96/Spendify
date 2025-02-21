import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#ff6384", "#36a2eb"];

const ExpenseChart = ({ expenses, setExpenses }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryColorMap, setCategoryColorMap] = useState({});
  const [toggleBarChart, setToggleBarChart] = useState(null);

  useEffect(() => {
    if (auth.currentUser) {
      const q = query(collection(db, "expenses"), where("userId", "==", auth.currentUser.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        // get the expense of the logged in user
        const fetchedExpenses = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setExpenses(fetchedExpenses);

        console.log("fetchedExpenses: ", fetchedExpenses)
        // get the color of the category
        const uniqueCategory = [...new Set(fetchedExpenses.map(expense => expense.category))];

        const categoryColors = uniqueCategory.reduce((acc, category, index) => {
          acc[category] = COLORS[index % COLORS.length];
          return acc;
        }, {});
        setCategoryColorMap(categoryColors);
      });
      return () => unsubscribe();
    }
  }, []);

  // group data by category
  const groupedExpenses = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount);
    return acc;
  }, {});

  // get piechart data
  const pieData = Object.keys(groupedExpenses).map((category, index) => ({
    name: category,
    value: groupedExpenses[category],
  }));
  console.log("Expense Pie Data: ", pieData);

  // expense for selected category
  const filteredExpenses = selectedCategory
    ? expenses.filter(expense => expense.category === selectedCategory)
    : [];

  const sortedExpenses = [...filteredExpenses].sort((a, b) => new Date(a.date) - new Date(b.date))

  // get barchart data
  const barData = sortedExpenses.map(expense => ({
    date: expense.date,
    description: expense.description,
    value: Number(expense.amount),
  }));
  console.log("Expense Bar Data:", barData);

  return (
    <div className="charts">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
            onClick={(category, index) => {
              console.log("Clicked Category:", category.name);
              if (selectedCategory === category.name) {
                setToggleBarChart(prev => !prev);
              } else {
                setSelectedCategory(category.name);
                setToggleBarChart(true);
              }


            }}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={categoryColorMap[entry.name]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {selectedCategory && toggleBarChart && (
        <div className="barchart">
          <h3>{selectedCategory}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value, name, props) => [
                  <div>
                    <p>{props.payload.date}</p>
                    <p>{props.payload.description}</p>
                    <p>{`$${value}`}</p>
                  </div>
                ]} />
              <Bar dataKey="value" fill={categoryColorMap[selectedCategory]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}


    </div>
  )
}

export default ExpenseChart;