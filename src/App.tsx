import { BrowserRouter as Router, Route, Routes, useParams, Navigate } from 'react-router-dom';
import RecipeListingPage from './pages/RecipeListingPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import RecipeListingTypePage from './pages/RecipeListingTypePage';
import FavoritesList from './pages/FavoriteRecipesPage';
import SearchPage from './pages/SearchPage';
import AddRecipePage from './pages/AddRecipePage';
import MyRecipePage from './pages/MyRecipePage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';

const TypeRoute = () => {
  const { type = '' } = useParams();
  const validTypes = ['main-dish', 'dessert', 'drink'];

  if (!validTypes.includes(type as string)) {
    return <NotFoundPage />;
  }

  return <RecipeListingTypePage />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/all-recipe" element={<RecipeListingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/:type" element={<TypeRoute />} />
        <Route path="/recipe/:id" element={<RecipeDetailPage />} />
        <Route path="/myList" element={<FavoritesList />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/add-recipe" element={<AddRecipePage />} />
        <Route path="/my-recipe" element={<MyRecipePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
