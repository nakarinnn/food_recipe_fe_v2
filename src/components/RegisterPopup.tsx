import React, { useState } from "react";
import axios from "axios";

interface RegisterPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: () => void; // ฟังก์ชันเปลี่ยนไปหน้า Login
}

const RegisterPopup: React.FC<RegisterPopupProps> = ({ isOpen, onClose, onLogin }) => {
    if (!isOpen) return null;

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Password และ Confirm Password ต้องตรงกัน");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/api/register", {
                name,
                email,
                password,
            });
            console.log(response.data);

            setName("")
            setEmail("")
            setPassword("")
            setConfirmPassword("")
            setError("")

            onLogin();
            onClose();
        } catch (err: any) {
            console.error(err);
            setError("เกิดข้อผิดพลาดในการลงทะเบียน โปรดลองใหม่");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-md">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    ✖
                </button>
                <h2 className="text-xl font-semibold text-center mb-4">Register</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>} {/* Error Message */}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                        Register
                    </button>
                </form>

                {/* ✅ เพิ่มปุ่ม "มีบัญชีแล้ว? Login" */}
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        มีบัญชีแล้ว?
                        <button
                            onClick={onLogin}
                            className="text-blue-600 hover:underline ml-1"
                        >
                            เข้าสู่ระบบ
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPopup;
