import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../services/api'
import EventForm, { EventData } from '../components/EventForm'

const EditEvent: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [eventData, setEventData] = useState<EventData | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // Se asume que existe GET /events/:id para obtener un evento por id
        const res = await axios.get(`/events/${id}`)
        setEventData(res.data)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al cargar el evento')
      }
    }
    fetchEvent()
  }, [id])

  const handleUpdate = () => {
    navigate('/events')
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Editar Evento</h2>
      {error && <p className="text-red-500">{error}</p>}
      {eventData ? (
        <EventForm initialData={eventData} onEventUpdated={handleUpdate} />
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  )
}

export default EditEvent
