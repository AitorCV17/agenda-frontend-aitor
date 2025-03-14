import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from '../services/api'

const Register: React.FC = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post('/auth/register', { name, email, password })
      navigate('/login')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse')
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <motion.div 
        className="w-full max-w-md p-8 bg-white dark:bg-gray-800 shadow-lg rounded-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-3xl font-bold text-center text-azure-700 dark:text-azure-300 mb-6">
          Registrarse
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-azure-900 dark:text-azure-200 font-semibold mb-1">
              Nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-azure-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-azure-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-azure-900 dark:text-azure-200 font-semibold mb-1">
              Correo
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-azure-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-azure-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-azure-900 dark:text-azure-200 font-semibold mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-azure-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-azure-500 transition"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-azure-600 hover:bg-azure-700 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-md"
          >
            Registrarse
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-sm text-center mt-4">{error}</p>
        )}

        <p className="mt-4 text-center text-sm text-azure-800 dark:text-azure-400">
          ¿Ya tienes cuenta? 
          <Link to="/login" className="text-azure-600 dark:text-azure-300 hover:text-azure-700 dark:hover:text-azure-400 font-semibold transition">
            {' '}Inicia Sesión
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default Register;