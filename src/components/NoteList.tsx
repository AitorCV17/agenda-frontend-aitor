// src/components/NoteList.tsx
import React, { useState } from 'react'
import axios from '../services/api'
import ShareNoteModal from './ShareNoteModal'

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
  onEdit: (note: Note) => void
}

const NoteList: React.FC<NoteListProps> = ({ notes, onRefresh, onEdit }) => {
  const [shareNoteId, setShareNoteId] = useState<number | null>(null)

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/notes/${id}`)
      onRefresh()
    } catch (err) {
      console.error('Error al eliminar la nota')
    }
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
                <button onClick={() => onEdit(note)} className="mr-2 bg-green-500 text-white px-2 py-1 rounded">
                  Editar
                </button>
                <button onClick={() => setShareNoteId(note.id)} className="mr-2 bg-blue-500 text-white px-2 py-1 rounded">
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
      {shareNoteId && <ShareNoteModal noteId={shareNoteId} onClose={() => setShareNoteId(null)} />}
    </div>
  )
}

export default NoteList
