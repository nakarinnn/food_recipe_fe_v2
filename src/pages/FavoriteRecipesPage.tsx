import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { Link } from 'react-router-dom';
import Loading from '../components/Loading';
import Footer from '../components/footer';

const FavoriteMenuList: React.FC = () => {

  const user = useSelector((state: RootState) => state.user);

  const [favoriteMenus, setFavoriteMenus] = useState<any[]>([])
  const [likedRecipes, setLikedRecipes] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);

  const getFavoriteMenu = async () => {
    if (!user.id) {
      setLoading(false)
      return;
    }

    try {
      const response = await axios.get(import.meta.env.VITE_LIKE_SERVICE_API + `/api/like/favoriteMenu`,
        {
          withCredentials: true
        }
      );

      setFavoriteMenus(response.data)

    } catch (error) {
      console.error("Error fetching Favorite Menu:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const getUserLikes = async () => {
      if (!user.id) {
        return;
      }
      try {
        const response = await axios.get(import.meta.env.VITE_LIKE_SERVICE_API + `/api/like`,
          {
            withCredentials: true
          }
        );
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
    if (!userId) return;
    try {
      const response = await axios.post(import.meta.env.VITE_LIKE_SERVICE_API + "/api/like", {
        targetId: recipeId,
        targetType: "Food",
      }, {
        withCredentials: true
      });

      if (response.data.liked) {
        setLikedRecipes([...likedRecipes, recipeId]);
      } else {
        setLikedRecipes(likedRecipes.filter((id) => id !== recipeId));
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      getFavoriteMenu();
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Navbar />
      <div className="bg-orange-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden max-w-4xl mx-auto border border-orange-100">
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-6 relative">
              <h1 className="text-2xl md:text-3xl font-bold text-white">รายการอาหารโปรด</h1>
              <p className="text-orange-300 mt-2 max-w-2xl">สูตรอาหารที่คุณชื่นชอบและบันทึกไว้</p>
              <div className="absolute right-6 top-6 bg-orange-500 p-2 rounded-full shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>

            <div className="p-6 md:p-8">
              {favoriteMenus.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-orange-100 rounded-full p-4 mb-4 inline-flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <p className="text-lg text-gray-600 mb-2">ยังไม่มีรายการอาหารที่คุณชอบ</p>
                  <p className="text-gray-500">กดที่ไอคอนหัวใจเพื่อเพิ่มเมนูโปรดของคุณ</p>
                  <Link to="/all-recipe" className="mt-6 inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg font-medium">
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      ค้นหาเมนูอาหาร
                    </span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {favoriteMenus.map((menu: any) => (
                    <div
                      key={menu._id}
                      className="bg-orange-50 rounded-xl p-4 border border-orange-100 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row overflow-hidden"
                    >
                      <Link to={`/recipe/${menu._id}`} className="block flex-shrink-0 sm:w-32 sm:h-32 h-48 w-full mb-4 sm:mb-0 sm:mr-4">
                        <img
                          src={menu.image}
                          alt={menu.name}
                          className="w-full h-full object-cover rounded-lg shadow-sm transition-transform duration-300 hover:scale-105"
                        />
                      </Link>
                      <div className="flex-grow flex flex-col">
                        <div className="flex-grow">
                          <Link to={`/recipe/${menu._id}`} className="block">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-orange-500 transition-colors">
                              {menu.name}
                            </h3>
                            <p className="text-sm text-gray-600 overflow-hidden mb-3"
                              style={{ display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 2 }}>
                              {menu.description}
                            </p>
                          </Link>
                        </div>
                        <div className="flex justify-between items-center w-full">
                          <div className="flex items-center">
                            <div className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 border border-gray-200 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 24 24" stroke="none">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                              <span>{typeof menu.avg === 'number' ? menu.avg.toFixed(1) : '0.0'}</span>
                            </div>
                            <div className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 border border-gray-200 flex items-center ml-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{menu.cookTime} นาที</span>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleLike(menu._id)}
                            className={`p-3 rounded-full bg-white shadow-sm border border-orange-100 ${likedRecipes.includes(menu._id)
                              ? "text-red-500"
                              : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                              } transition-colors`}
                            aria-label={
                              likedRecipes.includes(menu._id)
                                ? "นำออกจากรายการโปรด"
                                : "เพิ่มในรายการโปรด"
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill={
                                likedRecipes.includes(menu._id)
                                  ? "currentColor"
                                  : "none"
                              }
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {favoriteMenus.length > 0 && (
                <div className="flex justify-center mt-8">
                  <Link to="/all-recipe" className="bg-white border border-orange-500 text-orange-500 px-6 py-3 rounded-xl hover:bg-orange-50 transition-colors flex items-center font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    ค้นหาเมนูอาหารเพิ่มเติม
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FavoriteMenuList;
