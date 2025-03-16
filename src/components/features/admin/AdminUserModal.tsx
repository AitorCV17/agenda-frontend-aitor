import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../../../services/api';
import { User } from '../../../pages/Admin';

interface AdminUserModalProps {
  user: User | null;
  onClose: () => void;
  onUserUpdated: () => void;
}

const AdminUserModal: React.FC<AdminUserModalProps> = ({ user, onClose, onUserUpdated }) => {
  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<User['role']>(user ? user.role : 'USUARIO');
  const [error, setError] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    } else {
      setName('');
      setEmail('');
      setRole('USUARIO');
    }
    setPassword('');
    setError('');
  }, [user]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!user && !password) {
        setError('La contraseña es requerida para crear un usuario');
        return;
      }
      const payload = { name, email, role, password: password || undefined };
      if (user) {
        await axios.put(`/admin/users/${user.id}`, payload);
      } else {
        await axios.post('/admin/users', payload);
      }
      onUserUpdated();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al enviar el formulario');
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center px-2"
        onClick={handleOverlayClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          ref={modalRef}
          className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-lg shadow-xl p-6 relative"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 dark:text-gray-400 text-2xl font-bold hover:text-red-500"
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            {user ? 'Editar Usuario' : 'Crear Usuario'}
          </h2>
          {error && (
            <p className="text-red-500 bg-red-50 dark:bg-red-900 dark:text-red-400 p-2 rounded mb-4">
              {error}
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nombre
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm focus:ring-azure-500 focus:ring-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Correo
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm focus:ring-azure-500 focus:ring-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Contraseña {user ? '(Dejar en blanco para mantener la actual)' : ''}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm focus:ring-azure-500 focus:ring-2"
                placeholder={user ? '********' : ''}
                {...(!user && { required: true })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Rol
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'USUARIO' | 'ADMIN')}
                className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm focus:ring-azure-500 focus:ring-2"
                required
              >
                <option value="USUARIO">Usuario</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-azure-700 hover:bg-azure-600 text-white font-semibold py-2 rounded shadow-md transition-all duration-300 focus:ring-4 focus:ring-azure-300 dark:focus:ring-azure-800"
            >
              {user ? 'Actualizar Usuario' : 'Crear Usuario'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AdminUserModal;
