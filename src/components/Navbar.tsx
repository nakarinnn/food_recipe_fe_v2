import { useState } from "react";
import { Search } from "lucide-react";
import LoginPopup from "./LoginPopup";
import RegisterPopup from "./RegisterPopup";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search Query:", searchQuery);
  };

  return (
    <>
      <nav className="bg-white shadow-md p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="text-xl font-bold">MyApp</div>
        <div className="flex space-x-6 md:space-x-12">
          <a href="#" className="text-gray-700 hover:text-blue-500">อาหารคาว</a>
          <a href="#" className="text-gray-700 hover:text-blue-500">อาหารหวาน</a>
          <a href="#" className="text-gray-700 hover:text-blue-500">เครื่องดื่ม</a>
        </div>
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <form onSubmit={handleSearch} className="relative flex-grow md:w-80">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </form>
          <button
            onClick={() => setIsLoginOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer"
          >
            Login
          </button>
        </div>
      </nav>

      {/* ✅ Popup Login */}
      <LoginPopup
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onRegister={() => {
          setIsLoginOpen(false); // ปิด Login
          setIsRegisterOpen(true); // เปิด Register
        }}
      />

      {/* ✅ Popup Register */}
      <RegisterPopup
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onLogin={() => {
          setIsRegisterOpen(false); // ปิด Register
          setIsLoginOpen(true); // เปิด Login
        }}
      />
    </>
  );
};

export default Navbar;
