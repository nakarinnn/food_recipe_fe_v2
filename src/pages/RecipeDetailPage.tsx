import React, { useEffect, useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import Swal from 'sweetalert2';
import Loading from '../components/Loading';
import Footer from '../components/footer';
import LoginPopup from '../components/LoginPopup';
import RegisterPopup from '../components/RegisterPopup';
import NotFoundPage from './NotFoundPage';

interface Ingredient {
    _id: string;
    name: string;
    amount: string;
    unit: string;
}

interface Instruction {
    _id: string;
    step: number;
    description: string;
}

const RecipeDetailPage = () => {
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');
    const [userRating, setUserRating] = useState<number>(0);
    const [averageRating, setAverageRating] = useState<number>(0);
    const user = useSelector((state: RootState) => state.user);
    const { id } = useParams();
    const [foods, setFoods] = useState<any>([]);
    const [owner, setOwner] = useState<any>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [instructions, setInstructions] = useState<Instruction[]>([]);
    const [likedRecipes, setLikedRecipes] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    const [notFound, setNotFound] = useState(false);

    const handleEdit = async (commentId: string, currentText: string) => {
        Swal.fire({
            title: "แก้ไขคอมเมนต์",
            input: "text",
            inputValue: currentText,
            showCancelButton: true,
            confirmButtonText: "บันทึก",
            cancelButtonText: "ยกเลิก",
            inputValidator: (value) => {
                if (!value.trim()) {
                    return "คอมเมนต์ห้ามว่างเปล่า!";
                }
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.put(import.meta.env.VITE_COMMENT_SERVICE_API + `/api/comment/${commentId}`, { text: result.value }, {
                        withCredentials: true
                    });
                    setComments((prev) =>
                        prev.map((comment) => (comment._id === commentId ? { ...comment, text: result.value } : comment))
                    );
                    Swal.fire("บันทึกสำเร็จ!", "คอมเมนต์ของคุณถูกแก้ไขแล้ว", "success");
                } catch (error) {
                    console.error("Error updating comment:", error);
                    Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถแก้ไขคอมเมนต์ได้ กรุณาลองอีกครั้ง", "error");
                }
            }
        });
    };


    const handleDelete = async (commentId: string) => {
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
                    await axios.delete(import.meta.env.VITE_COMMENT_SERVICE_API + `/api/comment/${commentId}`, {
                        withCredentials: true
                    });
                    setComments((prev) => prev.filter((comment) => comment._id !== commentId));
                    Swal.fire("ลบสำเร็จ!", "คอมเมนต์ของคุณถูกลบแล้ว", "success");
                } catch (error) {
                    console.error("Error deleting comment:", error);
                    Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถลบคอมเมนต์ได้ กรุณาลองอีกครั้ง", "error");
                }
            }
        });
    };

    const getComments = async () => {
        try {
            const response = await axios.get(import.meta.env.VITE_COMMENT_SERVICE_API + `/api/comment/${id}`, {
                withCredentials: true
            });
            setComments(response.data);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    useEffect(() => {
        const getFoods = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_FOOD_SERVICE_API + `/api/food/${id}`, {
                    withCredentials: true
                });
                if (!response.data || response.data.length === 0 || !response.data[0]) {
                    setNotFound(true);
                } else {
                    setFoods(response.data[0]);
                    setIngredients(response.data[0].ingredients || []);
                    setInstructions(response.data[0].instructions || []);
                    setOwner(response.data[0].ownerDetails || null);
                }
            } catch (error: any) {
                console.error("Error fetching random foods:", error)
                if (error.response == 'undefined' || error.response.status == 500) {
                    setNotFound(true);
                }
            } finally {
                setLoading(false);
            }
        };

        const getUserLikes = async () => {
            if (!user.id) return;
            try {
                const response = await axios.get(import.meta.env.VITE_LIKE_SERVICE_API + `/api/like/`,
                    {
                        withCredentials: true
                    }
                );
                setLikedRecipes(response.data.likedRecipes);
            } catch (error) {
                console.error("Error fetching user likes:", error);
            }
        };

        const getUserRating = async () => {
            if (!user.id) return;
            try {
                const response = await axios.post(import.meta.env.VITE_RATING_SERVICE_API + `/api/rating/get-rating`, {
                    foodId: id,
                }, {
                    withCredentials: true
                });

                if (response.data)
                    setUserRating(response.data.rating)
                else
                    setUserRating(0)

            } catch (error) {
                console.error("Error fetching user rating:", error);
            }
        };

        getFoods();
        getUserLikes();
        getUserRating();
        getComments();
    }, [user.id]);

    useEffect(() => {
        const getAverageRating = async () => {
            try {
                const response = await axios.post(import.meta.env.VITE_RATING_SERVICE_API + `/api/rating/average-rating`, {
                    foodId: id,
                }, {
                    withCredentials: true
                });
                setAverageRating(response.data)
            } catch (error) {
                console.error("Error fetching user rating:", error);
            }
        };

        getAverageRating()
    }, [userRating]);


    const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewComment(e.target.value);
    };

    const toggleLike = async (recipeId: string) => {
        const userId = user.id;
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

    const handleAddComment = async () => {
        const userId = user.id;
        if (!userId) {
            setIsLoginOpen(true);
            return;
        }
        try {
            await axios.post(import.meta.env.VITE_COMMENT_SERVICE_API + "/api/comment", {
                foodId: id,
                text: newComment
            }, {
                withCredentials: true
            });

            getComments();
            setNewComment("");

        } catch (error) {
            console.error("Error to add comment:", error);
        }
    };

    const handleRatingChange = async (rating: number) => {
        const userId = user.id;
        if (!userId) {
            setIsLoginOpen(true);
            return;
        }
        try {
            const response = await axios.post(import.meta.env.VITE_RATING_SERVICE_API + "/api/rating", {
                foodId: foods._id,
                rating,
            }, {
                withCredentials: true
            });

            console.log(response.data)
            setUserRating(response.data.newRating.rating)
            getComments();

        } catch (error) {
            console.error("An error occurred while rating:", error);
        }

    };

    if (loading) {
        return <Loading />;
    }

    if (notFound) {
        return <NotFoundPage />;
    }

    return (
        <div className="bg-orange-50 min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-grow container mx-auto px-4 py-8">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden max-w-4xl mx-auto border border-orange-100">
                    <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-6 relative">
                        <h1 className="text-2xl md:text-3xl font-bold text-white pr-14">{foods.name}</h1>
                        <p className="text-orange-300 mt-2 max-w-2xl">{foods.category || "อาหารไทย"}</p>

                        <div className={`absolute right-6 top-6 bg-${likedRecipes.includes(foods._id) ? "white" : "orange-500"} p-2 rounded-full shadow-lg flex items-center justify-center ${likedRecipes.includes(foods._id)
                            ? "text-red-500"
                            : "text-white hover:text-red-500 hover:bg-red-50"} transition-colors`} aria-label={
                                likedRecipes.includes(foods._id)
                                    ? "นำออกจากรายการโปรด"
                                    : "เพิ่มในรายการโปรด"
                            }
                            onClick={() => toggleLike(foods._id)}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8"
                                fill={
                                    likedRecipes.includes(foods._id)
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
                        </div>
                    </div>


                    <div className="p-6 md:p-8">
                        <div className="rounded-xl overflow-hidden shadow-md mb-6 border border-orange-100">
                            <img
                                src={foods.image}
                                alt={foods.name}
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                        </div>

                        <div className="bg-orange-50 rounded-xl p-6 mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-800 border border-gray-200 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 24 24" stroke="none">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                        </svg>
                                        <span className="font-medium">{averageRating.toFixed(1)}</span>
                                    </div>
                                    {foods.cookTime && (
                                        <div className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-800 border border-gray-200 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>{foods.cookTime} นาที</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <img
                                    src={owner.avatar_url}
                                    alt={owner.name}
                                    className="w-12 h-12 rounded-full border border-orange-200 shadow-sm"
                                />
                                <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                                        <p className="font-medium text-gray-800">{owner.name}</p>
                                    </div>
                                    <span className="text-sm text-gray-400 mt-2 sm:mt-0 whitespace-nowrap">
                                        {new Date(foods.createdAt).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <p className="text-gray-700 text-lg mt-4">{foods.description}</p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-6 mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                ส่วนประกอบของวัถุดิบ
                            </h2>
                            <div className="space-y-3 pr-2 custom-scrollbar">
                                {ingredients.map((ingredient, index) => (
                                    <div key={index} className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm transition-all hover:shadow-md flex items-center">
                                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                            <span className="text-orange-600 font-medium">{index + 1}</span>
                                        </div>
                                        <div className="flex-grow">
                                            <span className="text-gray-800 font-medium">{ingredient.name}</span>
                                            {(ingredient.amount || ingredient.unit) && (
                                                <span className="text-gray-600 ml-2">
                                                    {ingredient.amount} {ingredient.unit}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-orange-50 rounded-xl p-6 mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                                วิธีทำ
                            </h2>
                            <div className="space-y-4 pr-2 custom-scrollbar">
                                {instructions.map((step, index) => (
                                    <div key={index} className="bg-white rounded-lg p-4 border border-orange-100 shadow-sm hover:shadow-md transition-all flex items-start space-x-3">
                                        <div className="flex items-center justify-center bg-orange-500 text-white rounded-full w-8 h-8 flex-shrink-0 font-bold">
                                            {index + 1}
                                        </div>
                                        <div className="flex-grow">
                                            <p className="text-gray-700">{step.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-6 mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                                ให้คะแนนสูตรอาหาร
                            </h2>
                            <div className="flex space-x-2">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                    <button
                                        key={rating}
                                        onClick={() => handleRatingChange(rating)}
                                        className={`text-3xl ${userRating >= rating ? 'text-yellow-500' : 'text-gray-300'} hover:text-yellow-500 transition duration-300`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-orange-50 rounded-xl p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                ความคิดเห็น
                            </h2>

                            <div className="bg-white rounded-xl p-4 border border-orange-100 mb-6">
                                <div className="flex flex-col sm:flex-row space-x-0 sm:space-x-4">
                                    <input
                                        type="text"
                                        value={newComment}
                                        onChange={handleCommentChange}
                                        placeholder="เขียนความคิดเห็น..."
                                        className="flex-grow border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 mb-4 sm:mb-0"
                                    />
                                    <button
                                        onClick={handleAddComment}
                                        className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg flex-shrink-0 font-medium"
                                    >
                                        เพิ่มความคิดเห็น
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                {comments.length === 0 ? (
                                    <div className="text-center py-8">
                                        <div className="bg-white rounded-full p-4 mb-4 inline-flex">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-500 text-lg">ยังไม่มีความคิดเห็น</p>
                                        <p className="text-gray-400">เป็นคนแรกที่แสดงความคิดเห็นสำหรับสูตรอาหารนี้</p>
                                    </div>
                                ) : (
                                    comments.map((comment) => (
                                        <div key={comment._id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                                            <div className="flex items-start gap-4">
                                                <img
                                                    src={comment.userDetails.avatar_url}
                                                    alt={comment.userDetails.name}
                                                    className="w-12 h-12 rounded-full border border-orange-200 shadow-sm"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                                                        <p className="font-medium text-gray-800">{comment.userDetails.name}</p>
                                                        {/* <span className="text-sm text-gray-500 break-words whitespace-normal max-w-[120px]">
                                                            {comment.userId.email}
                                                        </span> */}
                                                    </div>
                                                    <span className="text-sm text-gray-400 mt-2 sm:mt-0 whitespace-nowrap">
                                                        {new Date(comment.createdAt).toLocaleString()}
                                                    </span>
                                                    {user.id === comment.userDetails._id ? (
                                                        <>
                                                            <p className="text-gray-700 mt-1 text-base">{comment.text}</p>
                                                            <div className="flex justify-end gap-2 mt-2">
                                                                <div className="flex">
                                                                    <button
                                                                        onClick={() => handleEdit(comment._id, comment.text)}
                                                                        className="p-3 rounded-full bg-blue-50 shadow-sm border border-blue-100 text-blue-500 hover:bg-blue-100 transition-colors mr-2"
                                                                        aria-label="edit-comment"
                                                                    >
                                                                        <Edit className="h-5 w-5" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDelete(comment._id)}
                                                                        className="p-3 rounded-full bg-red-50 shadow-sm border border-red-100 text-red-500 hover:bg-red-100 transition-colors"
                                                                        aria-label="delete-comment"
                                                                    >
                                                                        <Trash2 className="h-5 w-5" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p className="text-gray-700 mt-1 text-base">{comment.text}</p>
                                                        </>)
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                    ))
                                )}
                            </div>
                        </div>

                    </div>
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

export default RecipeDetailPage;
