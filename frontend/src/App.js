import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Tasks from "./Pages/Tasks";
import { Container, Box, CssBaseline } from "@mui/material";
import NavBar from "./component/molecule/Navbar";

// A wrapper component to use useLocation inside Router
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);


  return (
    <>
      <CssBaseline />
      <NavBar token={token} setToken={setToken} />
      <Container maxWidth="md">
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 2,
          }}
        >
          <Routes>
            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/tasks" element={<Tasks token={token} />} />
            <Route path="/" element={<div>Welcome to the App!</div>} />
          </Routes>
        </Box>
      </Container>
    </>
  );
}

export default AppWrapper;
