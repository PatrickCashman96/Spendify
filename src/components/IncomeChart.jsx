import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#ff6384", "#36a2eb"];

const IncomeChart = ({ incomes, setIncomes }) => {
  const [sourceColorMap, setSourceColorMap] = useState({});
  const [selectedSource, setSelectedSource] = useState(null);
  const [toggleBarChart, setToggleBarChart] = useState(false);
  // get income
  useEffect(() => {
    if (auth.currentUser) {
      const q = query(collection(db, "incomes"), where("userId", "==", auth.currentUser.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        // get income og the logged user
        const fetchedIncomes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setIncomes(fetchedIncomes);

        // set color of the soruce
        const uniqueSource = [...new Set(fetchedIncomes.map(income => income.source))];
        const sourceColors = uniqueSource.reduce((acc, source, index) => {
          acc[source] = COLORS[index % COLORS.length];
          return acc
        }, {});
        setSourceColorMap(sourceColors);
      });
      return () => unsubscribe();
    }
  }, []);

  // group incomes by source
  const groupedIncomes = incomes.reduce((acc, income) => {
    acc[income.source] = (acc[income.source] || 0) + Number(income.amount);
    return acc;
  }, {});

  // prepare piechart
  const pieData = Object.keys(groupedIncomes).map((source, index) => ({
    name: source,
    value: groupedIncomes[source],
  }));


  // income for selected source 
  const filteredIncomes = selectedSource
    ? incomes.filter(income => income.source === selectedSource)
    : [];

  // sort income by date
  const sortedIncomes = [...filteredIncomes].sort((a, b) => new Date(a.date) - new Date(b.date))

  // prepare barchart
  const barData = sortedIncomes.map(income => ({
    date: income.date,
    description: income.description,
    value: Number(income.amount)
  }))

  return (
    <div className="charts">
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
            onClick={(source, index) => {
              console.log("Clicked source:", source.name);
              if (selectedSource === source.name) {
                setToggleBarChart(prev => !prev);
              } else {
                setSelectedSource(source.name);
                setToggleBarChart(true);
              }
            }}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={sourceColorMap[entry.name]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {selectedSource && toggleBarChart && (
        <div className={`barchart ${toggleBarChart ? "active" : ""}`}>
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
    </div>
  )


}

export default IncomeChart;