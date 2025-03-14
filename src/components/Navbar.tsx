import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { HiOutlineMenu, HiOutlineMenuAlt1 } from 'react-icons/hi';

const Navbar: React.FC<{ isSidebarOpen: boolean; toggleSidebar: () => void }> = ({
  isSidebarOpen,
  toggleSidebar,
}) => {
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  return (
    <nav className="bg-azure-900 dark:bg-azure-950 text-white px-6 py-3 shadow-md flex items-center justify-between transition-all duration-300">
      <button
        onClick={toggleSidebar}
        className="text-white text-2xl hover:text-azure-400 transition"
      >
        {isSidebarOpen ? <HiOutlineMenuAlt1 /> : <HiOutlineMenu />}
      </button>

      {token && (
        <div className="relative z-50" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 bg-azure-700 dark:bg-azure-800 text-white font-bold rounded-full flex items-center justify-center hover:bg-azure-600 transition"
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </button>

          {menuOpen && (
            <motion.div
              className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <p className="px-4 py-2 text-gray-700 dark:text-white font-semibold">
                {user.name}
              </p>
              <p className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                {user.role}
              </p>
              <hr className="border-gray-200 dark:border-gray-600" />
              <button
                onClick={() => navigate('/edit-profile')}
                className="w-full text-left px-4 py-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Editar Perfil
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Cerrar Sesión
              </button>
            </motion.div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
