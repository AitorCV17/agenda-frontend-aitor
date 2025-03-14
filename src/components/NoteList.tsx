// src/components/NoteList.tsx
import React, { useState } from 'react'
import axios from '../services/api'
import ShareNoteModal from './ShareNoteModal'
import { motion } from 'framer-motion'

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
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl transition-all duration-500">
      <h3 className="text-2xl font-bold text-azure-700 dark:text-azure-300 mb-6">
        Listado de Notas
      </h3>

      {notes.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No hay notas.</p>
      ) : (
        <ul className="space-y-4">
          {notes.map(note => {
            const noteColor = note.color || '#5179a6'

            return (
              <motion.li
                key={note.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                style={{
                  backgroundColor: `${noteColor}20`,
                  borderColor: `${noteColor}66`
                }}
                className={`
                  flex flex-col sm:flex-row sm:items-center justify-between
                  border rounded-xl p-6
                  shadow-md hover:shadow-lg
                  transition-all duration-300
                  hover:-translate-y-1 hover:scale-[1.02]
                  backdrop-blur-sm
                `}
              >
                {/* Columna izquierda: Detalles */}
                <div className="flex flex-col space-y-2 mb-4 sm:mb-0 sm:pr-4">
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {note.title}
                  </p>

                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {new Date(note.createdAt).toLocaleString()}
                  </p>

                  {note.content && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {note.content.length > 100
                        ? `${note.content.slice(0, 100)}...`
                        : note.content}
                    </p>
                  )}
                </div>

                {/* Columna derecha: Acciones */}
                <div className="flex flex-wrap gap-2 justify-end">
                  <button
                    onClick={() => onEdit(note)}
                    className="bg-azure-700 hover:bg-azure-600 text-white px-4 py-2 rounded-lg text-sm shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-azure-300 dark:focus:ring-azure-800"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => setShareNoteId(note.id)}
                    className="bg-azure-500 hover:bg-azure-400 text-white px-4 py-2 rounded-lg text-sm shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-azure-300 dark:focus:ring-azure-800"
                  >
                    Compartir
                  </button>

                  <button
                    onClick={() => handleDelete(note.id)}
                    className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-300 dark:focus:ring-red-800"
                  >
                    Eliminar
                  </button>
                </div>
              </motion.li>
            )
          })}
        </ul>
      )}

      {shareNoteId && (
        <ShareNoteModal
          noteId={shareNoteId}
          onClose={() => setShareNoteId(null)}
        />
      )}
    </div>
  )
}

export default NoteList
