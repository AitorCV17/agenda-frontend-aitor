// src/components/EventModal.tsx
import React from 'react'
import EventForm, { EventData } from './EventForm'

interface EventModalProps {
  isOpen: boolean
  initialData?: EventData
  onClose: () => void
  onEventSaved: () => void
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, initialData, onClose, onEventSaved }) => {
  if (!isOpen) return null

  const handleEventCreated = () => {
    onEventSaved()
    onClose()
  }

  const handleEventUpdated = () => {
    onEventSaved()
    onClose()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-md w-11/12 max-w-lg">
        <button
          onClick={onClose}
          className="float-right text-gray-600 text-2xl leading-none"
        >
          &times;
        </button>
        <EventForm
          initialData={initialData}
          onEventCreated={handleEventCreated}
          onEventUpdated={handleEventUpdated}
        />
      </div>
    </div>
  )
}

export default EventModal
