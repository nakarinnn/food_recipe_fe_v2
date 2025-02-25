import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Heart } from "lucide-react";
import { Link, useNavigate, useParams } from 'react-router-dom';

const RecipeListingPage = () => {

  const [likedRecipes, setLikedRecipes] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // จำนวนรายการที่จะแสดงต่อหน้า
  const navigate = useNavigate();
  const { pageNumber } = useParams<{ pageNumber: string }>();

  const recipes = [
    { id: 1, name: "ต้มยำกุ้ง", description: "อาหารไทยรสจัดจ้าน หอมเครื่องสมุนไพร", rating: 4.5, image: "https://d3h1lg3ksw6i6b.cloudfront.net/media/image/2023/04/24/5608757681874e1ea5df1aa41d5b2e3d_How_To_Make_Tom_Yam_Kung_The_Epitome_Of_Delicious_And_Nutritious_Thai_Cuisine3.jpg" },
    { id: 2, name: "ผัดไทย", description: "เส้นผัดไทยคลาสสิก หอมอร่อย", rating: 4.2, image: "https://s.isanook.com/wo/0/ud/37/185369/food.jpg?ip/crop/w1200h700/q80/jpg" },
    { id: 3, name: "ส้มตำ", description: "ส้มตำแซ่บๆ รสชาติจัดจ้าน", rating: 4.7, image: "https://www.unileverfoodsolutions.co.th/th/chef-inspiration/simple-tips-for-great-flavour/somtum-green-papaya-salad-recipes/jcr:content/parsys/content-aside-footer/tipsandadvice/image.img.jpg/1695118621402.jpg" },
    { id: 4, name: "ข้าวมันไก่", description: "ไก่นุ่ม ข้าวหอม อร่อยลงตัว", rating: 4.3, image: "https://static.thairath.co.th/media/4DQpjUtzLUwmJZZSEmAUm74bI2EL8Sb34rOSLQkKjXQF.jpg" },
    { id: 5, name: "ต้มยำกุ้ง", description: "อาหารไทยรสจัดจ้าน หอมเครื่องสมุนไพร", rating: 4.5, image: "https://d3h1lg3ksw6i6b.cloudfront.net/media/image/2023/04/24/5608757681874e1ea5df1aa41d5b2e3d_How_To_Make_Tom_Yam_Kung_The_Epitome_Of_Delicious_And_Nutritious_Thai_Cuisine3.jpg" },
    { id: 6, name: "ผัดไทย", description: "เส้นผัดไทยคลาสสิก หอมอร่อย", rating: 4.2, image: "https://s.isanook.com/wo/0/ud/37/185369/food.jpg?ip/crop/w1200h700/q80/jpg" },
    { id: 7, name: "ส้มตำ", description: "ส้มตำแซ่บๆ รสชาติจัดจ้าน", rating: 4.7, image: "https://www.unileverfoodsolutions.co.th/th/chef-inspiration/simple-tips-for-great-flavour/somtum-green-papaya-salad-recipes/jcr:content/parsys/content-aside-footer/tipsandadvice/image.img.jpg/1695118621402.jpg" },
    { id: 8, name: "ข้าวมันไก่", description: "ไก่นุ่ม ข้าวหอม อร่อยลงตัว", rating: 4.3, image: "https://static.thairath.co.th/media/4DQpjUtzLUwmJZZSEmAUm74bI2EL8Sb34rOSLQkKjXQF.jpg" },
    { id: 9, name: "ต้มยำกุ้ง", description: "อาหารไทยรสจัดจ้าน หอมเครื่องสมุนไพร", rating: 4.5, image: "https://d3h1lg3ksw6i6b.cloudfront.net/media/image/2023/04/24/5608757681874e1ea5df1aa41d5b2e3d_How_To_Make_Tom_Yam_Kung_The_Epitome_Of_Delicious_And_Nutritious_Thai_Cuisine3.jpg" },
    { id: 10, name: "ผัดไทย", description: "เส้นผัดไทยคลาสสิก หอมอร่อย", rating: 4.2, image: "https://s.isanook.com/wo/0/ud/37/185369/food.jpg?ip/crop/w1200h700/q80/jpg" },
    { id: 11, name: "ส้มตำ", description: "ส้มตำแซ่บๆ รสชาติจัดจ้าน", rating: 4.7, image: "https://www.unileverfoodsolutions.co.th/th/chef-inspiration/simple-tips-for-great-flavour/somtum-green-papaya-salad-recipes/jcr:content/parsys/content-aside-footer/tipsandadvice/image.img.jpg/1695118621402.jpg" },
    { id: 12, name: "ข้าวมันไก่", description: "ไก่นุ่ม ข้าวหอม อร่อยลงตัว", rating: 4.3, image: "https://static.thairath.co.th/media/4DQpjUtzLUwmJZZSEmAUm74bI2EL8Sb34rOSLQkKjXQF.jpg" },
    { id: 13, name: "ต้มยำกุ้ง", description: "อาหารไทยรสจัดจ้าน หอมเครื่องสมุนไพร", rating: 4.5, image: "https://d3h1lg3ksw6i6b.cloudfront.net/media/image/2023/04/24/5608757681874e1ea5df1aa41d5b2e3d_How_To_Make_Tom_Yam_Kung_The_Epitome_Of_Delicious_And_Nutritious_Thai_Cuisine3.jpg" },
    { id: 14, name: "ผัดไทย", description: "เส้นผัดไทยคลาสสิก หอมอร่อย", rating: 4.2, image: "https://s.isanook.com/wo/0/ud/37/185369/food.jpg?ip/crop/w1200h700/q80/jpg" },
    { id: 15, name: "ส้มตำ", description: "ส้มตำแซ่บๆ รสชาติจัดจ้าน", rating: 4.7, image: "https://www.unileverfoodsolutions.co.th/th/chef-inspiration/simple-tips-for-great-flavour/somtum-green-papaya-salad-recipes/jcr:content/parsys/content-aside-footer/tipsandadvice/image.img.jpg/1695118621402.jpg" },
    { id: 16, name: "ข้าวมันไก่", description: "ไก่นุ่ม ข้าวหอม อร่อยลงตัว", rating: 4.3, image: "https://static.thairath.co.th/media/4DQpjUtzLUwmJZZSEmAUm74bI2EL8Sb34rOSLQkKjXQF.jpg" },
    { id: 17, name: "ต้มยำกุ้ง", description: "อาหารไทยรสจัดจ้าน หอมเครื่องสมุนไพร", rating: 4.5, image: "https://d3h1lg3ksw6i6b.cloudfront.net/media/image/2023/04/24/5608757681874e1ea5df1aa41d5b2e3d_How_To_Make_Tom_Yam_Kung_The_Epitome_Of_Delicious_And_Nutritious_Thai_Cuisine3.jpg" },
    { id: 18, name: "ผัดไทย", description: "เส้นผัดไทยคลาสสิก หอมอร่อย", rating: 4.2, image: "https://s.isanook.com/wo/0/ud/37/185369/food.jpg?ip/crop/w1200h700/q80/jpg" },
    { id: 19, name: "ส้มตำ", description: "ส้มตำแซ่บๆ รสชาติจัดจ้าน", rating: 4.7, image: "https://www.unileverfoodsolutions.co.th/th/chef-inspiration/simple-tips-for-great-flavour/somtum-green-papaya-salad-recipes/jcr:content/parsys/content-aside-footer/tipsandadvice/image.img.jpg/1695118621402.jpg" },
    { id: 20, name: "ข้าวมันไก่", description: "ไก่นุ่ม ข้าวหอม อร่อยลงตัว", rating: 4.3, image: "https://static.thairath.co.th/media/4DQpjUtzLUwmJZZSEmAUm74bI2EL8Sb34rOSLQkKjXQF.jpg" },
  ];

  const startIndex = (currentPage - 1) * pageSize;
  const currentRecipes = recipes.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(recipes.length / pageSize);

  useEffect(() => {
    if (pageNumber) {
      setCurrentPage(Number(pageNumber));
    }
  }, [pageNumber]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    navigate(`/page?=${page}`);
  };

  return (
    <>
      <Navbar />
      <div className="p-6 mx-auto max-w-6xl">
        <h2 className="text-2xl font-bold mb-4">รายการอาหาร</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentRecipes.map((recipe) => (
            <div key={recipe.id} className="border p-4 rounded-lg shadow-md bg-white">
              <Link to={`/recipe/${recipe.id}`}>
                <img src={recipe.image} alt={recipe.name} className="w-full h-40 object-cover rounded-lg mb-2" />
              </Link>
              <Link to={`/recipe/${recipe.id}`}>
                <h3 className="text-lg font-semibold mb-1">{recipe.name}</h3>
              </Link>
              <p className="text-gray-600 text-sm mb-2">{recipe.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-yellow-500">{recipe.rating} ★</span>
                <button
                  onClick={() => {
                    setLikedRecipes((prev) => prev.includes(recipe.id) ? prev.filter(id => id !== recipe.id) : [...prev, recipe.id]);
                  }}
                  className={`text-red-500 ${likedRecipes.includes(recipe.id) ? 'text-red-600' : ''}`}
                >
                  <Heart size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 mx-2 bg-gray-300 rounded-lg"
          >
            Previous
          </button>
          <span className="px-4 py-2">{currentPage}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 mx-2 bg-gray-300 rounded-lg"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default RecipeListingPage;
