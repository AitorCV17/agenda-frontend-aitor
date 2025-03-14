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
  reminderOffset?: number  // Se almacena en minutos
  recurrence?: 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
  location?: string
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
  const [location, setLocation] = useState(initialData?.location || '')
  
  // Estados para el recordatorio
  const [reminderActive, setReminderActive] = useState<boolean>(initialData?.reminderOffset !== undefined)
  const [reminderTime, setReminderTime] = useState<number>(initialData?.reminderOffset || 0)
  const [reminderUnit, setReminderUnit] = useState<'minutes' | 'hours' | 'days'>('minutes')
  const [recurrence, setRecurrence] = useState(initialData?.recurrence || 'NONE')
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title)
      setDescription(initialData.description || '')
      setStartTime(initialData.startTime)
      setEndTime(initialData.endTime)
      setColor(initialData.color || '#000000')
      setLocation(initialData.location || '')
      if (initialData.reminderOffset !== undefined && initialData.reminderOffset !== null) {
         setReminderActive(true)
         const offset = initialData.reminderOffset
         if (offset % 1440 === 0) {
           setReminderUnit('days')
           setReminderTime(offset / 1440)
         } else if (offset % 60 === 0) {
           setReminderUnit('hours')
           setReminderTime(offset / 60)
         } else {
           setReminderUnit('minutes')
           setReminderTime(offset)
         }
      } else {
         setReminderActive(false)
         setReminderTime(0)
         setReminderUnit('minutes')
      }
      setRecurrence(initialData.recurrence || 'NONE')
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Convertir el recordatorio a minutos según la unidad seleccionada
      let computedReminder: number | null = null
      if (reminderActive) {
        let offset = reminderTime
        if (reminderUnit === 'hours') {
          offset = reminderTime * 60
        } else if (reminderUnit === 'days') {
          offset = reminderTime * 1440
        }
        computedReminder = offset
      }

      const payload = {
        title,
        description,
        startTime,
        endTime,
        color,
        location,
        reminderOffset: computedReminder,
        recurrence
      }

      if (initialData && initialData.id) {
        await axios.put(`/events/${initialData.id}`, payload)
        if (onEventUpdated) onEventUpdated()
      } else {
        await axios.post('/events', payload)
        if (onEventCreated) onEventCreated()
      }
      if (!initialData) {
        setTitle('')
        setDescription('')
        setStartTime('')
        setEndTime('')
        setColor('#000000')
        setLocation('')
        setReminderActive(false)
        setReminderTime(0)
        setReminderUnit('minutes')
        setRecurrence('NONE')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al enviar el formulario')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
      <h3 className="text-xl font-bold mb-4">
        {initialData ? 'Editar Evento' : 'Crear Evento'}
      </h3>
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

      {/* Campo para Ubicación con Google Autocomplete */}
      <div className="mb-4">
        <label className="block mb-1">Ubicación</label>
        <ReactGoogleAutocomplete
          apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
          onPlaceSelected={(place) => {
            // Se captura la dirección formateada; puedes modificar según necesites
            setLocation(place.formatted_address)
          }}
          placeholder="Busca una ubicación..."
          className="w-full border border-gray-300 p-2 rounded"
        />
        {location && (
          <p className="text-sm text-gray-600 mt-1">Seleccionado: {location}</p>
        )}
      </div>

      {/* Sección para activar y configurar el recordatorio */}
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={reminderActive}
            onChange={(e) => setReminderActive(e.target.checked)}
            className="mr-2"
          />
          Activar recordatorio
        </label>
      </div>
      {reminderActive && (
        <div className="mb-4">
          <label className="block mb-1">Recordatorio (tiempo antes)</label>
          <div className="flex items-center">
            <input
              type="number"
              value={reminderTime}
              onChange={(e) =>
                setReminderTime(e.target.value ? parseInt(e.target.value) : 0)
              }
              className="w-20 border border-gray-300 p-2 rounded mr-2"
              min="1"
              required
            />
            <select
              value={reminderUnit}
              onChange={(e) =>
                setReminderUnit(e.target.value as 'minutes' | 'hours' | 'days')
              }
              className="border border-gray-300 p-2 rounded"
            >
              <option value="minutes">minutos</option>
              <option value="hours">horas</option>
              <option value="days">días</option>
            </select>
          </div>
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-1">Recurrencia</label>
        <select
          value={recurrence}
          onChange={(e) =>
            setRecurrence(
              e.target.value as 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
            )
          }
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
