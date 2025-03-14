import React, { useState, useEffect } from 'react'
import axios from '../services/api'

export interface NoteData {
  id?: number
  title: string
  content?: string
  color?: string
}

interface NoteFormProps {
  initialData?: NoteData
  onNoteCreated?: () => void
  onNoteUpdated?: () => void
}

const NoteForm: React.FC<NoteFormProps> = ({ initialData, onNoteCreated, onNoteUpdated }) => {
  const [title, setTitle] = useState(initialData?.title || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [color, setColor] = useState(initialData?.color || '#000000')
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title)
      setContent(initialData.content || '')
      setColor(initialData.color || '#000000')
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (initialData && initialData.id) {
        await axios.put(`/notes/${initialData.id}`, { title, content, color })
        if (onNoteUpdated) onNoteUpdated()
      } else {
        await axios.post('/notes', { title, content, color })
        if (onNoteCreated) onNoteCreated()
        setTitle('')
        setContent('')
        setColor('#000000')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al enviar la nota')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
      <h3 className="text-xl font-bold mb-4">{initialData ? 'Editar Nota' : 'Crear Nota'}</h3>
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
        <label className="block mb-1">Contenido</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
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
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {initialData ? 'Actualizar Nota' : 'Crear Nota'}
      </button>
    </form>
  )
}

export default NoteForm
