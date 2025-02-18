// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import { auth } from "../firebase/firebaseService"; // Import your Firebase auth service
import { onAuthStateChanged } from "firebase/auth";

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // Set the user on login or logout
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
