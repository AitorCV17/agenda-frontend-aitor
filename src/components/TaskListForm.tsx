import React, { useState } from 'react'
import axios from '../services/api'

interface TaskListFormProps {
  onCreated: () => void
}

const TaskListForm: React.FC<TaskListFormProps> = ({ onCreated }) => {
  const [name, setName] = useState('')
  const [pinned, setPinned] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post('/tasks/lists', { name, pinned })
      setName('')
      setPinned(false)
      onCreated()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear la lista')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
      <h3 className="text-xl font-bold mb-4">Crear Lista de Tareas</h3>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="mb-4">
        <label className="block mb-1">Nombre de la lista</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
      </div>
      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          checked={pinned}
          onChange={() => setPinned(!pinned)}
          className="mr-2"
        />
        <label>Fijar esta lista en la parte superior</label>
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        Crear Lista
      </button>
    </form>
  )
}

export default TaskListForm
