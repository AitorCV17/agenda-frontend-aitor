import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const EditProfile: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/users/profile');
      setName(res.data.name);
      setEmail(res.data.email);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar el perfil');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const payload: any = { name, email };
    if (currentPassword.trim() !== "") {
      payload.currentPassword = currentPassword;
    }
    if (newPassword.trim() !== "") {
      payload.newPassword = newPassword;
    }

    try {
      await axios.put('/users/profile/full', payload);
      setMessage('Perfil actualizado con éxito');
      navigate('/profile');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar el perfil');
    }
  };

  return (
    <motion.div
      className="max-w-md mx-auto mt-10 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-700 dark:text-gray-200">
        Editar Perfil
      </h2>

      {error && (
        <motion.div
          className="text-red-600 bg-red-100 dark:bg-red-800 dark:text-red-300 p-2 rounded mb-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.div>
      )}
      {message && (
        <motion.div
          className="text-green-600 bg-green-100 dark:bg-green-800 dark:text-green-200 p-2 rounded mb-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {message}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nombre
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded"
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
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Contraseña Actual (solo si cambias la contraseña)
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded"
            placeholder="Ingresa tu contraseña actual"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nueva Contraseña (opcional)
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded"
            placeholder="Dejar en blanco para no cambiarla"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-azure-600 hover:bg-azure-500 text-white font-semibold py-2 rounded transition-all"
        >
          Actualizar Perfil
        </button>
      </form>
    </motion.div>
  );
};

export default EditProfile;
