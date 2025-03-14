import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../services/api'

interface Note {
  id: number
  title: string
  content?: string
  color?: string
  createdAt: string
}

interface NoteListProps {
  notes: Note[]
  onRefresh: () => void
}

const NoteList: React.FC<NoteListProps> = ({ notes, onRefresh }) => {
  const navigate = useNavigate()

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/notes/${id}`)
      onRefresh()
    } catch (err) {
      console.error('Error al eliminar la nota')
    }
  }

  const handleShare = async (id: number) => {
    const userEmails = prompt('Ingrese los correos separados por coma:')
    if (!userEmails) return
    const emailsArray = userEmails.split(',').map(email => email.trim())
    try {
      await axios.post(`/notes/${id}/share`, { userEmails: emailsArray })
      alert('Nota compartida')
    } catch (err) {
      console.error('Error al compartir la nota')
    }
  }

  const handleEdit = (id: number) => {
    navigate(`/notes/edit/${id}`)
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-xl font-bold mb-4">Listado de Notas</h3>
      {notes.length === 0 ? (
        <p>No hay notas.</p>
      ) : (
        <ul>
          {notes.map(note => (
            <li key={note.id} className="border-b border-gray-200 py-2 flex justify-between items-center">
              <div>
                <p className="font-bold" style={{ color: note.color || '#000' }}>{note.title}</p>
                <p className="text-xs text-gray-600">{new Date(note.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <button onClick={() => handleEdit(note.id)} className="mr-2 bg-green-500 text-white px-2 py-1 rounded">
                  Editar
                </button>
                <button onClick={() => handleShare(note.id)} className="mr-2 bg-blue-500 text-white px-2 py-1 rounded">
                  Compartir
                </button>
                <button onClick={() => handleDelete(note.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default NoteList
