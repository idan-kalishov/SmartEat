import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Upload from "./components/Upload";
import ResultsPage from "./pages/ResultsPage";
import IngredientVerificationPage from "./pages/IngredientVerificationPage";
import { Toaster } from "sonner";
import UserPreferences from "./pages/preferencesPAge";
import ProfilePage from "./pages/Profile";

const App: React.FC = () => {
  return (
    <Router>
      <Toaster position="bottom-center" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/verify" element={<IngredientVerificationPage />} />
        <Route path="/preferences" element={<UserPreferences />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
};

export default App;
