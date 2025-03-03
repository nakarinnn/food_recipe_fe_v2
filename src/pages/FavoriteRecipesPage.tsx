// FavoriteMenuList.tsx
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Heart } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { Link } from 'react-router-dom';

const FavoriteMenuList: React.FC = () => {

  const user = useSelector((state: RootState) => state.user);

  const [favoriteMenus, setFavoriteMenus] = useState<any[]>([])
  const [likedRecipes, setLikedRecipes] = useState<string[]>([]);

  useEffect(() => {
    const getFavoriteMenu = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_BASE_URL+`/api/like/favoriteMenu/${user.id}`);

        setFavoriteMenus(response.data)

      } catch (error) {
        console.error("Error fetching Favorite Menu:", error);
      }
    };

    const getUserLikes = async () => {
      if (!user.id) return; // ถ้า user ยังไม่ได้ล็อกอิน ไม่ต้องโหลด Like
      try {
        const response = await axios.get(import.meta.env.VITE_BASE_URL+`/api/like/${user.id}/`);
        setLikedRecipes(response.data.likedRecipes);
      } catch (error) {
        console.error("Error fetching user likes:", error);
      }
    };

    getFavoriteMenu();
    getUserLikes();
  }, [])

  const toggleLike = async (recipeId: string) => {
    const userId = user.id;
    try {
      const response = await axios.post(import.meta.env.VITE_BASE_URL+"/api/like", {
        userId,
        targetId: recipeId,
        targetType: "Food",
      });

      if (response.data.liked) {
        setLikedRecipes([...likedRecipes, recipeId]);
      } else {
        setLikedRecipes(likedRecipes.filter((id) => id !== recipeId));
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-4 mx-auto max-w-3xl bg-white shadow-lg rounded-xl mt-8">
        <h2 className="text-2xl font-bold mb-4">รายการอาหารที่ชอบ</h2>
        <div className="space-y-4">
          {favoriteMenus.map((menu: any) => (
            <div
              key={menu.targetId._id} // Ensure this is unique for each menu item
              className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4"
            >
              {/* รูปภาพอยู่ทางซ้าย */}
              <Link to={`/recipe/${menu.targetId._id}`}>
                <img
                  src={menu.targetId.image}
                  alt={menu.targetId.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              </Link>
              <div className="flex-grow">
                <Link to={`/recipe/${menu.targetId._id}`}>
                  <h3 className="text-xl font-semibold">{menu.targetId.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{menu.targetId.description}</p>
                </Link>
                <div className="flex justify-between items-center w-full my-1.5">
                  <button
                    onClick={() => toggleLike(menu.targetId._id)}
                    className={likedRecipes.includes(menu.targetId._id) ? "text-red-700 ml-auto" : "text-red-500 hover:text-red-700 ml-auto"}
                  >
                    <Heart size={20} fill={likedRecipes.includes(menu.targetId._id) ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </>
  );
};

export default FavoriteMenuList;
