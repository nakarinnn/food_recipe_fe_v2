import { useState } from "react";
import Navbar from "../components/Navbar";
import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Swal from "sweetalert2";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import Footer from "../components/footer";
import LoginPopup from "../components/LoginPopup";
import RegisterPopup from "../components/RegisterPopup";

export default function RecipeForm() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    cookTime: "",
    image: "",
    owner: "",
    ingredients: [{ name: "", amount: "", unit: "" }],
    instructions: [{ step: 1, description: "" }],
    ratings: [],
    comments: [],
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const categories = ["อาหารคาว", "อาหารหวาน", "เครื่องดื่ม"];

  const user = useSelector((state: RootState) => state.user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileUrl = URL.createObjectURL(e.target.files[0]);
      setImagePreview(fileUrl);
      setImage(e.target.files[0]);
    }
  };

  const handleIngredientChange = (index: number, field: string, value: string) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients[index] = { ...updatedIngredients[index], [field]: value };
    setFormData((prev) => ({ ...prev, ingredients: updatedIngredients }));
  };

  const handleInstructionChange = (index: number, value: string) => {
    const updatedInstructions = [...formData.instructions];
    updatedInstructions[index].description = value;
    setFormData((prev) => ({ ...prev, instructions: updatedInstructions }));
  };

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: "", amount: "", unit: "" }],
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const addInstruction = () => {
    setFormData((prev) => ({
      ...prev,
      instructions: [...prev.instructions, { step: prev.instructions.length + 1, description: "" }],
    }));
  };

  const removeInstruction = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index),
    }));
  };

  const handleUpload = async () => {
    const userId = user.id;
    if (!userId) {
      setIsLoginOpen(true);
      return;
    }
    
    if (!image) {
      Swal.fire("กรุณาเลือกไฟล์รูปภาพก่อน", "", "warning");
      return;
    }

    const date = new Date();
    const uniqueFileName = `${date.getTime()}_${image.name}`;

    const storageRef = ref(storage, `${formData.category}/${uniqueFileName}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    Swal.fire({
      title: "กำลังอัปโหลด...",
      html: "โปรดรอขณะกำลังอัปโหลดไฟล์",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    uploadTask.on(
      "state_changed",
      () => { },
      (error) => {
        console.error("Upload failed:", error);
        Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถอัปโหลดไฟล์ได้", "error");
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);

        Swal.fire({
          title: "อัปโหลดสำเร็จ!",
          text: "ไฟล์อัปโหลดเสร็จสมบูรณ์",
          icon: "success",
          confirmButtonText: "ตกลง"
        });

        try {
          const newFormData = {
            ...formData,
            image: url,
            owner: user.id ? String(user.id) : "",
          };

          await axios.post("/api/food/add-recipe", { formData: newFormData }, { withCredentials: true });

          setFormData({
            name: "",
            category: "",
            description: "",
            cookTime: "",
            image: "",
            owner: "",
            ingredients: [{ name: "", amount: "", unit: "" }],
            instructions: [{ step: 1, description: "" }],
            ratings: [],
            comments: [],
          });

          setImagePreview(null)
          setImage(null)

        } catch (err) {
          Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถเพิ่มสูตรอาหารได้", "error");
        }
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.description) {
      Swal.fire("กรุณากรอกข้อมูลให้ครบทุกช่อง", "", "warning");
      return;
    }

    if (formData.ingredients.some(ingredient => !ingredient.name || !ingredient.amount || !ingredient.unit)) {
      Swal.fire("กรุณากรอกข้อมูลส่วนผสมให้ครบถ้วน", "", "warning");
      return;
    }

    if (formData.instructions.some(instruction => !instruction.description)) {
      Swal.fire("กรุณากรอกข้อมูลวิธีทำให้ครบถ้วน", "", "warning");
      return;
    }

    await handleUpload();
  };

  return (
    <>
      <Navbar />
      <div className="bg-orange-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden max-w-4xl mx-auto border border-orange-100">
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-6 relative">
              <h1 className="text-2xl md:text-3xl font-bold text-white">เพิ่มสูตรอาหาร</h1>
              <p className="text-orange-300 mt-2 max-w-2xl pr-14">แบ่งปันสูตรอาหารสุดพิเศษให้กับทุกคน</p>
              <div className="absolute right-6 top-6 bg-orange-500 p-2 rounded-full shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      placeholder="ชื่อเมนู"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-4 pl-12 border-2 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all text-lg font-medium"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H11M13.5 3L19 8.625M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19M19 8.625V11.8125" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 18L14 20L12 18M12 18V14M14 16H12" />
                      </svg>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full p-4 pl-12 border-2 rounded-xl appearance-none border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all bg-white"
                      >
                        <option value="" disabled>เลือกประเภทอาหาร</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>

                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        step="1"
                        name="cookTime"
                        placeholder="เวลาที่ใช้ปรุง (เช่น 30 นาที)"
                        value={formData.cookTime || ""}
                        onChange={handleChange}
                        className="w-full p-4 pl-12 border-2 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all"
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <textarea
                      name="description"
                      placeholder="คำอธิบายเมนูอาหาร: บอกเล่าเรื่องราวและความพิเศษของเมนูนี้"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full p-4 pl-12 border-2 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all min-h-32"
                    />
                    <div className="absolute left-4 top-8 text-orange-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    รูปภาพอาหาร
                  </h2>
                  <div className="border-2 border-dashed border-orange-300 rounded-xl p-8 text-center hover:border-orange-500 transition-colors bg-white">
                    <input
                      type="file"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                      accept="image/*"
                    />
                    {!imagePreview ? (
                      <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                        <div className="bg-orange-100 rounded-full p-4 mb-4 inline-flex">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <span className="text-lg font-medium text-gray-700">เลือกรูปภาพอาหาร</span>
                        <span className="text-sm text-gray-500 mt-1">คลิกที่นี่หรือลากไฟล์มาวาง</span>
                      </label>
                    ) : (
                      <div className="relative">
                        <img src={imagePreview} alt="Preview" className="rounded-lg w-full object-cover max-h-96" />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setImage(null);
                            const imageUploadInput = document.getElementById('image-upload') as HTMLInputElement | null;
                            if (imageUploadInput)
                              imageUploadInput.value = '';
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <label
                          htmlFor="image-upload"
                          className="absolute bottom-2 right-2 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    ส่วนผสม
                  </h2>
                  <div className="space-y-3 pr-2 custom-scrollbar">
                    {formData.ingredients.map((ingredient, index) => (
                      <div key={index} className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm transition-all hover:shadow-md flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 sm:items-center">
                        <div className="flex-grow sm:w-1/3">
                          <div className="text-xs text-gray-500 mb-1">ชื่อวัตถุดิบ</div>
                          <input
                            type="text"
                            placeholder="เช่น แป้งสาลี, เนื้อหมู"
                            value={ingredient.name}
                            onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                            className="w-full p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all"
                          />
                        </div>
                        <div className="sm:w-1/4">
                          <div className="text-xs text-gray-500 mb-1">ปริมาณ</div>
                          <input
                            type="number"
                            min="1"
                            step="1"
                            placeholder="เช่น 1, 2, 3"
                            value={ingredient.amount}
                            onChange={(e) => handleIngredientChange(index, "amount", e.target.value)}
                            className="w-full p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all"
                          />
                        </div>
                        <div className="sm:w-1/4">
                          <div className="text-xs text-gray-500 mb-1">หน่วย</div>
                          <input
                            type="text"
                            placeholder="เช่น กรัม, ช้อนโต๊ะ"
                            value={ingredient.unit}
                            onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
                            className="w-full p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all"
                          />
                        </div>
                        <div className="sm:flex-shrink-0 sm:pt-5">
                          <button
                            type="button"
                            onClick={() => removeIngredient(index)}
                            className="w-full sm:w-auto bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addIngredient}
                    className="mt-4 bg-white border border-orange-500 text-orange-500 px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors flex items-center font-medium"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    เพิ่มส่วนผสม
                  </button>
                </div>

                <div className="bg-orange-50 rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    วิธีทำ
                  </h2>
                  <div className="space-y-4 pr-2 custom-scrollbar">
                    {formData.instructions.map((instruction, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-orange-100 shadow-sm hover:shadow-md transition-all flex items-start space-x-3">
                        <div className="flex items-center justify-center bg-orange-500 text-white rounded-full w-8 h-8 flex-shrink-0 font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-grow">
                          <input
                            type="text"
                            placeholder="อธิบายขั้นตอนการทำอาหาร..."
                            value={instruction.description}
                            onChange={(e) => handleInstructionChange(index, e.target.value)}
                            className="w-full p-2 border-b border-gray-200 focus:border-orange-400 focus:outline-none transition-all bg-transparent"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeInstruction(index)}
                          className="bg-red-100 text-red-500 p-2 rounded-full hover:bg-red-600 hover:text-white transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addInstruction}
                    className="mt-4 bg-white border border-orange-500 text-orange-500 px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors flex items-center font-medium"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    เพิ่มขั้นตอน
                  </button>
                </div>

                <div className="flex justify-center py-4">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl font-medium text-lg flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    บันทึกสูตรอาหาร
                  </button>
                </div>
              </form>
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
    </>
  );
}
