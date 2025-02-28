import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RecipeListingPage from './pages/RecipeListingPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import RecipeListingTypePage from './pages/RecipeListingTypePage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RecipeListingPage />} />
        <Route path="/:type" element={<RecipeListingTypePage />} />
        <Route path="/recipe/:id" element={<RecipeDetailPage />} />
      </Routes>
    </Router>
  );
};

export default App;
