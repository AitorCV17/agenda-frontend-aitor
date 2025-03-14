import React, { useState, useEffect } from 'react'
import axios from '../services/api'

export interface EventData {
  id?: number
  title: string
  description?: string
  startTime: string
  endTime: string
  color?: string
  reminderOffset?: number
  recurrence?: 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
}

interface EventFormProps {
  initialData?: EventData
  onEventCreated?: () => void
  onEventUpdated?: () => void
}

const EventForm: React.FC<EventFormProps> = ({ initialData, onEventCreated, onEventUpdated }) => {
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [startTime, setStartTime] = useState(initialData?.startTime || '')
  const [endTime, setEndTime] = useState(initialData?.endTime || '')
  const [color, setColor] = useState(initialData?.color || '#000000')
  const [reminderOffset, setReminderOffset] = useState<number | undefined>(initialData?.reminderOffset)
  const [recurrence, setRecurrence] = useState(initialData?.recurrence || 'NONE')
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title)
      setDescription(initialData.description || '')
      setStartTime(initialData.startTime)
      setEndTime(initialData.endTime)
      setColor(initialData.color || '#000000')
      setReminderOffset(initialData.reminderOffset)
      setRecurrence(initialData.recurrence || 'NONE')
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (initialData && initialData.id) {
        await axios.put(`/events/${initialData.id}`, {
          title,
          description,
          startTime,
          endTime,
          color,
          reminderOffset,
          recurrence
        })
        if (onEventUpdated) onEventUpdated()
      } else {
        await axios.post('/events', {
          title,
          description,
          startTime,
          endTime,
          color,
          reminderOffset,
          recurrence
        })
        if (onEventCreated) onEventCreated()
      }
      if (!initialData) {
        setTitle('')
        setDescription('')
        setStartTime('')
        setEndTime('')
        setColor('#000000')
        setReminderOffset(undefined)
        setRecurrence('NONE')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al enviar el formulario')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
      <h3 className="text-xl font-bold mb-4">{initialData ? 'Editar Evento' : 'Crear Evento'}</h3>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="mb-4">
        <label className="block mb-1">Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Inicio (fecha y hora)</label>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Fin (fecha y hora)</label>
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
      </div>
      <div className="mb-4 flex items-center">
        <label className="block mr-2">Color:</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-10 h-10 border-2"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Recordatorio (minutos antes)</label>
        <input
          type="number"
          value={reminderOffset || ''}
          onChange={(e) => setReminderOffset(e.target.value ? parseInt(e.target.value) : undefined)}
          className="w-full border border-gray-300 p-2 rounded"
          placeholder="Ejemplo: 10"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Recurrencia</label>
        <select
          value={recurrence}
          onChange={(e) => setRecurrence(e.target.value as 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY')}
          className="w-full border border-gray-300 p-2 rounded"
        >
          <option value="NONE">Sin recurrencia</option>
          <option value="DAILY">Diario</option>
          <option value="WEEKLY">Semanal</option>
          <option value="MONTHLY">Mensual</option>
          <option value="YEARLY">Anual</option>
        </select>
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {initialData ? 'Actualizar Evento' : 'Crear Evento'}
      </button>
    </form>
  )
}

export default EventForm
