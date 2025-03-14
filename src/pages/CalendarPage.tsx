import React, { useState, useEffect } from 'react'
import axios from '../services/api'
import Calendar from '../components/Calendar'

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
    const endISO = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString()
    setStart(startISO)
    setEnd(endISO)
  }, [])

  useEffect(() => {
    if (start && end) fetchCalendarEvents()
  }, [start, end])

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Calendario</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <Calendar events={events} />
    </div>
  )
}

export default CalendarPage
