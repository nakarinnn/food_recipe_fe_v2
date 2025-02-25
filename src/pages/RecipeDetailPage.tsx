import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom';

const RecipeDetailPage = () => {
    const [liked, setLiked] = useState(false);
    const [comments, setComments] = useState<string[]>([]);
    const [newComment, setNewComment] = useState('');
    const [userRating, setUserRating] = useState<number>(0);  // เพิ่มสถานะสำหรับคะแนนจากผู้ใช้
    const [averageRating, setAverageRating] = useState<number>(4.5);  // ค่าคะแนนเฉลี่ยเริ่มต้น

    const { id } = useParams(); // ดึง id จาก URL

    const recipes = [
        { id: 1, name: "ต้มยำกุ้ง", description: "อาหารไทยรสจัดจ้าน หอมเครื่องสมุนไพร", rating: 4.5, image: "https://d3h1lg3ksw6i6b.cloudfront.net/media/image/2023/04/24/5608757681874e1ea5df1aa41d5b2e3d_How_To_Make_Tom_Yam_Kung_The_Epitome_Of_Delicious_And_Nutritious_Thai_Cuisine3.jpg" },
        { id: 2, name: "ผัดไทย", description: "เส้นผัดไทยคลาสสิก หอมอร่อย", rating: 4.2, image: "https://s.isanook.com/wo/0/ud/37/185369/food.jpg?ip/crop/w1200h700/q80/jpg" },
        { id: 3, name: "ส้มตำ", description: "ส้มตำแซ่บๆ รสชาติจัดจ้าน", rating: 4.7, image: "https://www.unileverfoodsolutions.co.th/th/chef-inspiration/simple-tips-for-great-flavour/somtum-green-papaya-salad-recipes/jcr:content/parsys/content-aside-footer/tipsandadvice/image.img.jpg/1695118621402.jpg" },
        { id: 4, name: "ข้าวมันไก่", description: "ไก่นุ่ม ข้าวหอม อร่อยลงตัว", rating: 4.3, image: "https://static.thairath.co.th/media/4DQpjUtzLUwmJZZSEmAUm74bI2EL8Sb34rOSLQkKjXQF.jpg" }
      ];

      const selectedRecipe = recipes.find(r => r.id === Number(id));

      if (!selectedRecipe) {
        return <div>ไม่พบข้อมูลอาหารนี้</div>;
      }


    const handleLike = () => {
        setLiked((prev) => !prev);
    };

    const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewComment(e.target.value);
    };

    const handleAddComment = () => {
        if (newComment.trim()) {
            setComments((prev) => [...prev, newComment]);
            setNewComment('');
        }
    };

    const handleRatingChange = (rating: number) => {
        setUserRating(rating);
        setAverageRating((prev) => (prev + rating) / 2);  // คำนวณคะแนนเฉลี่ยใหม่
    };

    const recipe = {
        name: 'ต้มยำกุ้ง',
        description: 'อาหารไทยรสจัดจ้าน หอมเครื่องสมุนไพร',
        ingredients: [
            'กุ้ง',
            'ตะไคร้',
            'ใบมะกรูด',
            'น้ำมะขามเปียก',
            'น้ำปลา',
            'พริกขี้หนู',
        ],
        method: [
            'ต้มกุ้งในน้ำเดือด',
            'ใส่ตะไคร้และใบมะกรูด',
            'ปรุงรสด้วยน้ำมะขามเปียกและน้ำปลา',
            'ใส่พริกขี้หนูตำ',
        ],
        image: 'https://d3h1lg3ksw6i6b.cloudfront.net/media/image/2023/04/24/5608757681874e1ea5df1aa41d5b2e3d_How_To_Make_Tom_Yam_Kung_The_Epitome_Of_Delicious_And_Nutritious_Thai_Cuisine3.jpg',
        rating: 4.5,
    };

    return (
        <>
            <Navbar />
            <div className="p-6 mx-auto max-w-4xl bg-white shadow-lg rounded-xl mt-12">
                <div className="flex flex-col items-center mb-6">
                    <img src={selectedRecipe.image} alt={selectedRecipe.name} className="w-full h-96 object-cover rounded-lg mb-4 shadow-md" />
                    <h2 className="text-3xl font-semibold text-gray-800 mb-2">{selectedRecipe.name}</h2>
                    <p className="text-gray-600 text-lg mb-4">{selectedRecipe.description}</p>
                    <div className="flex justify-between items-center w-full mb-4">
                        <span className="text-yellow-500 font-bold text-xl">⭐ {averageRating.toFixed(1)}</span>
                        <button onClick={handleLike} className={liked ? 'text-red-700' : 'text-red-500 hover:text-red-700'}>
                            <Heart size={24} fill={liked ? 'currentColor' : 'none'} />
                        </button>
                    </div>

                </div>

                <div className="mb-8">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">ส่วนประกอบของวัถุดิบ</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        {recipe.ingredients.map((ingredient, index) => (
                            <li key={index} className="text-gray-700 text-lg">{ingredient}</li>
                        ))}
                    </ul>
                </div>

                <div className="mb-8">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">วิธีทำ</h3>
                    <ol className="list-decimal pl-6 space-y-2">
                        {recipe.method.map((step, index) => (
                            <li key={index} className="text-gray-700 text-lg">{step}</li>
                        ))}
                    </ol>
                </div>

                {/* ส่วนของการให้คะแนน */}
                <div className="mt-6">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">ให้คะแนนสูตรอาหาร</h3>
                    <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                                key={rating}
                                onClick={() => handleRatingChange(rating)}
                                className={`text-2xl ${userRating >= rating ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-500 transition duration-300`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center space-x-4 mt-6">
                    <input
                        type="text"
                        value={newComment}
                        onChange={handleCommentChange}
                        placeholder="เขียนความคิดเห็น..."
                        className="border border-gray-300 p-3 w-full rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button onClick={handleAddComment} className="bg-blue-500 text-white py-3 px-6 rounded-lg text-sm hover:bg-blue-600 transition duration-300">
                        เพิ่มความคิดเห็น
                    </button>
                </div>

                <div className="mb-8 mt-6">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">ความคิดเห็น</h3>
                    <div className="space-y-4">
                        {comments.length === 0 ? (
                            <p className="text-gray-500 text-lg">ยังไม่มีความคิดเห็น</p>
                        ) : (
                            comments.map((comment, index) => (
                                <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md">
                                    <p className="text-gray-700 text-lg">{comment}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default RecipeDetailPage;
