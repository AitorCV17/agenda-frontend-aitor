// src/pages/Events.tsx
import React, { useState, useEffect } from 'react'
import axios from '../services/api'
import EventList from '../components/EventList'
import EventModal from '../components/EventModal'
import { EventData } from '../components/EventForm'

const Events: React.FC = () => {
  const [events, setEvents] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [modalInitialData, setModalInitialData] = useState<EventData | undefined>(
    undefined
  )

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

  const handleCreate = () => {
    setModalInitialData(undefined)
    setShowModal(true)
  }

  const handleEdit = (event: any) => {
    setModalInitialData(event)
    setShowModal(true)
  }

  const handleModalClose = () => {
    setShowModal(false)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Eventos</h2>
      <button
        onClick={handleCreate}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Crear Evento
      </button>
      <EventList events={events} onRefresh={fetchEvents} onEdit={handleEdit} />
      <EventModal
        isOpen={showModal}
        initialData={modalInitialData}
        onClose={handleModalClose}
        onEventSaved={fetchEvents}
      />
    </div>
  )
}

export default Events
