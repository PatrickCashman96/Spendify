import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Auth = ({ setLogged }) => {
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
      toast.success("Logged in successfully!");
      setLogged(auth.currentUser)
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Signed up successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Sign out successfully!")
    } catch (error) {
      toast.error(error.message);
    }
  }

  if (!auth.currentUser) {
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
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    );
  } else {
    return (
      <div>
        <ToastContainer position="top-right" autoClose={3000} />
        <h2>Switch Account / Logout</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>
    )

  }

};

export default Auth;