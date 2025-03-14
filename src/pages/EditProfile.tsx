// src/pages/EditProfile.tsx
import React, { useState, useEffect } from 'react'
import axios from '../services/api'
import { useNavigate } from 'react-router-dom'

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
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Editar Perfil</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {message && <p className="text-green-500 mb-2">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Correo</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Contraseña actual (para cambiar contraseña)</label>
          <input
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Nueva Contraseña</label>
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Actualizar Perfil</button>
      </form>
    </div>
  )
}

export default EditProfile
