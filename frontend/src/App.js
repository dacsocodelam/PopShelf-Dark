import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Admin from "./pages/Admin/Admin";
import Login from "./pages/Login/Login";
import ProductDetail from "./components/ProductDetail/ProductDetail";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <header className="App-header">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route path="/products/:id" element={<ProductDetail />} />
            </Routes>
          </header>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
