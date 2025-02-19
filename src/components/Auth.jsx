import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const Auth = ({setLogged}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Add useEffect to check authentication state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("User is signed in:", user);
        setLogged(auth.currentUser)
      } else {
        console.log("No user is signed in.");
      }
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Logged in successfully!");
      setLogged(auth.currentUser)
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Signed up successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>Login / Signup</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleSignup}>Signup</button>
    </div>
  );
};

export default Auth;