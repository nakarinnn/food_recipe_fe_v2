import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Heart } from "lucide-react";
import axios from 'axios';

const RecipeListingPage = () => {

  const [likedRecipes, setLikedRecipes] = useState<number[]>([]);
  const [foods, setFoods] = useState([]);

  const { type } = useParams();

  useEffect(() => {
    const getFoods = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/foodtype/${type}`);
        setFoods(response.data);
      } catch (error) {
        console.error("Error fetching random foods:", error);
      }
    };

    getFoods();
  }, []);

  const toggleLike = (id: number) => {
    setLikedRecipes((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <>
      <Navbar />
      <div className="p-6 mx-auto max-w-6xl">
        <h2 className="text-2xl font-bold mb-4">รายการอาหาร</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {foods.map((recipe: any) => (
            <div key={recipe._id} className="border p-4 rounded-lg shadow-md bg-white">
              <Link to={`/recipe/${recipe._id}`}>
                <img src={recipe.image} alt={recipe.name} className="w-full h-40 object-cover rounded-lg mb-2" />
              </Link>
              <Link to={`/recipe/${recipe._id}`}>
                <h3 className="text-lg font-semibold mb-1">{recipe.name}</h3>
              </Link>
              <div className="text-gray-600 text-sm mb-2 h-10 overflow-hidden" style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2 }}>
                  {recipe.description}
              </div>
              <div className="flex justify-between items-center">
                {/* <p className="text-yellow-500 font-bold">⭐ {recipe.rating}</p> */}
                <p className="text-yellow-500 font-bold">⭐ 0</p>
                <button onClick={() => toggleLike(recipe.id)} className={likedRecipes.includes(recipe._id) ? "text-red-700" : "text-red-500 hover:text-red-700"}>
                  <Heart size={20} fill={likedRecipes.includes(recipe._id) ? "currentColor" : "none"} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default RecipeListingPage;
