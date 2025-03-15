import React, { useState, useContext } from 'react'
import axios from '../services/api'
import ShareEventModal from './ShareEventModal'
import { motion } from 'framer-motion'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { AuthContext } from '../context/AuthContext'
import EventDetailModal from './EventDetailModal' // <-- Nuevo modal para ver detalles

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
  userId: number
  user?: { email: string }
  shares?: Array<{ 
    permission: string, 
    sharedBy: { email: string, id: number } 
  }>
}

interface EventListProps {
  events: Event[]
  onRefresh: () => void
  onEdit: (event: Event) => void
}

const formatReminder = (offset: number): string => {
  if (offset < 60) return `${offset} min antes`
  else if (offset < 1440) return `${(offset / 60).toFixed(0)} hrs antes`
  else return `${(offset / 1440).toFixed(0)} días antes`
}

const EventList: React.FC<EventListProps> = ({ events, onRefresh, onEdit }) => {
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null)
  const [shareEventId, setShareEventId] = useState<number | null>(null)
  const [detailEvent, setDetailEvent] = useState<Event | null>(null) // estado para el modal de detalle
  const { user } = useContext(AuthContext)
  const currentUserId = user?.id

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/events/${id}`)
      onRefresh()
    } catch (err) {
      console.error('Error al eliminar el evento')
    }
  }

  const toggleMenu = (id: number) => {
    setMenuOpenId(prev => (prev === id ? null : id))
  }

  // Abre el modal de detalle del evento
  const handleOpenDetail = (event: Event) => {
    setDetailEvent(event)
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
            const isOwned = event.userId === currentUserId
            const sharedPermission = !isOwned && event.shares && event.shares.length > 0 ? event.shares[0].permission : null
            const canEdit = isOwned || sharedPermission === 'EDIT'

            return (
              <motion.li
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                style={{ backgroundColor: `${eventColor}20`, borderColor: `${eventColor}66` }}
                className="relative flex flex-col sm:flex-row sm:items-center justify-between border rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] backdrop-blur-sm cursor-pointer"
                onClick={() => handleOpenDetail(event)}
              >
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{event.title}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {new Date(event.startTime).toLocaleString()} - {new Date(event.endTime).toLocaleString()}
                  </p>
                  {hasReminder && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 flex items-center">
                      ⏰ {reminderText}
                    </p>
                  )}
                  {!isOwned && event.shares && event.shares.length > 0 && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Compartido por: {event.shares[0].sharedBy.email}
                    </p>
                  )}
                </div>
                {/* Mostrar el botón de menú solo si el usuario tiene permisos de edición */}
                {canEdit && (
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => toggleMenu(event.id)} className="p-2">
                      <BsThreeDotsVertical className="text-2xl text-gray-600 dark:text-gray-300" />
                    </button>
                    {menuOpenId === event.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-10">
                        <button onClick={() => { onEdit(event); setMenuOpenId(null) }} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                          Editar
                        </button>
                        {isOwned && (
                          <>
                            <button onClick={() => { setShareEventId(event.id); setMenuOpenId(null) }} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                              Compartir
                            </button>
                            <button onClick={() => { handleDelete(event.id); setMenuOpenId(null) }} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                              Eliminar
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </motion.li>
            )
          })}
        </ul>
      )}
      {shareEventId && <ShareEventModal eventId={shareEventId} onClose={() => setShareEventId(null)} />}
      {detailEvent && (
        <EventDetailModal
          event={detailEvent}
          onClose={() => setDetailEvent(null)}
        />
      )}
    </div>
  )
}

export default EventList
