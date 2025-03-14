import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../services/api'
import ShareEventModal from './ShareEventModal'

interface Event {
  id: number
  title: string
  description?: string
  startTime: string
  endTime: string
  color?: string
  reminderOffset?: number
  recurrence?: string
}

interface EventListProps {
  events: Event[]
  onRefresh: () => void
}

// Función para formatear el recordatorio según el valor en minutos
const formatReminder = (offset: number): string => {
  if (offset < 60) {
    return `${offset} min antes`
  } else if (offset < 1440) {
    const hours = (offset / 60).toFixed(0)
    return `${hours} hrs antes`
  } else {
    const days = (offset / 1440).toFixed(0)
    return `${days} días antes`
  }
}

const EventList: React.FC<EventListProps> = ({ events, onRefresh }) => {
  const navigate = useNavigate()
  const [shareEventId, setShareEventId] = useState<number | null>(null)

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/events/${id}`)
      onRefresh()
    } catch (err) {
      console.error('Error al eliminar el evento')
    }
  }

  const handleEdit = (id: number) => {
    navigate(`/events/edit/${id}`)
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-xl font-bold mb-4">Listado de Eventos</h3>
      {events.length === 0 ? (
        <p>No hay eventos.</p>
      ) : (
        <ul>
          {events.map(event => (
            <li key={event.id} className="border-b border-gray-200 py-2 flex justify-between items-center">
              <div>
                <p className="font-bold" style={{ color: event.color || '#000' }}>{event.title}</p>
                <p className="text-sm text-gray-600">
                  {new Date(event.startTime).toLocaleString()} - {new Date(event.endTime).toLocaleString()}
                </p>
                {event.reminderOffset !== undefined && event.reminderOffset !== null && (
                  <p className="text-xs text-gray-500">Recordatorio: {formatReminder(event.reminderOffset)}</p>
                )}
                {event.recurrence && event.recurrence !== 'NONE' && (
                  <p className="text-xs text-gray-500">Recurrencia: {event.recurrence}</p>
                )}
              </div>
              <div>
                <button onClick={() => handleEdit(event.id)} className="mr-2 bg-green-500 text-white px-2 py-1 rounded">
                  Editar
                </button>
                <button onClick={() => setShareEventId(event.id)} className="mr-2 bg-blue-500 text-white px-2 py-1 rounded">
                  Compartir
                </button>
                <button onClick={() => handleDelete(event.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {shareEventId && <ShareEventModal eventId={shareEventId} onClose={() => setShareEventId(null)} />}
    </div>
  )
}

export default EventList
