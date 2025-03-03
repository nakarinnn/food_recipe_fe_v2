import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Heart } from "lucide-react";
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import axios from 'axios';

const RecipeListingPage = () => {

  const [likedRecipes, setLikedRecipes] = useState<string[]>([]);
  const [foods, setFoods] = useState<any>([]);
  const [foodWithAverageRating, setFoodWithAverageRating] = useState<any>([]);
  const { type } = useParams();

  // Get user state from Redux
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const getFoods = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_BASE_URL+"/api/food/foodtype/"+`${type}`);
        setFoods(response.data);

      } catch (error) {
        console.error("Error fetching foods:", error);
      }
    };

    const getUserLikes = async () => {
      if (!user.id) return; // ถ้า user ยังไม่ได้ล็อกอิน ไม่ต้องโหลด Like
      try {
        const response = await axios.get(import.meta.env.VITE_BASE_URL+`/api/like/${user.id}/`);

        setLikedRecipes(response.data.likedRecipes); // 🔥 ตั้งค่า state ด้วย ID ที่เคยกด Like
      } catch (error) {
        console.error("Error fetching user likes:", error);
      }
    };

    getFoods();
    getUserLikes();
  }, [type, user.id]);

  const calculateAverageRatings = async (foodList: any) => {
    const updatedFoods = await Promise.all(
      foodList.map(async (food: { _id: any; }) => {
        try {
          const response = await axios.post(import.meta.env.VITE_BASE_URL+`/api/rating/average-rating`, {
            foodId: food._id,
          });
          return { ...food, averageRating: response.data };
        } catch (error) {
          console.error(`Error fetching average rating for ${food._id}:`, error);
          return { ...food, averageRating: 0 };
        }
      })
    );

    setFoodWithAverageRating(updatedFoods)
  };

  useEffect(() => {
    calculateAverageRatings(foods);
  }, [foods]);

  const toggleLike = async (recipeId: string) => {
    const userId = user.id
    try {
      const response = await axios.post(import.meta.env.VITE_BASE_URL+"/api/like", {
        userId,
        targetId: recipeId,
        targetType: "Food"
      });

      if (response.data.liked) {
        setLikedRecipes([...likedRecipes, recipeId]);
      } else {
        setLikedRecipes(likedRecipes.filter(id => id !== recipeId));
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 mx-auto max-w-6xl">
        <h2 className="text-2xl font-bold mb-4">รายการอาหาร</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {foodWithAverageRating.map((recipe: any) => (
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
                <p className="text-yellow-500 font-bold">⭐ {recipe.averageRating.toFixed(1)}</p>
                <button onClick={() => toggleLike(recipe._id)}
                  className={likedRecipes.includes(recipe._id) ? "text-red-700" : "text-red-500 hover:text-red-700"}>
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
