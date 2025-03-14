// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react'
import axios from '../services/api'

const Dashboard: React.FC = () => {
  const [data, setData] = useState<{ notes: number, events: number, taskLists: number, tasks: number } | null>(null)
  const [error, setError] = useState('')

  const fetchDashboard = async () => {
    try {
      const res = await axios.get('/dashboard')
      setData(res.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al obtener datos del dashboard')
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      {error && <p className="text-red-500">{error}</p>}
      {data ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-100 rounded">
            <p className="text-xl font-bold">{data.events}</p>
            <p>Eventos</p>
          </div>
          <div className="p-4 bg-green-100 rounded">
            <p className="text-xl font-bold">{data.notes}</p>
            <p>Notas</p>
          </div>
          <div className="p-4 bg-yellow-100 rounded">
            <p className="text-xl font-bold">{data.taskLists}</p>
            <p>Listas de Tareas</p>
          </div>
          <div className="p-4 bg-red-100 rounded">
            <p className="text-xl font-bold">{data.tasks}</p>
            <p>Tareas</p>
          </div>
        </div>
      ) : (
        <p>Cargando datos...</p>
      )}
    </div>
  )
}

export default Dashboard
