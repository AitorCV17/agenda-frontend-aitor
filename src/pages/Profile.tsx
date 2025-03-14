import React, { useContext, useState } from 'react';
import axios from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Profile: React.FC = () => {
  const { token, user, login } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.put('/users/profile', { name, email });
      setMessage(res.data.message);
      login(token!, { ...user, name, email });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar el perfil');
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.put('/users/profile/password', { currentPassword, newPassword });
      setMessage(res.data.message);
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar la contraseña');
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Perfil</h2>
      {message && <div className="text-green-600 mb-4">{message}</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <form onSubmit={handleProfileUpdate} className="mb-6">
        <div className="mb-4">
          <label className="block mb-1">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Correo</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Actualizar Perfil
        </button>
      </form>

      <h3 className="text-xl font-bold mb-2">Cambiar Contraseña</h3>
      <form onSubmit={handlePasswordUpdate}>
        <div className="mb-4">
          <label className="block mb-1">Contraseña Actual</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Nueva Contraseña</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
          Actualizar Contraseña
        </button>
      </form>
    </div>
  );
};

export default Profile;
