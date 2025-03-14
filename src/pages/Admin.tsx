import React, { useState, useEffect } from 'react'
import axios from '../services/api'

const Admin: React.FC = () => {
  const [users, setUsers] = useState<any[]>([])

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/admin/users')
      setUsers(res.data)
    } catch (err) {
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
    const newRole = prompt('Nuevo rol (USER o ADMIN):', user.role)
    if (newRole === null || (newRole !== 'USER' && newRole !== 'ADMIN')) return
    try {
      await axios.put(`/admin/users/${user.id}`, { name: newName, email: newEmail, role: newRole })
      fetchUsers()
    } catch (err) {
      console.error('Error al actualizar usuario')
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Administración de Usuarios</h2>
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
