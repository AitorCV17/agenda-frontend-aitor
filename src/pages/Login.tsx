import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from '../services/api'
import { AuthContext } from '../context/AuthContext'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await axios.post('/auth/login', { email, password })
      login(res.data.token, res.data.user)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión')
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <motion.div 
        className="w-full max-w-md p-6 sm:p-8 bg-white dark:bg-gray-800 shadow-lg rounded-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-3xl font-bold text-center text-azure-700 dark:text-azure-300 mb-4 sm:mb-6">
          Iniciar Sesión
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            Ingresar
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-sm text-center mt-4">{error}</p>
        )}

        <p className="mt-4 text-center text-sm text-azure-800 dark:text-azure-400">
          ¿No tienes cuenta? 
          <Link to="/register" className="text-azure-600 dark:text-azure-300 hover:text-azure-700 dark:hover:text-azure-400 font-semibold transition">
            {' '}Regístrate
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default Login;