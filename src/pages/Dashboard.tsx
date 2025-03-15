import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import axios from '../services/api'
import { HiOutlineCalendar, HiOutlineDocumentText, HiOutlineClipboardList, HiOutlineCheckCircle } from 'react-icons/hi'

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
    <motion.div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
      <div className="w-full max-w-6xl p-10 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl">
        <h2 className="text-4xl font-extrabold text-center text-azure-700 dark:text-azure-300 mb-8">Dashboard 📊</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {data ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div className="p-6 bg-gradient-to-r from-azure-400 to-azure-600 dark:from-azure-700 dark:to-azure-900 text-white rounded-xl shadow-lg hover:shadow-2xl transform transition duration-300 hover:scale-105 flex flex-col items-center" whileHover={{ scale: 1.05 }}>
              <HiOutlineCalendar className="text-6xl mb-2 opacity-90" />
              <p className="text-5xl font-bold">{data.events}</p>
              <p className="text-lg font-medium">Eventos</p>
            </motion.div>
            <motion.div className="p-6 bg-gradient-to-r from-green-400 to-green-600 dark:from-green-700 dark:to-green-900 text-white rounded-xl shadow-lg hover:shadow-2xl transform transition duration-300 hover:scale-105 flex flex-col items-center" whileHover={{ scale: 1.05 }}>
              <HiOutlineDocumentText className="text-6xl mb-2 opacity-90" />
              <p className="text-5xl font-bold">{data.notes}</p>
              <p className="text-lg font-medium">Notas</p>
            </motion.div>
            <motion.div className="p-6 bg-gradient-to-r from-purple-400 to-purple-600 dark:from-purple-700 dark:to-purple-900 text-white rounded-xl shadow-lg hover:shadow-2xl transform transition duration-300 hover:scale-105 flex flex-col items-center" whileHover={{ scale: 1.05 }}>
              <HiOutlineClipboardList className="text-6xl mb-2 opacity-90" />
              <p className="text-5xl font-bold">{data.taskLists}</p>
              <p className="text-lg font-medium">Listas de Tareas</p>
            </motion.div>
            <motion.div className="p-6 bg-gradient-to-r from-yellow-400 to-yellow-600 dark:from-yellow-700 dark:to-yellow-900 text-white rounded-xl shadow-lg hover:shadow-2xl transform transition duration-300 hover:scale-105 flex flex-col items-center" whileHover={{ scale: 1.05 }}>
              <HiOutlineCheckCircle className="text-6xl mb-2 opacity-90" />
              <p className="text-5xl font-bold">{data.tasks}</p>
              <p className="text-lg font-medium">Tareas</p>
            </motion.div>
          </div>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400">Cargando datos...</p>
        )}
      </div>
    </motion.div>
  )
}

export default Dashboard;
