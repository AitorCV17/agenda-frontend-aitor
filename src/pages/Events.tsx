import React, { useEffect, useState } from 'react'
import axios from '../services/api'
import EventForm from '../components/EventForm'
import EventList from '../components/EventList'

const Events: React.FC = () => {
  const [events, setEvents] = useState<any[]>([])

  const fetchEvents = async () => {
    try {
      const res = await axios.get('/events')
      setEvents(res.data)
    } catch (err) {
      console.error('Error al obtener eventos')
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Eventos</h2>
      <EventForm onEventCreated={fetchEvents} />
      <EventList events={events} onRefresh={fetchEvents} />
    </div>
  )
}

export default Events
