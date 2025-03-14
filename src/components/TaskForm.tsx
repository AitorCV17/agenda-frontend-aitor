import React, { useState } from 'react'
import axios from '../services/api'

interface TaskFormProps {
  listId: number
  onCreated: () => void
}

const TaskForm: React.FC<TaskFormProps> = ({ listId, onCreated }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [starred, setStarred] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post(`/tasks/lists/${listId}/tasks`, { title, description, starred })
      setTitle('')
      setDescription('')
      setStarred(false)
      onCreated()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear la tarea')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 bg-gray-50 p-4 rounded shadow">
      <h4 className="font-bold mb-2">Nueva Tarea</h4>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="mb-2">
        <label className="block mb-1">Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>
      <div className="mb-2 flex items-center">
        <input
          type="checkbox"
          checked={starred}
          onChange={() => setStarred(!starred)}
          className="mr-2"
        />
        <label>Marcar como importante</label>
      </div>
      <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">
        Agregar Tarea
      </button>
    </form>
  )
}

export default TaskForm
