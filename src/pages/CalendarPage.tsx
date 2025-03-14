import React, { useState, useEffect } from 'react'
import axios from '../services/api'
import Calendar from '../components/Calendar'
import { motion } from 'framer-motion'

const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<any[]>([])
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [error, setError] = useState('')

  const fetchCalendarEvents = async () => {
    if (!start || !end) return
    try {
      const res = await axios.get(`/events/calendar?start=${start}&end=${end}`)
      setEvents(res.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al obtener eventos del calendario')
    }
  }

  useEffect(() => {
    const now = new Date()
    const startISO = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
    const endISO = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7).toISOString()
    setStart(startISO)
    setEnd(endISO)
  }, [])

  useEffect(() => {
    if (start && end) fetchCalendarEvents()
  }, [start, end])

  return (
    <motion.div
      className="w-full max-w-6xl mx-auto p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
        <h2 className="text-3xl font-extrabold text-azure-700 dark:text-azure-300">
          Calendario de Eventos
        </h2>
      </div>

      {error && (
        <div className="text-red-500 bg-red-50 dark:bg-red-900 dark:text-red-400 px-4 py-2 rounded mb-6">
          {error}
        </div>
      )}

      <Calendar events={events} />
    </motion.div>
  )
}

export default CalendarPage
