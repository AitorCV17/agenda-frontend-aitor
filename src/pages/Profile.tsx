import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import { motion } from 'framer-motion';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/users/profile');
      setProfile(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al obtener el perfil');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <motion.div
      className="max-w-md mx-auto mt-10 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">
        Perfil
      </h2>

      {error && (
        <motion.p
          className="text-red-500 bg-red-100 dark:bg-red-800 p-2 rounded mb-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.p>
      )}

      {profile && (
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>
            <span className="font-semibold">ID:</span> {profile.id}
          </p>
          <p>
            <span className="font-semibold">Nombre:</span> {profile.name}
          </p>
          <p>
            <span className="font-semibold">Correo:</span> {profile.email}
          </p>
          <p>
            <span className="font-semibold">Rol:</span> {profile.role}
          </p>
          <p>
            <span className="font-semibold">Creado:</span>{' '}
            {new Date(profile.createdAt).toLocaleString()}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default Profile;
