import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface EventDetail {
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
}

interface EventDetailModalProps {
  event: EventDetail
  onClose: () => void
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center px-2"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white dark:bg-gray-900 w-full max-w-md rounded-lg shadow-xl p-6 relative"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 dark:text-gray-400 text-2xl font-bold hover:text-red-500 focus:outline-none"
          >
            &times;
          </button>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Detalles del Evento
          </h2>
          <p className="text-md text-gray-700 dark:text-gray-300 mb-2">
            <strong>Título:</strong> {event.title}
          </p>
          {event.description && (
            <p className="text-md text-gray-700 dark:text-gray-300 mb-2">
              <strong>Descripción:</strong> {event.description}
            </p>
          )}
          <p className="text-md text-gray-700 dark:text-gray-300 mb-2">
            <strong>Inicio:</strong> {new Date(event.startTime).toLocaleString()}
          </p>
          <p className="text-md text-gray-700 dark:text-gray-300 mb-2">
            <strong>Fin:</strong> {new Date(event.endTime).toLocaleString()}
          </p>
          {event.location && (
            <p className="text-md text-gray-700 dark:text-gray-300 mb-2">
              <strong>Ubicación:</strong> {event.location}
            </p>
          )}
          {event.user && (
            <p className="text-md text-gray-700 dark:text-gray-300">
              <strong>Propietario:</strong> {event.user.email}
            </p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default EventDetailModal
