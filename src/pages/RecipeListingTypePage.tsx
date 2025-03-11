import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import axios from 'axios';
import LoginPopup from '../components/LoginPopup';
import RegisterPopup from '../components/RegisterPopup';
import Loading from '../components/Loading';
import { BiSolidCake, BiSolidDish, BiSolidDrink } from 'react-icons/bi';
import Footer from '../components/footer';

const RecipeListingPage = () => {
  const [likedRecipes, setLikedRecipes] = useState<string[]>([]);
  const [foods, setFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { type } = useParams();
  const user = useSelector((state: RootState) => state.user);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [recipesPerPage] = useState(12);
  const [totalRecipes, setTotalRecipes] = useState(0);

  let menuTitle = '🍽 เมนูอาหาร';
  let icon = <BiSolidDish className="h-10 w-10 text-orange-500" />;

  if (type === 'main-dish') {
    menuTitle = '🍽 เมนูจานหลัก';
    icon = <BiSolidDish className="h-10 w-10 text-orange-500" />;
  } else if (type === 'dessert') {
    menuTitle = '🍽 เมนูของหวาน';
    icon = <BiSolidCake className="h-10 w-10 text-orange-500" />;
  } else if (type === 'drink') {
    menuTitle = '🍽 เมนูเครื่องดื่ม';
    icon = <BiSolidDrink className="h-10 w-10 text-orange-500" />;
  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [foodsRes, likesRes] = await Promise.all([
          axios.get(`/api/food/foodtype/${type}`),
          user.id ? axios.get(`/api/like/`, {
            withCredentials: true
          }) : Promise.resolve({ data: { likedRecipes: [] } }),
        ]);

        const foods = foodsRes.data
        setTotalRecipes(foods.length);
        setFoods(foods);
        setLikedRecipes(likesRes.data.likedRecipes);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.id]);

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = foods.slice(indexOfFirstRecipe, indexOfLastRecipe);
  const totalPages = Math.ceil(totalRecipes / recipesPerPage);

  const toggleLike = async (recipeId: string) => {
    const userId = user.id;
    if (!userId) {
      setIsLoginOpen(true);
      return;
    }
    try {
      const response = await axios.post("/api/like", {
        userId,
        targetId: recipeId,
        targetType: "Food",
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

  if (loading) {
    return <Loading />;
  }

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-orange-50 min-h-screen flex flex-col">
      <Navbar />
      <div className="w-full px-4 py-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-6 rounded-2xl shadow-xl mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">{menuTitle}</h1>
              <p className="text-lg text-white/80 mt-2">
                ค้นพบสูตรอาหารอร่อย ๆ สำหรับทุกโอกาส
              </p>
            </div>
            <div className="bg-white p-3 rounded-full shadow-lg transition-transform hover:scale-110">
              {icon}
            </div>
          </div>
        </div>

        {foods.length === 0 ? (
          <div className="text-center py-12 bg-white shadow-xl rounded-2xl overflow-hidden border border-orange-100 p-6 md:p-8">
            <div className="bg-orange-100 rounded-full p-4 mb-4 inline-flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-orange-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-lg text-gray-600 mb-2">
              ไม่พบรายการอาหารที่ค้นหา
            </p>
            <p className="text-gray-500">
              ลองค้นหาด้วยคำค้นอื่นหรือดูรายการทั้งหมด
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {currentRecipes.map((recipe) => (
                <div
                  key={recipe._id}
                  className="bg-white shadow-xl rounded-2xl overflow-hidden border border-orange-100 transition-all hover:shadow-2xl hover:-translate-y-1"
                >
                  <Link to={`/recipe/${recipe._id}`} className="block">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={recipe.image}
                        alt={recipe.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link to={`/recipe/${recipe._id}`} className="block">
                      <h3 className="text-lg font-semibold mb-1 hover:text-orange-500 transition-colors">
                        {recipe.name}
                      </h3>
                    </Link>
                    <div
                      className="text-gray-600 text-sm mb-3 h-10 overflow-hidden"
                      style={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                      }}
                    >
                      {recipe.description}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 border border-gray-200 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1 text-yellow-500"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            stroke="none"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                          </svg>
                          <span>
                            {typeof recipe.avg === "number"
                              ? recipe.avg.toFixed(1)
                              : "0.0"}
                          </span>
                        </div>
                        {recipe.cookTime && (
                          <div className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 border border-gray-200 flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1 text-orange-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>{recipe.cookTime} นาที</span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => toggleLike(recipe._id)}
                        className={`p-3 rounded-full bg-white shadow-sm border border-orange-100 ${likedRecipes.includes(recipe._id)
                          ? "text-red-500"
                          : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                          } transition-colors`}
                        aria-label={
                          likedRecipes.includes(recipe._id)
                            ? "นำออกจากรายการโปรด"
                            : "เพิ่มในรายการโปรด"
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill={
                            likedRecipes.includes(recipe._id)
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

            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => paginate(pageNumber)}
                      className={`mx-1 px-4 py-2 rounded-lg transition-colors ${currentPage === pageNumber
                        ? "bg-orange-500 text-white"
                        : "bg-white text-gray-700 hover:bg-orange-100 border border-gray-300"
                        }`}
                    >
                      {pageNumber}
                    </button>
                  )
                )}
              </div>
            )}
          </>
        )}

        <div className="flex justify-center mt-8">
          <Link to="/favorites" className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg font-medium flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            ดูรายการอาหารโปรด
          </Link>
        </div>
      </div>

      <Footer />

      <LoginPopup
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />

      <RegisterPopup
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </div>
  );
};

export default RecipeListingPage;
