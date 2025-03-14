import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../services/api'

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

const EventList: React.FC<EventListProps> = ({ events, onRefresh }) => {
  const navigate = useNavigate()

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/events/${id}`)
      onRefresh()
    } catch (err) {
      console.error('Error al eliminar el evento')
    }
  }

  const handleShare = async (id: number) => {
    const userEmails = prompt('Ingrese los correos separados por coma:')
    if (!userEmails) return
    const emailsArray = userEmails.split(',').map(email => email.trim())
    try {
      await axios.post(`/events/${id}/share`, { userEmails: emailsArray })
      alert('Evento compartido')
    } catch (err) {
      console.error('Error al compartir el evento')
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
                {event.reminderOffset !== undefined && (
                  <p className="text-xs text-gray-500">Recordatorio: {event.reminderOffset} min antes</p>
                )}
                {event.recurrence && event.recurrence !== 'NONE' && (
                  <p className="text-xs text-gray-500">Recurrencia: {event.recurrence}</p>
                )}
              </div>
              <div>
                <button onClick={() => handleEdit(event.id)} className="mr-2 bg-green-500 text-white px-2 py-1 rounded">
                  Editar
                </button>
                <button onClick={() => handleShare(event.id)} className="mr-2 bg-blue-500 text-white px-2 py-1 rounded">
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
    </div>
  )
}

export default EventList
