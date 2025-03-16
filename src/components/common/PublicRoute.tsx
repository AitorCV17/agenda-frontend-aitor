import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

const PublicRoute: React.FC = () => {
  const { token } = useContext(AuthContext)
  if (token) return <Navigate to="/" replace />
  return <Outlet />
}

export default PublicRoute;
