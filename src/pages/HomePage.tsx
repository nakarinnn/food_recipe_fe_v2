import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import foodRecipe_BG from '../assets/foodRecipe_BG.jpg'
import Footer from '../components/footer';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LoginPopup from '../components/LoginPopup';
import RegisterPopup from '../components/RegisterPopup';

interface Service {
  icon: string;
  title: string;
  description: string;
  link: string;
}

interface Recipe {
  _id: string;
  name: string;
  description: string;
  image: string;
  avg: number;
  cookTime?: string;
}

const services: Service[] = [
  { icon: "🍛", title: "อาหารจานหลัก", description: "เพลิดเพลินกับเมนูอาหารจานหลักที่หลากหลาย อร่อยและลงตัวทุกมื้อ", link: "/main-dish" },
  { icon: "🍰", title: "ของหวาน", description: "เติมความหวานให้วันของคุณด้วยขนมและของหวานสุดอร่อย", link: "/dessert" },
  { icon: "🍹", title: "เครื่องดื่ม", description: "ดื่มด่ำกับเครื่องดื่มสดชื่น ทั้งร้อนและเย็นให้คุณเลือกตามใจ", link: "/drink" },
];

const ServiceCard: React.FC<Service> = ({ icon, title, description, link }) => (
  <a href={link} className="flex flex-col items-center text-center px-6 py-4 md:w-1/3 cursor-pointer">
    <div className="bg-orange-400 rounded-full w-16 h-16 flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-110">
      <span className="text-white text-3xl">{icon}</span>
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 text-sm max-w-xs">{description}</p>
  </a>
);

const HomePage = () => {
  const [filteredFoods, setFilteredFoods] = useState<Recipe[]>([]);
  const [likedRecipes, setLikedRecipes] = useState<string[]>([]);
  const user = useSelector((state: RootState) => state.user);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [foodsRes, likesRes] = await Promise.all([
          axios.get(import.meta.env.VITE_FOOD_SERVICE_API + "/api/food/food-random"),
          user.id ? axios.get(import.meta.env.VITE_LIKE_SERVICE_API + `/api/like`, {
            withCredentials: true
          }) : Promise.resolve({ data: { likedRecipes: [] } }),
        ]);

        const sortedFoods = foodsRes.data.sort(() => 0.5 - Math.random());
        setFilteredFoods(sortedFoods);
        setLikedRecipes(likesRes.data.likedRecipes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user.id]);

  const toggleLike = async (recipeId: string) => {
    const userId = user.id
    if (!userId) {
      setIsLoginOpen(true);
      return;
    }
    try {
      const response = await axios.post(import.meta.env.VITE_LIKE_SERVICE_API + "/api/like", {
        targetId: recipeId,
        targetType: "Food"
      }, {
        withCredentials: true
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
    <div className="font-sans">
      <Navbar />

      <section className="relative min-h-screen flex items-center justify-center bg-gray-800 px-4 text-center">
        <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: `url(${foodRecipe_BG})` }}></div>
        <div className="relative z-10 text-white">
          <p className="text-lg italic">ยินดีต้อนรับสู่ FoodRecipe!</p>
          <h1 className="text-4xl font-bold mb-6">มาพบกับสูตรอาหารแสนอร่อยกันเถอะ!</h1>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-3 px-8 rounded-lg transition-transform duration-300 hover:scale-105">
            <a href="/all-recipe">
              รายการอาหาร
            </a>
          </button>
        </div>
      </section>

      <section id="services" className="py-16 px-4 bg-orange-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold uppercase mb-2">เมนูแนะนำ </h2>
          <p className="text-gray-500 italic">อาหารอร่อยสำหรับทุกโอกาส</p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </section>

      <section id="recipe-list" className="bg-gray-100 py-16 px-4">
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold uppercase">สูตรอาหารแนะนำ</h2>
            <p className="text-gray-500 italic">เลือกสูตรอาหารที่คุณชื่นชอบ</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
            {filteredFoods.map((recipe) => (
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
        </div>
      </section>

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

export default HomePage;
