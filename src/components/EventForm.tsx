import React, { useState, useEffect } from 'react'
import axios from '../services/api'
import ReactGoogleAutocomplete from 'react-google-autocomplete'

export interface EventData {
  id?: number
  title: string
  description?: string
  startTime: string
  endTime: string
  color?: string
  reminderOffset?: number
  recurrence?: 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
  location?: string
}

interface EventFormProps {
  initialData?: EventData
  onEventCreated?: () => void
  onEventUpdated?: () => void
}

const EventForm: React.FC<EventFormProps> = ({ initialData, onEventCreated, onEventUpdated }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [color, setColor] = useState('#5179a6')
  const [location, setLocation] = useState('')
  const [recurrence, setRecurrence] = useState<'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'>('NONE')
  const [reminderActive, setReminderActive] = useState(false)
  const [reminderTime, setReminderTime] = useState(0)
  const [reminderUnit, setReminderUnit] = useState<'minutes' | 'hours' | 'days'>('minutes')
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '')
      setDescription(initialData.description || '')
      setStartTime(formatDateTimeLocal(initialData.startTime))
      setEndTime(formatDateTimeLocal(initialData.endTime))
      setColor(initialData.color || '#5179a6')
      setLocation(initialData.location || '')
      setRecurrence(initialData.recurrence ? initialData.recurrence : 'NONE')
      
      if (initialData.reminderOffset !== undefined && initialData.reminderOffset > 0) {
        setReminderActive(true)
        if (initialData.reminderOffset % 1440 === 0) {
          setReminderUnit('days')
          setReminderTime(initialData.reminderOffset / 1440)
        } else if (initialData.reminderOffset % 60 === 0) {
          setReminderUnit('hours')
          setReminderTime(initialData.reminderOffset / 60)
        } else {
          setReminderUnit('minutes')
          setReminderTime(initialData.reminderOffset)
        }
      } else {
        setReminderActive(false)
        setReminderTime(0)
        setReminderUnit('minutes')
      }
    }
  }, [initialData])

  const formatDateTimeLocal = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const pad = (num: number) => String(num).padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let computedReminder: number = reminderTime * (reminderUnit === 'hours' ? 60 : reminderUnit === 'days' ? 1440 : 1)
      const payload: EventData = {
        title,
        description,
        startTime,
        endTime,
        color,
        location,
        recurrence,
        reminderOffset: reminderActive ? computedReminder : undefined
      }
      if (initialData && initialData.id) {
        await axios.put(`/events/${initialData.id}`, payload)
        if (onEventUpdated) onEventUpdated()
      } else {
        await axios.post('/events', payload)
        if (onEventCreated) onEventCreated()
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al enviar el formulario')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white dark:bg-gray-900 p-4 rounded-md shadow-sm transition-all duration-300">
      {error && <div className="text-red-500 bg-red-50 dark:bg-red-900 dark:text-red-400 px-4 py-2 rounded">{error}</div>}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm focus:ring-azure-500 focus:ring-2 outline-none transition" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm focus:ring-azure-500 focus:ring-2 outline-none transition resize-none" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Inicio</label>
          <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm focus:ring-azure-500 focus:ring-2 outline-none transition" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fin</label>
          <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm focus:ring-azure-500 focus:ring-2 outline-none transition" required />
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Color</label>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-700 cursor-pointer" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ubicación</label>
        <ReactGoogleAutocomplete apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} onPlaceSelected={(place) => setLocation(place.formatted_address)} placeholder="Busca una ubicación..." defaultValue={location} className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm focus:ring-azure-500 focus:ring-2 outline-none transition" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recurrencia</label>
        <select value={recurrence} onChange={(e) => setRecurrence(e.target.value as any)} className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm focus:ring-azure-500 focus:ring-2 outline-none transition">
          <option value="NONE">Sin recurrencia</option>
          <option value="DAILY">Diario</option>
          <option value="WEEKLY">Semanal</option>
          <option value="MONTHLY">Mensual</option>
          <option value="YEARLY">Anual</option>
        </select>
      </div>
      <div className="flex items-center space-x-2">
        <input type="checkbox" checked={reminderActive} onChange={(e) => setReminderActive(e.target.checked)} className="w-4 h-4 text-azure-600 focus:ring-azure-500 border-gray-300 rounded" />
        <label className="text-sm text-gray-700 dark:text-gray-300">Activar recordatorio</label>
      </div>
      {reminderActive && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tiempo antes</label>
            <input type="number" value={reminderTime} onChange={(e) => setReminderTime(Number(e.target.value))} className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm focus:ring-azure-500 focus:ring-2 outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unidad</label>
            <select value={reminderUnit} onChange={(e) => setReminderUnit(e.target.value as any)} className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm focus:ring-azure-500 focus:ring-2 outline-none transition">
              <option value="minutes">Minutos</option>
              <option value="hours">Horas</option>
              <option value="days">Días</option>
            </select>
          </div>
        </div>
      )}
      <button type="submit" className="w-full bg-azure-700 hover:bg-azure-600 text-white font-semibold py-2 rounded shadow-md text-sm transition-all duration-300 focus:ring-4 focus:ring-azure-300 dark:focus:ring-azure-800">
        {initialData ? 'Actualizar Evento' : 'Crear Evento'}
      </button>
    </form>
  )
}

export default EventForm
