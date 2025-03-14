import React, { useEffect, useState } from 'react'
import axios from '../services/api'

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null)
  const [error, setError] = useState('')

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/users/profile')
      setProfile(res.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al obtener el perfil')
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Perfil</h2>
      {error && <p className="text-red-500">{error}</p>}
      {profile && (
        <div>
          <p><strong>ID:</strong> {profile.id}</p>
          <p><strong>Nombre:</strong> {profile.name}</p>
          <p><strong>Correo:</strong> {profile.email}</p>
          <p><strong>Rol:</strong> {profile.role}</p>
          <p><strong>Creado:</strong> {new Date(profile.createdAt).toLocaleString()}</p>
        </div>
      )}
    </div>
  )
}

export default Profile
