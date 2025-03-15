import React, { useState, useEffect } from 'react'
import axios from '../services/api'

export interface TaskData {
  id?: number
  title: string
  description?: string
  starred?: boolean
}

interface TaskFormProps {
  listId: number
  initialData?: TaskData
  onTaskCreated?: () => void
  onTaskUpdated?: () => void
}

const TaskForm: React.FC<TaskFormProps> = ({ listId, initialData, onTaskCreated, onTaskUpdated }) => {
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [starred, setStarred] = useState(initialData?.starred || false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title)
      setDescription(initialData.description || '')
      setStarred(initialData.starred || false)
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (initialData && initialData.id) {
        await axios.put(`/tasks/lists/${listId}/tasks/${initialData.id}`, { title, description, starred })
        if (onTaskUpdated) onTaskUpdated()
      } else {
        await axios.post(`/tasks/lists/${listId}/tasks`, { title, description, starred })
        if (onTaskCreated) onTaskCreated()
      }
      if (!initialData) {
        setTitle('')
        setDescription('')
        setStarred(false)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al enviar el formulario')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 bg-gray-50 p-4 rounded shadow">
      <h4 className="font-bold mb-2">{initialData ? 'Editar Tarea' : 'Crear Tarea'}</h4>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="mb-2">
        <label className="block mb-1">Título</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-gray-300 p-2 rounded" required />
      </div>
      <div className="mb-2">
        <label className="block mb-1">Descripción</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-gray-300 p-2 rounded" />
      </div>
      <div className="mb-2 flex items-center">
        <input type="checkbox" checked={starred} onChange={() => setStarred(!starred)} className="mr-2" />
        <label>Marcar como importante</label>
      </div>
      <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">
        {initialData ? 'Actualizar Tarea' : 'Crear Tarea'}
      </button>
    </form>
  )
}

export default TaskForm;
