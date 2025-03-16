import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
    <ul className="space-y-4">
      {users.map((user) => (
        <motion.li
          key={user.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="relative flex items-center justify-between border rounded-xl p-4 shadow-md hover:shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] backdrop-blur-sm"
        >
          <div onClick={() => onEdit(user)}>
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{user.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
            <p className="text-xs text-gray-500 dark:text-gray-300">Rol: {user.role}</p>
          </div>
          <div
            className="relative"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <button
              onClick={() => toggleMenu(user.id)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <BsThreeDotsVertical className="text-2xl text-gray-600 dark:text-gray-300" />
            </button>
            {menuOpenId === user.id && (
              <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-50">
                <button
                  onClick={() => {
                    onEdit(user);
                    setMenuOpenId(null);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => {
                    setMenuOpenId(null);
                    handleDelete(user);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition text-red-500"
                >
                  Eliminar
                </button>
              </div>
            )}
          </div>
        </motion.li>
      ))}
    </ul>
  );
};

export default AdminUserList;
