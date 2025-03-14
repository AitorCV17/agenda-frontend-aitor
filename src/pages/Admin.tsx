import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from '../services/api';
import AdminUserList from '../components/AdminUserList';
import AdminUserModal from '../components/AdminUserModal';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'USUARIO' | 'ADMIN';
}

const Admin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error al obtener los usuarios', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleUserUpdated = () => {
    fetchUsers();
    handleCloseModal();
  };

  const handleUserDeleted = () => {
    fetchUsers();
  };

  return (
    <motion.div
      className="min-h-screen px-4 py-10 bg-gray-100 dark:bg-gray-900 transition-all duration-500 ease-in-out"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold text-azure-700 dark:text-azure-300"
          >
            Panel de Administración
          </motion.h2>
          <motion.button
            onClick={handleCreateUser}
            className="bg-azure-700 hover:bg-azure-600 focus:ring-4 focus:ring-azure-300 dark:focus:ring-azure-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            whileTap={{ scale: 0.95 }}
          >
            + Crear Usuario
          </motion.button>
        </div>

        <AdminUserList
          users={users}
          onEdit={handleEditUser}
          onUserDeleted={handleUserDeleted}
        />

        {isModalOpen && (
          <AdminUserModal
            user={selectedUser}
            onClose={handleCloseModal}
            onUserUpdated={handleUserUpdated}
          />
        )}
      </div>
    </motion.div>
  );
};

export default Admin;
