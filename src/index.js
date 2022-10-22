import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import App from "./App";
import Login from "./Login";
import Register from "./Register";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./Home";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  </BrowserRouter>
);
