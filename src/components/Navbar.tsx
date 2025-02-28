import { useState } from "react";
import { Search } from "lucide-react";
import LoginPopup from "./LoginPopup";
import RegisterPopup from "./RegisterPopup";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { clearUser } from '../features/user/userSlice';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const dispatch = useDispatch();

  // Get user state from Redux
  const user = useSelector((state: RootState) => state.user);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search Query:", searchQuery);
  };

  const handleLogout = () => {
    dispatch(clearUser()); // Dispatch clearUser action to Redux
  };

  return (
    <>
      <nav className="bg-white shadow-md p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="text-xl font-bold"><a href="/">MyApp</a></div>
        <div className="flex space-x-6 md:space-x-12">
          <ul className="flex space-x-6">
            <li>
              <a href="/main-course" className="text-gray-700 hover:text-blue-500">
                อาหารคาว
              </a>
            </li>
            <li>
              <a href="/dessert" className="text-gray-700 hover:text-blue-500">
                อาหารหวาน
              </a>
            </li>
            <li>
              <a href="/drink" className="text-gray-700 hover:text-blue-500">
                เครื่องดื่ม
              </a>
            </li>
          </ul>
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
          {user.isLoggedIn ? (
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <img
                    alt=""
                    src={user.avatar_url}
                    className="size-10 rounded-full"
                  />
                </MenuButton>
              </div>
              <MenuItems
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                {/* change to button */}
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`${active && 'bg-gray-100'} block w-full px-4 py-2 text-left text-sm text-gray-700 focus:outline-none`}
                    >
                      Sign out
                    </button>
                  )}
                </MenuItem>
              </MenuItems>
            </Menu>
          ) : (
            <button
              onClick={() => setIsLoginOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer"
            >
              Login
            </button>
          )}
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
