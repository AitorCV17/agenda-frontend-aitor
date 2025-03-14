// src/pages/Admin.tsx
import React, { useState, useEffect } from 'react'
import axios from '../services/api'

const Admin: React.FC = () => {
  const [users, setUsers] = useState<any[]>([])
  const [error, setError] = useState('')
  const [createForm, setCreateForm] = useState({ name: '', email: '', password: '', role: 'USUARIO' })

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/admin/users')
      setUsers(res.data)
    } catch (err: any) {
      console.error('Error al obtener usuarios')
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/admin/users/${id}`)
      fetchUsers()
    } catch (err) {
      console.error('Error al eliminar usuario')
    }
  }

  const handleEdit = async (user: any) => {
    const newName = prompt('Nuevo nombre:', user.name)
    if (newName === null) return
    const newEmail = prompt('Nuevo correo:', user.email)
    if (newEmail === null) return
    const newRole = prompt('Nuevo rol (USUARIO o ADMIN):', user.role)
    if (newRole === null || (newRole !== 'USUARIO' && newRole !== 'ADMIN')) return
    try {
      await axios.put(`/admin/users/${user.id}`, { name: newName, email: newEmail, role: newRole })
      fetchUsers()
    } catch (err) {
      console.error('Error al actualizar usuario')
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post('/admin/users', createForm)
      setCreateForm({ name: '', email: '', password: '', role: 'USUARIO' })
      fetchUsers()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear usuario')
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Administración de Usuarios</h2>
      
      <div className="mb-6 p-4 bg-white rounded shadow">
        <h3 className="text-xl font-bold mb-4">Crear Usuario</h3>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleCreateUser}>
          <div className="mb-4">
            <label className="block mb-1">Nombre</label>
            <input 
              type="text" 
              value={createForm.name}
              onChange={e => setCreateForm({...createForm, name: e.target.value})}
              className="w-full border border-gray-300 p-2 rounded"
              required 
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Correo</label>
            <input 
              type="email" 
              value={createForm.email}
              onChange={e => setCreateForm({...createForm, email: e.target.value})}
              className="w-full border border-gray-300 p-2 rounded"
              required 
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Contraseña</label>
            <input 
              type="password" 
              value={createForm.password}
              onChange={e => setCreateForm({...createForm, password: e.target.value})}
              className="w-full border border-gray-300 p-2 rounded"
              required 
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Rol</label>
            <select 
              value={createForm.role}
              onChange={e => setCreateForm({...createForm, role: e.target.value})}
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="USUARIO">USUARIO</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Crear Usuario</button>
        </form>
      </div>

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">Nombre</th>
            <th className="py-2 px-4 border">Correo</th>
            <th className="py-2 px-4 border">Rol</th>
            <th className="py-2 px-4 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="py-2 px-4 border">{user.id}</td>
              <td className="py-2 px-4 border">{user.name}</td>
              <td className="py-2 px-4 border">{user.email}</td>
              <td className="py-2 px-4 border">{user.role}</td>
              <td className="py-2 px-4 border">
                <button onClick={() => handleEdit(user)} className="mr-2 bg-green-500 text-white px-2 py-1 rounded">
                  Editar
                </button>
                <button onClick={() => handleDelete(user.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Admin
