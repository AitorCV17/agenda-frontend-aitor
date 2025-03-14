import React, { useState, useEffect } from 'react'
import axios from '../services/api'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const EditProfile: React.FC = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/users/profile')
      setName(res.data.name)
      setEmail(res.data.email)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar perfil')
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.put('/users/profile/full', { name, email, currentPassword, newPassword })
      setMessage('Perfil actualizado exitosamente')
      navigate('/profile')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar perfil')
    }
  }

  return (
    <motion.div 
      className="max-w-lg mx-auto mt-10 bg-white dark:bg-azure-950 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold text-center text-azure-800 dark:text-azure-300 mb-6">
        Editar Perfil
      </h2>

      {/* Mensajes de error y éxito con animación */}
      {error && (
        <motion.div 
          className="text-red-500 bg-red-100 dark:bg-red-800 p-2 rounded mb-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.div>
      )}
      {message && (
        <motion.div 
          className="text-green-500 bg-green-100 dark:bg-green-800 p-2 rounded mb-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {message}
        </motion.div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded focus:ring-2 focus:ring-azure-500 shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Correo</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded focus:ring-2 focus:ring-azure-500 shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña actual (para cambiar contraseña)</label>
          <input
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded focus:ring-2 focus:ring-azure-500 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nueva Contraseña</label>
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded focus:ring-2 focus:ring-azure-500 shadow-sm"
          />
        </div>

        {/* Botón mejorado */}
        <motion.button
          type="submit"
          className="w-full bg-azure-600 dark:bg-azure-700 text-white p-3 rounded font-semibold hover:bg-azure-500 dark:hover:bg-azure-600 transition-all duration-300 shadow-md"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Actualizar Perfil
        </motion.button>
      </form>
    </motion.div>
  )
}

export default EditProfile
