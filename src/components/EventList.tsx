import React from 'react'
import axios from '../services/api'
import ShareEventModal from './ShareEventModal'
import { motion } from 'framer-motion'

interface Event {
  id: number
  title: string
  description?: string
  startTime: string
  endTime: string
  color?: string
  reminderOffset?: number
  recurrence?: string
  location?: string
}

interface EventListProps {
  events: Event[]
  onRefresh: () => void
  onEdit: (event: Event) => void
}

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

const EventList: React.FC<EventListProps> = ({ events, onRefresh, onEdit }) => {
  const [shareEventId, setShareEventId] = React.useState<number | null>(null)

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/events/${id}`)
      onRefresh()
    } catch (err) {
      console.error('Error al eliminar el evento')
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl transition-all duration-500">
      <h3 className="text-2xl font-bold text-azure-700 dark:text-azure-300 mb-6">
        Listado de Eventos
      </h3>

      {events.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No hay eventos.</p>
      ) : (
        <ul className="space-y-4">
          {events.map(event => {
            const eventColor = event.color || '#5179a6'
            const hasReminder = event.reminderOffset !== undefined && event.reminderOffset !== null
            const reminderText = hasReminder ? formatReminder(event.reminderOffset!) : ''

            return (
              <motion.li
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                style={{
                  backgroundColor: `${eventColor}20`,
                  borderColor: `${eventColor}66`
                }}
                className={`
                  flex flex-col sm:flex-row sm:items-center justify-between
                  border rounded-xl p-6
                  shadow-md hover:shadow-lg
                  transition-all duration-300
                  hover:-translate-y-1 hover:scale-[1.02]
                  backdrop-blur-sm
                `}
              >
                {/* Columna izquierda: Detalles */}
                <div className="flex flex-col space-y-2 mb-4 sm:mb-0 sm:pr-4">
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {event.title}
                  </p>

                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {new Date(event.startTime).toLocaleString()} -{' '}
                    {new Date(event.endTime).toLocaleString()}
                  </p>

                  {hasReminder && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 flex items-center">
                      ⏰ {reminderText}
                    </p>
                  )}

                  {event.recurrence && event.recurrence !== 'NONE' && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 flex items-center">
                      🔁 Recurrencia: {event.recurrence}
                    </p>
                  )}
                </div>

                {/* Columna derecha: Acciones */}
                <div className="flex flex-wrap gap-2 justify-end">
                  <button
                    onClick={() => onEdit(event)}
                    className="bg-azure-700 hover:bg-azure-600 text-white px-4 py-2 rounded-lg text-sm shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-azure-300 dark:focus:ring-azure-800"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => setShareEventId(event.id)}
                    className="bg-azure-500 hover:bg-azure-400 text-white px-4 py-2 rounded-lg text-sm shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-azure-300 dark:focus:ring-azure-800"
                  >
                    Compartir
                  </button>

                  <button
                    onClick={() => handleDelete(event.id)}
                    className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-300 dark:focus:ring-red-800"
                  >
                    Eliminar
                  </button>
                </div>
              </motion.li>
            )
          })}
        </ul>
      )}

      {shareEventId && (
        <ShareEventModal
          eventId={shareEventId}
          onClose={() => setShareEventId(null)}
        />
      )}
    </div>
  )
}

export default EventList
