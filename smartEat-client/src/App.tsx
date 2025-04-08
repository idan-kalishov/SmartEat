import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Upload from "./components/Upload";
import ResultsPage from "./components/ResultsPage";
import IngredientVerificationPage from "./pages/IngredientVerificationPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/verify" element={<IngredientVerificationPage />} />
      </Routes>
    </Router>
  );
};

export default App;
