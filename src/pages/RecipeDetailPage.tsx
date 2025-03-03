import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

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
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [instructions, setInstructions] = useState<Instruction[]>([]);

    const [likedRecipes, setLikedRecipes] = useState<string[]>([]);

    const [editCommentId, setEditCommentId] = useState(null);
    const [editText, setEditText] = useState("");

    const handleEdit = (comment: any) => {
        setEditCommentId(comment._id);
        setEditText(comment.text);
    };

    const handleSave = async (commentId: string) => {
        if (editText.trim() !== "") {
            try {
                await axios.put(import.meta.env.VITE_BASE_URL+`/api/comment/${commentId}`, { text: editText });
                setComments((prev) =>
                    prev.map((comment) => (comment._id === commentId ? { ...comment, text: editText } : comment))
                );
            } catch (error) {
                console.error("Error updating comment:", error);
            }
        }
        setEditCommentId(null);
    };

    const handleDelete = async (commentId: string) => {
        if (window.confirm("คุณต้องการลบความคิดเห็นนี้ใช่หรือไม่?")) {
            try {
                await axios.delete(import.meta.env.VITE_BASE_URL+`/api/comment/${commentId}`);
                setComments((prev) => prev.filter((comment) => comment._id !== commentId));
            } catch (error) {
                console.error("Error deleting comment:", error);
            }
        }
    };
    const getComments = async () => {
        try {
            const response = await axios.get(import.meta.env.VITE_BASE_URL+`/api/comment/${id}`);
            setComments(response.data);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    useEffect(() => {
        const getFoods = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_BASE_URL+`/api/food/${id}`);
                setFoods(response.data);
                setIngredients(response.data.ingredients)
                setInstructions(response.data.instructions)
            } catch (error) {
                console.error("Error fetching random foods:", error);
            }
        };

        const getUserLikes = async () => {
            if (!user.id) return;
            try {
                const response = await axios.get(import.meta.env.VITE_BASE_URL+`/api/like/${user.id}/`);

                setLikedRecipes(response.data.likedRecipes);
            } catch (error) {
                console.error("Error fetching user likes:", error);
            }
        };

        const getUserRating = async () => {
            if (!user.id) return;
            try {
                const response = await axios.post(import.meta.env.VITE_BASE_URL+`/api/rating/get-rating`, {
                    foodId: id,
                    userId: user.id
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
                const response = await axios.post(import.meta.env.VITE_BASE_URL+`/api/rating/average-rating`, {
                    foodId: id,
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

    const handleAddComment = async () => {
        setNewComment("");
        const userId = user.id;
        try {
            await axios.post(import.meta.env.VITE_BASE_URL+"/api/comment", {
                userId,
                foodId: id,
                text: newComment
            });

            getComments();

        } catch (error) {
            console.error("Error to add comment:", error);
        }
    };

    const handleRatingChange = async (rating: number) => {
        try {
            const response = await axios.post(import.meta.env.VITE_BASE_URL+"/api/rating", {
                foodId: foods._id,
                userId: user.id,
                rating,
            });

            setUserRating(response.data.newRating.rating)
            getComments();

        } catch (error) {
            console.error("An error occurred while rating:", error);
        }

    };

    return (
        <>
            <Navbar />
            <div className="p-6 mx-auto max-w-4xl bg-white shadow-lg rounded-xl mt-12">
                <div className="flex flex-col items-center mb-6">
                    <img src={foods.image} alt={foods.name} className="w-full h-96 object-cover rounded-lg mb-4 shadow-md" />
                    <h2 className="text-3xl font-semibold text-gray-800 mb-2">{foods.name}</h2>
                    <p className="text-gray-600 text-lg mb-4">{foods.description}</p>
                    <div className="flex justify-between items-center w-full mb-4">
                        <span className="text-yellow-500 font-bold text-xl">⭐ {averageRating.toFixed(1)}</span>
                        <button onClick={() => toggleLike(foods._id)} className={likedRecipes.includes(foods._id) ? "text-red-700" : "text-red-500 hover:text-red-700"}>
                            <Heart size={20} fill={likedRecipes.includes(foods._id) ? "currentColor" : "none"} />
                        </button>
                    </div>

                </div>

                <div className="mb-8">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">ส่วนประกอบของวัถุดิบ</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        {ingredients.map((ingredient: any, index: number) => (
                            <li key={index} className="text-gray-700 text-lg">{ingredient.name} {ingredient.amount} {ingredient.unit}</li>
                        ))}
                    </ul>
                </div>

                <div className="mb-8">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">วิธีทำ</h3>
                    <ol className="list-decimal pl-6 space-y-2">
                        {instructions.map((step: any, index: number) => (
                            <li key={index} className="text-gray-700 text-lg">{step.description}</li>
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
                            comments.map((comment) => (
                                <div key={comment._id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                                    <div className="flex items-start gap-4">
                                        {/* Avatar */}
                                        <img
                                            src={comment.userId.avatar_url}
                                            alt={comment.userId.name}
                                            className="w-10 h-10 rounded-full border border-gray-300"
                                        />
                                        {/* Content */}
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between w-full">
                                                {/* Left: Name & Email */}
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium text-gray-800">{comment.userId.name}</p>
                                                    <span className="text-sm text-gray-500">{comment.userId.email}</span>
                                                </div>
                                                {/* Right: Created Time */}
                                                <span className="text-sm text-gray-400">
                                                    {new Date(comment.createdAt).toLocaleString()}
                                                </span>
                                            </div>

                                            {/* Edit Mode */}
                                            {user.id === comment.userId._id ? (
                                                editCommentId === comment._id ? (
                                                    <div className="mt-2">
                                                        <textarea
                                                            className="w-full p-2 border rounded-lg"
                                                            value={editText}
                                                            onChange={(e) => setEditText(e.target.value)}
                                                        />
                                                        <div className="flex justify-end gap-2 mt-2">
                                                            <button
                                                                onClick={() => handleSave(comment._id)}
                                                                className="px-3 py-1 bg-blue-500 text-white rounded-lg"
                                                            >
                                                                บันทึก
                                                            </button>
                                                            <button
                                                                onClick={() => setEditCommentId(null)}
                                                                className="px-3 py-1 bg-gray-300 rounded-lg"
                                                            >
                                                                ยกเลิก
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <p className="text-gray-700 mt-1 text-base">{comment.text}</p>
                                                        <div className="flex justify-end gap-2 mt-2">
                                                            <button
                                                                onClick={() => handleEdit(comment)}
                                                                className="text-blue-500 text-sm"
                                                            >
                                                                แก้ไข
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(comment._id)}
                                                                className="text-red-500 text-sm"
                                                            >
                                                                ลบ
                                                            </button>
                                                        </div>
                                                    </>
                                                )
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
        </>
    );
};

export default RecipeDetailPage;
