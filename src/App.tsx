import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RecipeListingPage from './pages/RecipeListingPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import RecipeListingTypePage from './pages/RecipeListingTypePage';
import FavoritesList from './pages/FavoriteRecipesPage';
import SearchPage from './pages/SearchPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RecipeListingPage />} />
        <Route path="/:type" element={<RecipeListingTypePage />} />
        <Route path="/recipe/:id" element={<RecipeDetailPage />} />
        <Route path="/myList" element={<FavoritesList />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </Router>
  );
};

export default App;
