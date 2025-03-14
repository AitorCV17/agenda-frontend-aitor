// src/components/Navbar.tsx
import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Navbar: React.FC = () => {
  const { token, user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <Link to="/" className="font-bold">Agenda Personal</Link>
        <div>
          {token ? (
            <>
              <Link to="/events" className="mr-4">Eventos</Link>
              <Link to="/notes" className="mr-4">Notas</Link>
              <Link to="/calendar" className="mr-4">Calendario</Link>
              <Link to="/tasks" className="mr-4">Tareas</Link>
              <Link to="/profile" className="mr-4">Perfil</Link>
              <Link to="/edit-profile" className="mr-4">Editar Perfil</Link>
              {user && user.role === 'ADMIN' && (
                <Link to="/admin" className="mr-4">Admin</Link>
              )}
              <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">Salir</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mr-4">Iniciar Sesión</Link>
              <Link to="/register" className="mr-4">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
