import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import axios from 'axios';
import Loading from '../components/Loading';
import Swal from 'sweetalert2';
import Footer from '../components/footer';

const MyRecipePage = () => {
    const user = useSelector((state: RootState) => state.user);
    const [foods, setFoods] = useState<any>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        if (!user.id) {
            setLoading(false)
            return;
        }

        const getFoods = async () => {
            try {
                const response = await axios.get(`/api/food/getFoodByUserId`, {
                    withCredentials: true,
                });
                setFoods(response.data);
            } catch (error) {
                console.error("Error fetching random foods:", error);
            } finally {
                setLoading(false);
            }
        };

        getFoods();
    }, [user.id]);

    const handleDelete = async (recipeId: string) => {
        Swal.fire({
            title: "คุณแน่ใจหรือไม่?",
            text: "เมื่อกดลบแล้วจะไม่สามารถกู้คืนได้!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "ลบ",
            cancelButtonText: "ยกเลิก",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`/api/food/${recipeId}`, {
                        withCredentials: true
                    });
                    setFoods((prev: any[]) => prev.filter((recipe) => recipe._id !== recipeId));
                    Swal.fire("ลบสำเร็จ!", "เมนูของคุณถูกลบแล้ว", "success");
                } catch (error) {
                    console.error("Error deleting comment:", error);
                    Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถลบเมนูนี้ได้ กรุณาลองอีกครั้ง", "error");
                }
            }
        });
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="bg-orange-50 min-h-screen flex flex-col">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden max-w-4xl mx-auto border border-orange-100">
                    <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-6 relative">
                        <h1 className="text-2xl md:text-3xl font-bold text-white">เมนูของฉัน</h1>
                        <p className="text-orange-300 mt-2 max-w-2xl">รายการอาหารที่คุณเพิ่มเข้าสู่ระบบ</p>
                        <Link to="/add-recipe" className="absolute right-6 top-6 bg-orange-500 p-2 rounded-full shadow-lg hover:bg-orange-600 transition-colors">
                            <Plus className="h-8 w-8 text-white" />
                        </Link>
                    </div>
                    <div className="p-6 md:p-8">
                        {foods.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="bg-orange-100 rounded-full p-4 mb-4 inline-flex">
                                    <AlertCircle className="h-12 w-12 text-orange-500" />
                                </div>
                                <p className="text-lg text-gray-600 mb-2">คุณยังไม่มีเมนูที่เพิ่มเข้าระบบ</p>
                                <p className="text-gray-500 mb-6">เริ่มแบ่งปันสูตรอาหารของคุณให้ผู้อื่นได้เลย</p>
                                <Link to="/add-recipe" className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg font-medium">
                                    <span className="flex items-center">
                                        <Plus className="h-5 w-5 mr-2" />
                                        เพิ่มเมนูใหม่
                                    </span>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4 pr-2 custom-scrollbar">
                                {foods.map((recipe: any) => (
                                    <div
                                        key={recipe._id}
                                        className="bg-orange-50 rounded-xl p-4 border border-orange-100 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row overflow-hidden"
                                    >
                                        <Link to={`/recipe/${recipe._id}`} className="block flex-shrink-0 sm:w-32 sm:h-32 h-48 w-full mb-4 sm:mb-0 sm:mr-4">
                                            <img
                                                src={recipe.image}
                                                alt={recipe.name}
                                                className="w-full h-full object-cover rounded-lg shadow-sm transition-transform duration-300 hover:scale-105"
                                            />
                                        </Link>
                                        <div className="flex-grow flex flex-col">
                                            <div className="flex-grow">
                                                <Link to={`/recipe/${recipe._id}`} className="block">
                                                    <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-orange-500 transition-colors">
                                                        {recipe.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 overflow-hidden mb-3"
                                                        style={{ display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 2 }}>
                                                        {recipe.description}
                                                    </p>
                                                </Link>
                                            </div>
                                            <div className="flex justify-between items-center w-full">
                                                <div className="flex items-center">
                                                    <div className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 border border-gray-200 flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 24 24" stroke="none">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                        </svg>
                                                        <span>{typeof recipe.avg === 'number' ? recipe.avg.toFixed(1) : '0.0'}</span>
                                                    </div>
                                                    {recipe.cookTime && (
                                                        <div className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 border border-gray-200 flex items-center ml-2">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <span>{recipe.cookTime} นาที</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex">
                                                    <button
                                                        onClick={() => handleDelete(recipe._id)}
                                                        className="p-3 rounded-full bg-red-50 shadow-sm border border-red-100 text-red-500 hover:bg-red-100 transition-colors"
                                                        aria-label="ลบสูตรอาหาร"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {foods.length > 0 && (
                            <div className="flex justify-center mt-8">
                                <Link to="/add-recipe" className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg font-medium mr-4">
                                    <span className="flex items-center">
                                        <Plus className="h-5 w-5 mr-2" />
                                        เพิ่มเมนูใหม่
                                    </span>
                                </Link>
                                <Link to="/all-recipe" className="bg-white border border-orange-500 text-orange-500 px-6 py-3 rounded-xl hover:bg-orange-50 transition-colors flex items-center font-medium">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                                    </svg>
                                    ดูเมนูทั้งหมด
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default MyRecipePage;
