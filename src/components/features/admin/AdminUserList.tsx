import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BsThreeDotsVertical } from 'react-icons/bs';
import axios from '../../../services/api';
import { User } from '../../../pages/Admin';

interface AdminUserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onUserDeleted: () => void;
}

const AdminUserList: React.FC<AdminUserListProps> = ({ users, onEdit, onUserDeleted }) => {
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  if (users.length === 0) {
    return <p className="text-gray-600 dark:text-gray-400">No hay usuarios.</p>;
  }

  const toggleMenu = (userId: number) => {
    setMenuOpenId((prev) => (prev === userId ? null : userId));
  };

  const handleDelete = async (user: User) => {
    const confirmDelete = window.confirm(`¿Estás seguro de eliminar a ${user.name}?`);
    if (!confirmDelete) return;

    try {
      await axios.delete(`/admin/users/${user.id}`);
      onUserDeleted();
    } catch (error) {
      console.error('Error al eliminar el usuario', error);
    }
  };

  return (
    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
      {users.map((user) => (
        <motion.li
          key={user.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="relative flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          onClick={() => onEdit(user)}
        >
          <div>
            <p className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200">
              {user.name}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
            <p className="text-xs text-gray-500 dark:text-gray-300">Rol: {user.role}</p>
          </div>

          <div
            className="relative"
            onClick={(e) => {
              // Evita abrir el modal de edición al hacer click en el menú
              e.stopPropagation();
            }}
          >
            <button
              onClick={() => toggleMenu(user.id)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <BsThreeDotsVertical className="text-xl text-gray-600 dark:text-gray-300" />
            </button>

            <AnimatePresence>
              {menuOpenId === user.id && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-2 w-36 bg-white dark:bg-gray-800
                             border border-gray-200 dark:border-gray-700 rounded shadow-md z-50"
                >
                  <button
                    onClick={() => {
                      onEdit(user);
                      setMenuOpenId(null);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpenId(null);
                      handleDelete(user);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-red-500"
                  >
                    Eliminar
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.li>
      ))}
    </ul>
  );
};

export default AdminUserList;
