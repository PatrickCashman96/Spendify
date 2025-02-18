import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, getIdToken, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import axios from 'axios';
import ExpenseForm from './components/ExpenseForm';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);

      if (user) {
        try {
          await fetchExpenses(user.uid);
        } catch (error) {
          console.error("Error fetching expenses on auth state change:", error);
        }
      } else {
        setExpenses([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleExpenseAdded = (newExpense) => {
    setExpenses([...expenses, newExpense]);
  };

  const fetchExpenses = async (userId) => {
    try {
      const auth = getAuth();
      const token = await getIdToken(auth.currentUser);

      const response = await axios.get('/.netlify/functions/getExpenses', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const handleAuthChange = (e) => {
    if (e.target.name === "email") {
      setEmail(e.target.value);
    } else if (e.target.name === "password") {
      setPassword(e.target.value);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);

    try {
      const auth = getAuth();
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Authentication error:", error);
      setAuthError(error.message);
    }
  };

  const handleSignOut = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      {!user && (
        <form onSubmit={handleAuthSubmit}>
          <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={handleAuthChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={handleAuthChange}
            required
          />
          <button type="submit">{isSignUp ? "Sign Up" : "Sign In"}</button>
          <p onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
          </p>
          {authError && <p style={{ color: "red" }}>{authError}</p>}
        </form>
      )}

      {user && (
        <div>
          <h1>Expense Tracker</h1>
          <button onClick={handleSignOut}>Sign Out</button>
          <ExpenseForm onExpenseAdded={handleExpenseAdded} />
        </div>
      )}
    </div>
  );
};

export default App;