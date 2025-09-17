/*import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Submit from "./pages/Submit";
import About from "./pages/About";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // On page load, get user from localStorage if logged in
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Home user={user} onLogout={handleLogout} />}
        />
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/submit" element={user ? <Submit /> : <Login />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;*/

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import About from "./pages/About";
import Recipes from "./pages/Recipes";
import Home from "./pages/Home";
import Submit from "./pages/Submit";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import AddRecipe from "./pages/AddRecipe";
import ViewRecipe from "./pages/ViewRecipe";
import EditRecipe from "./pages/EditRecipe";
import AdminViewRecipe from "./pages/AdminViewRecipe";
import UserSubmittedRecipes from "./pages/UserSubmittedRecipes";

function App() {
  const [user, setUser] = useState(null);

  // Check localStorage on load
  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) setUser(storedUser);
  }, []);

  const handleLogin = (username) => {
    localStorage.setItem("username", username); // persist login
    setUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Home user={user} onLogout={handleLogout} />}
        />
        <Route
          path="/submit"
          element={
            user ? <Submit user={user} /> : <Navigate to="/login" replace />
          }
        />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/add-recipe" element={<AddRecipe />} />
        <Route path="/view-recipe/:id" element={<ViewRecipe />} />
        <Route path="/edit-recipe/:id" element={<EditRecipe />} />
        <Route path="/admin/view-recipe/:id" element={<AdminViewRecipe />} />
        <Route
          path="/admin/user-submitted-recipes"
          element={<UserSubmittedRecipes />}
        />
      </Routes>
    </Router>
  );
}

export default App;
