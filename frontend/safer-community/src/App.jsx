import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import ChatBot from "./pages/ChatBot";
import CrimeHotspots from "./pages/CrimeHotspots";
import Navigate from "./pages/Navigate";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/chatbot" element={<ChatBot />} />
        <Route path="/crimehotspots" element={<CrimeHotspots />} />
        <Route path="/navigate" element={<Navigate />} />
      </Routes>
    </Router>
  );
}

export default App;
