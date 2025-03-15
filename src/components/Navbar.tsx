import { useState } from "react";
import LoginPopup from "./LoginPopup";
import RegisterPopup from "./RegisterPopup";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { clearUser } from '../features/user/userSlice';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Link, useNavigate } from "react-router-dom";
import { BiSolidCake, BiSolidDish, BiSolidDrink } from 'react-icons/bi';
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import Swal from 'sweetalert2';
import axios from 'axios';

const Navbar = () => {

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        Swal.fire({
          title: 'ไม่ได้รับอนุญาต',
          text: 'เซสชั่นของคุณหมดอายุแล้ว กรุณาเข้าสู่ระบบใหม่',
          icon: 'warning',
          confirmButtonText: 'ตกลง',
        }).then((result) => {
          if (result.isConfirmed) {
            dispatch(clearUser());
            setMobileMenuOpen(false);
          }
        });
      }
      return Promise.reject(error);
    }
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.user);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(import.meta.env.VITE_USER_SERVICE_API + '/api/user/logout', {
        withCredentials: true
      })
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      dispatch(clearUser());
      setMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <nav className="bg-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/home" className="flex items-center space-x-4 lg:space-x-4 hover:text-orange-400">
            <h1 className="text-xl md:text-2xl font-bold text-gray-50">FoodRecipe</h1>
          </a>
          <div className="hidden lg:flex space-x-6 lg:space-x-10">
            <a href="/main-dish" className="flex items-center space-x-1 lg:space-x-2 hover:text-orange-400">
              <BiSolidDish className="w-5 h-5 lg:w-6 lg:h-6 text-orange-500" />
              <span className="text-gray-50 text-base lg:text-lg">อาหารจานหลัก</span>
            </a>

            <a href="/dessert" className="flex items-center space-x-1 lg:space-x-2 hover:text-orange-400">
              <BiSolidCake className="w-5 h-5 lg:w-6 lg:h-6 text-orange-500" />
              <span className="text-gray-50 text-base lg:text-lg">ของหวาน</span>
            </a>

            <a href="/drink" className="flex items-center space-x-1 lg:space-x-2 hover:text-orange-400">
              <BiSolidDrink className="w-5 h-5 lg:w-6 lg:h-6 text-orange-500" />
              <span className="text-gray-50 text-base lg:text-lg">เครื่องดื่ม</span>
            </a>
          </div>


          <div className="flex items-center space-x-2 md:space-x-4">
            <form onSubmit={handleSearch} className="hidden lg:flex items-center space-x-2 bg-white py-1 px-2 rounded-full">
              <button type="submit">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <input
                className="outline-none w-40 xl:w-64 md:w-28"
                type="text"
                placeholder="ค้นหา"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {user.isLoggedIn ? (
              <Menu as="div" className="relative">
                <div>
                  <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt=""
                      src={user.avatar_url}
                      className="size-8 md:size-10 rounded-full"
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  <MenuItem>
                    {({ active }) => (
                      <Link
                        to="/myList"
                        className={`${active && 'bg-gray-100'} block w-full px-4 py-2 text-left text-sm text-gray-700 focus:outline-none`}
                      >
                        รายการอาหารโปรด
                      </Link>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <Link
                        to="/add-recipe"
                        className={`${active && 'bg-gray-100'} block w-full px-4 py-2 text-left text-sm text-gray-700 focus:outline-none`}
                      >
                        เพิ่มรายการอาหาร
                      </Link>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <Link
                        to="/my-recipe"
                        className={`${active && 'bg-gray-100'} block w-full px-4 py-2 text-left text-sm text-gray-700 focus:outline-none`}
                      >
                        เมนูของฉัน
                      </Link>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${active && 'bg-gray-100'} block w-full px-4 py-2 text-left text-sm text-gray-700 focus:outline-none`}
                      >
                        ออกจากระบบ
                      </button>
                    )}
                  </MenuItem>
                </MenuItems>
              </Menu>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base bg-blue-500 text-white rounded-lg cursor-pointer"
              >
                เข้าสู่ระบบ
              </button>
            )}

            <button
              className="lg:hidden text-white p-1"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? (
                <IoMdClose className="w-6 h-6" />
              ) : (
                <HiOutlineMenuAlt3 className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-gray-800 px-4 py-3 shadow-lg">
            <div className="flex flex-col space-y-4">
              <form onSubmit={handleSearch} className="flex items-center space-x-2 bg-white py-1.5 px-3 rounded-full">
                <button type="submit">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                <input
                  className="outline-none w-full"
                  type="text"
                  placeholder="ค้นหา"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>

              <a
                href="/main-dish"
                className="flex items-center space-x-3 text-gray-50 py-2 hover:bg-gray-700 rounded-md px-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <BiSolidDish className="w-5 h-5 text-orange-500" />
                <span>อาหารคาว</span>
              </a>

              <a
                href="/dessert"
                className="flex items-center space-x-3 text-gray-50 py-2 hover:bg-gray-700 rounded-md px-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <BiSolidCake className="w-5 h-5 text-orange-500" />
                <span>อาหารหวาน</span>
              </a>

              <a
                href="/drink"
                className="flex items-center space-x-3 text-gray-50 py-2 hover:bg-gray-700 rounded-md px-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <BiSolidDrink className="w-5 h-5 text-orange-500" />
                <span>เครื่องดื่ม</span>
              </a>

              {user.isLoggedIn && (
                <>
                  <Link
                    to="/myList"
                    className="flex items-center space-x-3 text-gray-50 py-2 hover:bg-gray-700 rounded-md px-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>รายการอาหารโปรด</span>
                  </Link>

                  <Link
                    to="/add-recipe"
                    className="flex items-center space-x-3 text-gray-50 py-2 hover:bg-gray-700 rounded-md px-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>เพิ่มรายการอาหาร</span>
                  </Link>

                  <Link
                    to="/my-recipe"
                    className="flex items-center space-x-3 text-gray-50 py-2 hover:bg-gray-700 rounded-md px-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>เมนูของฉัน</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 text-gray-50 py-2 hover:bg-gray-700 rounded-md px-2 w-full text-left"
                  >
                    <span>ออกจากระบบ</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

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
};

export default Navbar;